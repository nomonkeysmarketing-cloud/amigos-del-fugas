import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  getAllPredictionsByMatch,
  isMatchLocked,
  listMatches,
  listUsers,
  type Match,
  type Prediction,
  type User,
} from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calcPoints } from '@/lib/scoring';
import { STAGE_LABELS } from '@/lib/matches-data';

export const dynamic = 'force-dynamic';

const AVATAR_PALETTE: Record<string, string> = {
  wunshi: '#00d86b',
  'la-ciruela': '#ff1f6d',
  'la-tlayuda': '#ffc93c',
  'el-fugas': '#5dcaf0',
  'el-cuadrado': '#c8a2ff',
};

export default async function HistorialPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const me = await getCurrentUser();
  if (!me) redirect('/login');
  if (!me.pin_changed) redirect('/cambiar-pin');

  const [matches, users, predictionsByMatch] = await Promise.all([
    listMatches(),
    listUsers(),
    getAllPredictionsByMatch(),
  ]);
  const { stage = 'all' } = await searchParams;

  const now = new Date();
  // Solo mostramos partidos cuyas predicciones ya están "reveladas" (locked o final)
  const visibleMatches = matches.filter((m) => isMatchLocked(m, now) || m.status === 'final');

  // Filtro por stage
  const filtered = visibleMatches.filter((m) => {
    if (stage === 'all') return true;
    if (stage === 'group') return m.stage === 'group';
    if (stage === 'knockout') return m.stage !== 'group';
    return true;
  });

  // Más reciente primero
  filtered.sort((a, b) => new Date(b.kickoff_utc).getTime() - new Date(a.kickoff_utc).getTime());

  return (
    <section className="mx-auto max-w-[1320px] px-4 py-8 md:px-10 md:py-16">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Historial · Todas las jugadas</p>
          <h1 className="display mt-3 text-[clamp(40px,7vw,88px)] leading-[0.92]">
            Cartas <span className="text-[var(--color-primary)]">descubiertas</span>.
          </h1>
          <p className="mt-5 max-w-[52ch] text-[var(--color-secondary-text)]">
            Lo que apostó cada cuate en cada partido — aparecen apenas se cierra el candado. Tap a un nombre para ver su carrera completa.
          </p>
        </div>
        <StageFilter current={stage} />
      </header>

      {filtered.length === 0 ? (
        <div className="surface mt-12 px-6 py-16 text-center text-[var(--color-secondary-text)]">
          Todavía no hay partidos revelados. Las predicciones aparecen aquí apenas se cierra el candado (1 min antes del kickoff).
        </div>
      ) : (
        <>
          {/* Mobile: una card por partido */}
          <div className="mt-10 space-y-3 md:hidden">
            {filtered.map((m) => (
              <MobileMatchCard
                key={m.id}
                match={m}
                users={users}
                predictions={predictionsByMatch.get(m.id) ?? []}
                meId={me.id}
              />
            ))}
          </div>

          {/* Desktop: tabla matrix */}
          <div className="hidden mt-12 md:block">
            <DesktopMatrix
              matches={filtered}
              users={users}
              predictionsByMatch={predictionsByMatch}
              meId={me.id}
            />
          </div>
        </>
      )}
    </section>
  );
}

function StageFilter({ current }: { current: string }) {
  const tabs = [
    { key: 'all', label: 'Todo' },
    { key: 'group', label: 'Grupos' },
    { key: 'knockout', label: 'Eliminación' },
  ];
  return (
    <div className="flex shrink-0 gap-1.5 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-1">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.key === 'all' ? '/historial' : `/historial?stage=${t.key}`}
          className={`rounded-[8px] px-3 py-2 text-[12px] font-medium transition ${
            current === t.key
              ? 'bg-[var(--color-primary)] text-[#0a1f14]'
              : 'text-[var(--color-secondary-text)] hover:text-[var(--color-text)]'
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

function MobileMatchCard({
  match,
  users,
  predictions,
  meId,
}: {
  match: Match;
  users: User[];
  predictions: Prediction[];
  meId: number;
}) {
  const predsByUser = new Map(predictions.map((p) => [p.user_id, p]));
  const isFinal = match.status === 'final' && match.home_score !== null && match.away_score !== null;

  const rows = users.map((u) => {
    const p = predsByUser.get(u.id);
    const points =
      p && isFinal
        ? calcPoints(p.home_score, p.away_score, match.home_score!, match.away_score!)
        : null;
    return { user: u, prediction: p ?? null, points };
  });
  rows.sort((a, b) => {
    if (isFinal) return (b.points ?? -1) - (a.points ?? -1);
    const ap = a.prediction ? 0 : 1;
    const bp = b.prediction ? 0 : 1;
    if (ap !== bp) return ap - bp;
    return a.user.id - b.user.id;
  });

  return (
    <div className="surface overflow-hidden">
      <Link href={`/partidos/${match.id}`} className="block px-4 py-3 active:bg-white/[0.03]">
        <p className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
          {match.id} ·{' '}
          {match.grp ? `Grupo ${match.grp}` : STAGE_LABELS[match.stage as keyof typeof STAGE_LABELS]}{' '}
          ·{' '}
          {new Date(match.kickoff_utc).toLocaleDateString('es-MX', {
            timeZone: 'America/Mexico_City',
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="truncate text-[14px] font-medium">
            {match.home_team} <span className="text-[var(--color-muted)]">vs</span> {match.away_team}
          </p>
          {isFinal ? (
            <span className="mono shrink-0 text-[16px] font-medium tabular-nums text-[var(--color-primary)]">
              {match.home_score} · {match.away_score}
            </span>
          ) : (
            <span className="shrink-0 rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              esperando
            </span>
          )}
        </div>
      </Link>
      <div className="border-t border-[var(--color-border)]/60">
        {rows.map(({ user, prediction, points }) => {
          const isMe = user.id === meId;
          const tone =
            points === 3
              ? 'text-[var(--color-gold)]'
              : points === 1
                ? 'text-[var(--color-primary)]'
                : points === 0
                  ? 'text-[var(--color-muted)]'
                  : 'text-[var(--color-text)]';
          return (
            <Link
              key={user.id}
              href={`/jugador/${user.id}`}
              className={`flex items-center justify-between gap-3 border-b border-[var(--color-border)]/40 px-4 py-2.5 last:border-b-0 active:bg-white/[0.03] ${
                isMe ? 'bg-[var(--color-primary)]/[0.04]' : ''
              }`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Dot seed={user.avatar_seed} initial={user.name.slice(0, 1)} />
                <span className="truncate text-[13px] font-medium">
                  {user.name}
                  {isMe && (
                    <span className="ml-1.5 mono text-[8px] uppercase tracking-[0.18em] text-[var(--color-primary)]">
                      TÚ
                    </span>
                  )}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {prediction ? (
                  <span className={`mono text-[14px] tabular-nums ${tone}`}>
                    {prediction.home_score}·{prediction.away_score}
                  </span>
                ) : (
                  <span className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    sin jugada
                  </span>
                )}
                {points !== null && (
                  <span
                    className={`mono w-7 text-right text-[12px] font-semibold tabular-nums ${
                      points === 3
                        ? 'text-[var(--color-gold)]'
                        : points === 1
                          ? 'text-[var(--color-primary)]'
                          : 'text-[var(--color-muted)]'
                    }`}
                  >
                    +{points}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function DesktopMatrix({
  matches,
  users,
  predictionsByMatch,
  meId,
}: {
  matches: Match[];
  users: User[];
  predictionsByMatch: Map<string, Prediction[]>;
  meId: number;
}) {
  return (
    <div className="surface overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="sticky left-0 z-10 bg-[var(--color-surface)] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Partido
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Real
            </th>
            {users.map((u) => (
              <th
                key={u.id}
                className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
              >
                <Link
                  href={`/jugador/${u.id}`}
                  className="inline-flex items-center gap-2 transition hover:text-[var(--color-text)]"
                >
                  <Dot seed={u.avatar_seed} initial={u.name.slice(0, 1)} small />
                  <span className="truncate">{u.name}</span>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matches.map((m) => {
            const preds = new Map(
              (predictionsByMatch.get(m.id) ?? []).map((p) => [p.user_id, p]),
            );
            const isFinal =
              m.status === 'final' && m.home_score !== null && m.away_score !== null;
            return (
              <tr key={m.id} className="border-b border-[var(--color-border)]/40 last:border-b-0">
                <td className="sticky left-0 z-10 bg-[var(--color-surface)] px-4 py-3.5">
                  <Link href={`/partidos/${m.id}`} className="block hover:opacity-80">
                    <p className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                      {m.id} ·{' '}
                      {m.grp ? `G${m.grp}` : STAGE_LABELS[m.stage as keyof typeof STAGE_LABELS]} ·{' '}
                      {new Date(m.kickoff_utc).toLocaleDateString('es-MX', {
                        timeZone: 'America/Mexico_City',
                        day: '2-digit',
                        month: 'short',
                      })}
                    </p>
                    <p className="mt-0.5 text-[13px] font-medium whitespace-nowrap">
                      {m.home_code} <span className="text-[var(--color-muted)]">vs</span>{' '}
                      {m.away_code}
                    </p>
                  </Link>
                </td>
                <td className="px-4 py-3.5 text-left">
                  {isFinal ? (
                    <span className="mono text-[15px] font-medium tabular-nums text-[var(--color-primary)]">
                      {m.home_score} · {m.away_score}
                    </span>
                  ) : (
                    <span className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                      Esperando
                    </span>
                  )}
                </td>
                {users.map((u) => {
                  const p = preds.get(u.id);
                  const points =
                    p && isFinal
                      ? calcPoints(p.home_score, p.away_score, m.home_score!, m.away_score!)
                      : null;
                  const isMe = u.id === meId;
                  return (
                    <td
                      key={u.id}
                      className={`px-4 py-3.5 text-center ${
                        isMe ? 'bg-[var(--color-primary)]/[0.03]' : ''
                      }`}
                    >
                      {p ? (
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={`mono text-[14px] tabular-nums ${
                              points === 3
                                ? 'text-[var(--color-gold)]'
                                : points === 1
                                  ? 'text-[var(--color-primary)]'
                                  : points === 0
                                    ? 'text-[var(--color-muted)]'
                                    : 'text-[var(--color-text)]'
                            }`}
                          >
                            {p.home_score}·{p.away_score}
                          </span>
                          {points !== null && (
                            <span
                              className={`mono text-[10px] font-semibold ${
                                points === 3
                                  ? 'text-[var(--color-gold)]'
                                  : points === 1
                                    ? 'text-[var(--color-primary)]'
                                    : 'text-[var(--color-muted)]'
                              }`}
                            >
                              +{points}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[12px] text-[var(--color-muted)]">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Dot({ seed, initial, small }: { seed: string; initial: string; small?: boolean }) {
  const bg = AVATAR_PALETTE[seed] ?? '#7a8c82';
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-[#0a1f14] ring-1 ring-black/30 ${
        small ? 'h-5 w-5 text-[10px]' : 'h-7 w-7 text-[11px]'
      }`}
      style={{ background: bg }}
      aria-hidden
    >
      {initial}
    </div>
  );
}
