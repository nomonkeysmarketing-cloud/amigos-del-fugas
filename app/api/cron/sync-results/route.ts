import { NextResponse } from 'next/server';
import {
  listMatches,
  setMatchRemoteId,
  setMatchResultFromSource,
  logSync,
  type Match,
} from '@/lib/db';
import {
  isConfigured,
  listWorldCupMatches,
  normalizeCode,
  type FdMatch,
} from '@/lib/football-data';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

const SOURCE = 'football-data.org';

function unauthorized() {
  return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
}

export async function GET(request: Request) {
  // Vercel Cron envía Authorization: Bearer <CRON_SECRET>. Si no está la env var,
  // exigimos un query ?key=... como fallback para invocación manual desde admin.
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const url = new URL(request.url);
  const queryKey = url.searchParams.get('key');

  if (cronSecret) {
    const valid =
      authHeader === `Bearer ${cronSecret}` || queryKey === cronSecret;
    if (!valid) return unauthorized();
  } else {
    // Sin CRON_SECRET, requerimos al menos query key === ADMIN_PIN para manual
    if (queryKey !== process.env.ADMIN_PIN) return unauthorized();
  }

  if (!isConfigured()) {
    await logSync({
      source: SOURCE,
      status: 'skipped',
      message: 'FOOTBALL_DATA_TOKEN no configurado.',
    });
    return NextResponse.json({
      ok: false,
      skipped: true,
      reason: 'FOOTBALL_DATA_TOKEN missing',
    });
  }

  try {
    const [remote, local] = await Promise.all([
      listWorldCupMatches(),
      listMatches(),
    ]);

    // Index nuestros partidos por remote_id (rápido) y por tla+date (descubrimiento).
    const byRemoteId = new Map<number, Match>();
    const byKey = new Map<string, Match>();

    for (const m of local) {
      if (m.remote_id) byRemoteId.set(m.remote_id, m);
      // Sólo indexamos fase de grupos para matching automático
      if (m.stage === 'group' && m.home_code !== 'TBD') {
        const date = m.kickoff_utc.slice(0, 10);
        // Doble entrada (home/away order) para tolerancia
        byKey.set(matchKey(date, m.home_code, m.away_code), m);
        byKey.set(matchKey(date, m.away_code, m.home_code), m);
      }
    }

    let matched = 0;
    let mappedNow = 0;
    let updated = 0;
    const issues: string[] = [];

    for (const fd of remote) {
      const local_match = await resolveLocalMatch(fd, byRemoteId, byKey);
      if (!local_match) continue;
      matched++;

      // Mapeo first-time: guarda remote_id
      if (!local_match.remote_id) {
        try {
          await setMatchRemoteId(local_match.id, fd.id, SOURCE);
          mappedNow++;
        } catch (e) {
          issues.push(`${local_match.id}: remap fail (${(e as Error).message})`);
        }
      }

      // Si FD dice FINISHED y tiene marcador → aplicamos si nuestro DB aún no está final
      if (fd.status === 'FINISHED' && fd.score.fullTime.home !== null && fd.score.fullTime.away !== null) {
        const did = await setMatchResultFromSource(
          local_match.id,
          fd.score.fullTime.home,
          fd.score.fullTime.away,
          SOURCE,
        );
        if (did) updated++;
      }
    }

    // Si actualizamos algo, revalida UI
    if (updated > 0) {
      revalidatePath('/');
      revalidatePath('/partidos');
      revalidatePath('/tablero');
      revalidatePath('/admin');
    }

    const message =
      `Remotos: ${remote.length} · Matcheados: ${matched} · ` +
      `Mapeados nuevos: ${mappedNow} · Actualizados: ${updated}` +
      (issues.length ? ` · Issues: ${issues.length}` : '');

    await logSync({
      source: SOURCE,
      status: 'ok',
      matched,
      updated,
      message,
    });

    return NextResponse.json({
      ok: true,
      total_remote: remote.length,
      matched,
      mapped_now: mappedNow,
      updated,
      issues,
    });
  } catch (e) {
    const err = e as Error;
    await logSync({
      source: SOURCE,
      status: 'error',
      message: err.message.slice(0, 240),
    });
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

function matchKey(date: string, home: string, away: string): string {
  return `${date}|${home}|${away}`;
}

async function resolveLocalMatch(
  fd: FdMatch,
  byRemoteId: Map<number, Match>,
  byKey: Map<string, Match>,
): Promise<Match | null> {
  // 1) Si ya está mapeado, ganamos
  const known = byRemoteId.get(fd.id);
  if (known) return known;

  // 2) Si es fase de grupos, intenta match por fecha + tla
  const home = normalizeCode(fd.homeTeam.tla);
  const away = normalizeCode(fd.awayTeam.tla);
  if (!home || !away) return null;
  const fdDate = fd.utcDate.slice(0, 10);

  // Probamos día exacto, día siguiente (TZ slop), día anterior
  for (const offset of [0, 1, -1]) {
    const d = shiftDate(fdDate, offset);
    const hit = byKey.get(matchKey(d, home, away));
    if (hit) {
      // Sanity: kickoffs no deben distar más de 4h
      const diff = Math.abs(
        new Date(fd.utcDate).getTime() - new Date(hit.kickoff_utc).getTime(),
      );
      if (diff < 4 * 60 * 60 * 1000) return hit;
    }
  }
  return null;
}

function shiftDate(yyyymmdd: string, offsetDays: number): string {
  const d = new Date(`${yyyymmdd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}
