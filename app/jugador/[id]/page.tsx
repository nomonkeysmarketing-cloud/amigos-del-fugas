import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
  getPredictionHistoryForUser,
  getUser,
  isMatchLocked,
  leaderboard,
} from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calcPoints } from '@/lib/scoring';
import { FlagBadge } from '@/components/FlagBadge';
import { PointsBadge } from '@/components/PointsBadge';
import { STAGE_LABELS } from '@/lib/matches-data';

export const dynamic = 'force-dynamic';

const AVATAR_PALETTE: Record<string, string> = {
  wunshi: '#00d86b',
  'la-ciruela': '#ff1f6d',
  'la-tlayuda': '#ffc93c',
  'el-fugas': '#5dcaf0',
  'el-cuadrado': '#c8a2ff',
};

export default async function PlayerHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await getCurrentUser();
  if (!me) redirect('/login');
  if (!me.pin_changed) redirect('/cambiar-pin');

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (!Number.isFinite(userId)) notFound();

  const [target, history, board] = await Promise.all([
    getUser(userId),
    getPredictionHistoryForUser(userId),
    leaderboard(),
  ]);
  if (!target) notFound();

  const isMe = target.id === me.id;
  const rankIdx = board.findIndex((r) => r.user_id === target.id);
  const myStats = board[rankIdx];
  const avatarBg = AVATAR_PALETTE[target.avatar_seed] ?? '#7a8c82';

  // Para "predicciones reveladas" pero no finalizadas, filtramos los locked
  const now = new Date();
  const visible = history.filter((h) => isMatchLocked(h.match, now) || h.match.status === 'final');
  const hidden = history.length - visible.length;

  const finalized = visible.filter((h) => h.match.status === 'final');
  const lockedNotFinal = visible.filter((h) => h.match.status !== 'final');

  return (
    <section className="mx-auto max-w-[1080px] px-4 py-8 md:px-10 md:py-16">
      <Link
        href="/tablero"
        className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
      >
        ← Volver al tablero
      </Link>

      {/* Hero */}
      <header className="mt-6 flex flex-wrap items-center gap-5 md:gap-6">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-[28px] font-semibold text-[#0a1f14] ring-2 ring-black/30 md:h-24 md:w-24 md:text-[32px]"
          style={{ background: avatarBg }}
          aria-hidden
        >
          {target.name.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="eyebrow">
            Historial · {isMe ? 'TU CARRERA' : `${target.name.toUpperCase()}`}
          </p>
          <h1 className="display mt-2 text-[clamp(36px,8vw,72px)] leading-[0.92]">
            {target.name}
            {isMe && <span className="text-[var(--color-primary)]">.</span>}
          </h1>
          {myStats && (
            <p className="mt-3 text-[var(--color-secondary-text)]">
              Posición{' '}
              <span className="mono font-semibold text-[var(--color-text)]">
                #{String(rankIdx + 1).padStart(2, '0')}
              </span>{' '}
              · <span className="mono text-[var(--color-primary)]">{myStats.total}</span> puntos
              totales
            </p>
          )}
        </div>
      </header>

      {/* Stats */}
      {myStats && (
        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-4">
          <StatCard label="Puntos" value={myStats.total} tone="primary" />
          <StatCard label="Jugadas" value={myStats.predicted} tone="neutral" />
          <StatCard label="Exactos" value={myStats.exact_count} tone="gold" sub="+3 c/u" />
          <StatCard label="Al ganador" value={myStats.result_count} tone="primary" sub="+1 c/u" />
        </div>
      )}

      {/* Finalizados */}
      {finalized.length > 0 && (
        <div className="mt-12">
          <p className="eyebrow">Partidos finalizados</p>
          <h2 className="display mt-3 text-[clamp(24px,4vw,40px)] leading-[0.95]">
            Donde ya hubo <span className="text-[var(--color-primary)]">veredicto</span>.
          </h2>
          <div className="surface mt-6 overflow-hidden">
            <HistoryRowsHeader />
            {finalized.map((h) => (
              <FinalizedRow key={h.match.id} h={h} />
            ))}
          </div>
        </div>
      )}

      {/* Reveladas pero no finalizadas (locked, esperando resultado) */}
      {lockedNotFinal.length > 0 && (
        <div className="mt-12">
          <p className="eyebrow">Apostadas · Esperando resultado</p>
          <h2 className="display mt-3 text-[clamp(24px,4vw,40px)] leading-[0.95]">
            Cartas <span className="text-[var(--color-primary)]">sobre la mesa</span>.
          </h2>
          <div className="surface mt-6 overflow-hidden">
            <HistoryRowsHeader />
            {lockedNotFinal.map((h) => (
              <LockedRow key={h.match.id} h={h} />
            ))}
          </div>
        </div>
      )}

      {hidden > 0 && (
        <div className="surface mt-12 px-6 py-5 text-center text-[var(--color-secondary-text)]">
          <span className="text-[var(--color-text)] font-medium">{hidden}</span>{' '}
          predicción{hidden !== 1 ? 'es' : ''} guardada{hidden !== 1 ? 's' : ''} pero todavía con el candado puesto.{' '}
          {isMe ? (
            <>Aparecen apenas se cierre cada partido.</>
          ) : (
            <>Solo se ven cuando empieza el partido respectivo.</>
          )}
        </div>
      )}

      {history.length === 0 && (
        <div className="surface mt-12 px-6 py-12 text-center text-[var(--color-secondary-text)]">
          {isMe
            ? 'Aún no has metido ningún pronóstico. Te están esperando los partidos en /partidos.'
            : `${target.name} todavía no ha metido pronósticos.`}
        </div>
      )}
    </section>
  );
}

function StatCard({
  label,
  value,
  tone,
  sub,
}: {
  label: string;
  value: number | string;
  tone: 'primary' | 'gold' | 'neutral';
  sub?: string;
}) {
  const color =
    tone === 'primary'
      ? 'text-[var(--color-primary)]'
      : tone === 'gold'
        ? 'text-[var(--color-gold)]'
        : 'text-[var(--color-text)]';
  return (
    <div className="surface px-5 py-4">
      <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className={`mono mt-2 text-[36px] font-medium leading-none tabular-nums ${color}`}>
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-[11px] text-[var(--color-muted)]">{sub}</p>
      )}
    </div>
  );
}

function HistoryRowsHeader() {
  return (
    <header className="hidden md:grid grid-cols-[64px_1fr_120px_140px_64px] items-center gap-4 border-b border-[var(--color-border)] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
      <span>ID</span>
      <span>Partido</span>
      <span>Tu jugada</span>
      <span>Real</span>
      <span className="text-right">Pts</span>
    </header>
  );
}

function MatchInfoCell({ h }: { h: { match: { id: string; grp: string | null; stage: string; home_team: string; home_code: string; away_team: string; away_code: string; kickoff_utc: string } } }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <FlagBadge code={h.match.home_code} name={h.match.home_team} size={32} />
      <span className="truncate text-[14px] font-medium">
        {h.match.home_team} <span className="text-[var(--color-muted)]">vs</span> {h.match.away_team}
      </span>
      <FlagBadge code={h.match.away_code} name={h.match.away_team} size={32} />
    </div>
  );
}

function MatchMetaMobile({ id, grp, stage, kickoff }: { id: string; grp: string | null; stage: string; kickoff: string }) {
  return (
    <p className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
      {id} · {grp ? `Grupo ${grp}` : STAGE_LABELS[stage as keyof typeof STAGE_LABELS]} ·{' '}
      {new Date(kickoff).toLocaleDateString('es-MX', {
        timeZone: 'America/Mexico_City',
        day: '2-digit',
        month: 'short',
      })}
    </p>
  );
}

function FinalizedRow({ h }: { h: Awaited<ReturnType<typeof getPredictionHistoryForUser>>[number] }) {
  const points = calcPoints(
    h.prediction.home_score,
    h.prediction.away_score,
    h.match.home_score!,
    h.match.away_score!,
  );
  const hit = points === 3 ? 'exact' : points === 1 ? 'result' : 'miss';

  return (
    <div className="border-b border-[var(--color-border)]/60 px-4 py-3 last:border-b-0 md:grid md:grid-cols-[64px_1fr_120px_140px_64px] md:items-center md:gap-4 md:px-6 md:py-4">
      {/* Mobile stack */}
      <div className="md:contents">
        <div className="md:hidden">
          <Link href={`/partidos/${h.match.id}`} className="block">
            <MatchMetaMobile id={h.match.id} grp={h.match.grp} stage={h.match.stage} kickoff={h.match.kickoff_utc} />
            <p className="mt-1 text-[14px] font-medium">
              {h.match.home_team} <span className="text-[var(--color-muted)]">vs</span> {h.match.away_team}
            </p>
          </Link>
          <div className="mt-2 flex items-center gap-3 text-[12px]">
            <span className="mono text-[var(--color-gold)]">
              Tu: {h.prediction.home_score}·{h.prediction.away_score}
            </span>
            <span className="mono text-[var(--color-text)]">
              Real: {h.match.home_score}·{h.match.away_score}
            </span>
            <span className="ml-auto">
              <PointsBadge points={points} />
            </span>
          </div>
        </div>
        <span className="hidden mono text-[11px] tabular-nums text-[var(--color-muted)] md:inline">
          {h.match.id}
        </span>
        <span className="hidden md:block">
          <Link href={`/partidos/${h.match.id}`} className="hover:opacity-80">
            <MatchInfoCell h={h} />
          </Link>
        </span>
        <span
          className={`hidden mono text-[16px] tabular-nums md:block ${
            hit === 'exact'
              ? 'text-[var(--color-gold)]'
              : hit === 'result'
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-muted)]'
          }`}
        >
          {h.prediction.home_score} · {h.prediction.away_score}
        </span>
        <span className="hidden mono text-[16px] tabular-nums text-[var(--color-text)] md:block">
          {h.match.home_score} · {h.match.away_score}
        </span>
        <span className="hidden justify-end md:flex">
          <PointsBadge points={points} />
        </span>
      </div>
    </div>
  );
}

function LockedRow({ h }: { h: Awaited<ReturnType<typeof getPredictionHistoryForUser>>[number] }) {
  return (
    <div className="border-b border-[var(--color-border)]/60 px-4 py-3 last:border-b-0 md:grid md:grid-cols-[64px_1fr_120px_140px_64px] md:items-center md:gap-4 md:px-6 md:py-4">
      <div className="md:contents">
        <div className="md:hidden">
          <Link href={`/partidos/${h.match.id}`} className="block">
            <MatchMetaMobile id={h.match.id} grp={h.match.grp} stage={h.match.stage} kickoff={h.match.kickoff_utc} />
            <p className="mt-1 text-[14px] font-medium">
              {h.match.home_team} <span className="text-[var(--color-muted)]">vs</span> {h.match.away_team}
            </p>
          </Link>
          <div className="mt-2 flex items-center gap-3 text-[12px]">
            <span className="mono text-[var(--color-gold)]">
              Tu: {h.prediction.home_score}·{h.prediction.away_score}
            </span>
            <span className="mono text-[var(--color-muted)]">Esperando resultado</span>
          </div>
        </div>
        <span className="hidden mono text-[11px] tabular-nums text-[var(--color-muted)] md:inline">
          {h.match.id}
        </span>
        <span className="hidden md:block">
          <Link href={`/partidos/${h.match.id}`} className="hover:opacity-80">
            <MatchInfoCell h={h} />
          </Link>
        </span>
        <span className="hidden mono text-[16px] tabular-nums text-[var(--color-gold)] md:block">
          {h.prediction.home_score} · {h.prediction.away_score}
        </span>
        <span className="hidden mono text-[14px] text-[var(--color-muted)] md:block">—</span>
        <span className="hidden text-right text-[12px] text-[var(--color-muted)] md:block">—</span>
      </div>
    </div>
  );
}
