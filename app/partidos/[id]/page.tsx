import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import {
  getMatch,
  getPrediction,
  getPredictionsForMatch,
  isMatchLocked,
  listUsers,
} from '@/lib/db';
import { FlagBadge } from '@/components/FlagBadge';
import { StatusPill } from '@/components/StatusPill';
import { CountdownTimer } from '@/components/CountdownTimer';
import { PointsBadge } from '@/components/PointsBadge';
import { STAGE_LABELS } from '@/lib/matches-data';
import { calcPoints } from '@/lib/scoring';
import { PredictionForm } from './PredictionForm';

export const dynamic = 'force-dynamic';

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.pin_changed) redirect('/cambiar-pin');

  const { id } = await params;
  const match = await getMatch(id);
  if (!match) notFound();

  const myPrediction = await getPrediction(user.id, match.id);
  const locked = isMatchLocked(match);
  const isFinal = match.status === 'final' && match.home_score !== null && match.away_score !== null;
  const showOthers = locked || isFinal;
  const [allPredictions, usersList] = await Promise.all([
    showOthers ? getPredictionsForMatch(match.id) : Promise.resolve([]),
    listUsers(),
  ]);
  const usersById = new Map(usersList.map((u) => [u.id, u]));

  const status = match.status === 'live'
    ? 'live'
    : match.status === 'final'
      ? 'final'
      : locked
        ? 'locked'
        : 'scheduled';

  return (
    <section className="mx-auto max-w-[1080px] px-4 py-8 md:px-10 md:py-16">
      <Link href="/partidos" className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] hover:text-[var(--color-text)] transition">
        ← Volver a partidos
      </Link>

      <header className="mt-6 flex items-center justify-between gap-4">
        <p className="eyebrow text-[var(--color-muted)]">
          {match.grp ? `Grupo ${match.grp}` : STAGE_LABELS[match.stage as keyof typeof STAGE_LABELS]}
          <span className="mx-2 opacity-40">·</span>
          <span className="mono">{match.id}</span>
        </p>
        <StatusPill status={status as 'scheduled' | 'live' | 'locked' | 'final'} />
      </header>

      {/* Match hero */}
      <div className="surface mt-6 p-5 md:p-12">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6">
          <div className="flex min-w-0 flex-col items-center gap-3 text-center">
            <FlagBadge code={match.home_code} name={match.home_team} size={56} />
            <h2 className="display text-[clamp(20px,5vw,40px)] leading-[0.95] line-clamp-2">{match.home_team}</h2>
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {match.home_code === 'TBD' ? '—' : match.home_code}
            </span>
          </div>

          <div className="flex shrink-0 flex-col items-center justify-center gap-3">
            {isFinal ? (
              <span className="mono text-[clamp(36px,10vw,64px)] font-medium leading-none tabular-nums score-pop">
                {match.home_score}
                <span className="px-2 text-[var(--color-muted)] md:px-3">·</span>
                {match.away_score}
              </span>
            ) : (
              <>
                <span className="display text-[clamp(28px,7vw,40px)] leading-none text-[var(--color-muted)]">VS</span>
                {!locked && <CountdownTimer targetUtc={match.kickoff_utc} />}
              </>
            )}
          </div>

          <div className="flex min-w-0 flex-col items-center gap-3 text-center">
            <FlagBadge code={match.away_code} name={match.away_team} size={56} />
            <h2 className="display text-[clamp(20px,5vw,40px)] leading-[0.95] line-clamp-2">{match.away_team}</h2>
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {match.away_code === 'TBD' ? '—' : match.away_code}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-1 border-t border-[var(--color-border)] pt-6 text-center">
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Kickoff (CDMX)
          </p>
          <p className="text-[18px] font-medium leading-tight">
            {new Date(match.kickoff_utc).toLocaleString('es-MX', {
              timeZone: 'America/Mexico_City',
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </p>
          <p className="mt-1 text-[13px] text-[var(--color-muted)]">{match.venue}</p>
        </div>
      </div>

      {/* Prediction form */}
      {!isFinal && match.home_code !== 'TBD' && match.away_code !== 'TBD' && (
        <div className="mt-10">
          <p className="eyebrow">Tu jugada</p>
          {locked ? (
            <div className="surface mt-4 p-8 text-center">
              <p className="text-[var(--color-secondary-text)]">
                <strong className="text-[var(--color-text)]">Predicciones cerradas</strong> — el balón ya rueda.
              </p>
              {myPrediction ? (
                <p className="mt-3 text-[14px] text-[var(--color-muted)]">
                  Tu marcador:{' '}
                  <span className="mono text-[var(--color-gold)]">
                    {myPrediction.home_score}·{myPrediction.away_score}
                  </span>
                </p>
              ) : (
                <p className="mt-3 text-[14px] text-[var(--color-muted)]">No alcanzaste a jugar este partido.</p>
              )}
            </div>
          ) : (
            <PredictionForm
              matchId={match.id}
              homeTeam={match.home_team}
              awayTeam={match.away_team}
              initialHome={myPrediction?.home_score ?? 0}
              initialAway={myPrediction?.away_score ?? 0}
              hasPrediction={!!myPrediction}
            />
          )}
        </div>
      )}

      {match.home_code === 'TBD' && (
        <div className="surface mt-10 p-8 text-center text-[var(--color-muted)]">
          Este partido aún no tiene equipos definidos (se llena al avanzar el bracket).
        </div>
      )}

      {/* Otras jugadas — visible cuando el partido está cerrado o finalizado */}
      {showOthers && (
        <div className="mt-12">
          <p className="eyebrow">{isFinal ? 'Marcador final · Jugadas' : 'Predicciones reveladas'}</p>
          <h3 className="display mt-3 text-[clamp(28px,3vw,40px)] leading-[0.95]">
            {isFinal ? (
              <>¿Quién la <span className="text-[var(--color-primary)]">clavó</span>?</>
            ) : (
              <>Cartas <span className="text-[var(--color-primary)]">sobre la mesa</span>.</>
            )}
          </h3>
          <p className="mt-3 max-w-[44ch] text-[var(--color-secondary-text)]">
            {isFinal
              ? 'Esto es lo que apostó cada cuate y los puntos que se llevaron.'
              : 'El candado bajó. Estos son los marcadores que metió cada quien.'}
          </p>

          {(() => {
            // Combina users con predictions; los que no jugaron aparecen al final.
            const predsByUser = new Map(allPredictions.map((p) => [p.user_id, p]));
            const rows = usersList.map((u) => {
              const p = predsByUser.get(u.id);
              const points =
                p && isFinal
                  ? calcPoints(p.home_score, p.away_score, match.home_score!, match.away_score!)
                  : null;
              return { user: u, prediction: p ?? null, points };
            });
            // Sort: finalized -> by points desc; otherwise by user id (predictions first)
            rows.sort((a, b) => {
              if (isFinal) {
                return (b.points ?? -1) - (a.points ?? -1);
              }
              // No final: los que jugaron primero, luego los flojos
              const ap = a.prediction ? 0 : 1;
              const bp = b.prediction ? 0 : 1;
              if (ap !== bp) return ap - bp;
              return a.user.id - b.user.id;
            });

            return (
              <div className="surface mt-6 overflow-hidden">
                {rows.map(({ user: u, prediction: p, points }) => {
                  const isMe = u.id === user.id;
                  return (
                    <div
                      key={u.id}
                      className={`grid grid-cols-[1fr_auto_60px] items-center gap-3 border-b border-[var(--color-border)]/60 px-4 py-3.5 last:border-b-0 md:px-6 md:py-4 ${
                        isMe ? 'bg-[var(--color-primary)]/[0.05]' : ''
                      }`}
                      style={isMe ? { boxShadow: 'inset 3px 0 0 var(--color-primary)' } : undefined}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <PlayerDot seed={u.avatar_seed} initial={u.name.slice(0, 1)} />
                        <span className="truncate text-[14px] font-medium">
                          {u.name}
                          {isMe && (
                            <span className="ml-2 mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-primary)]">
                              TÚ
                            </span>
                          )}
                        </span>
                      </div>
                      {p ? (
                        <span className="mono text-[18px] tabular-nums">
                          {p.home_score}
                          <span className="px-1 text-[var(--color-muted)]">·</span>
                          {p.away_score}
                        </span>
                      ) : (
                        <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                          No jugó
                        </span>
                      )}
                      <div className="flex justify-end">
                        {points !== null ? (
                          <PointsBadge points={points} />
                        ) : (
                          <span className="text-[12px] text-[var(--color-muted)]">—</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
}

const AVATAR_PALETTE: Record<string, string> = {
  wunshi: '#00d86b',
  'la-ciruela': '#ff1f6d',
  'la-tlayuda': '#ffc93c',
  'el-fugas': '#5dcaf0',
  'el-cuadrado': '#c8a2ff',
};

function PlayerDot({ seed, initial }: { seed: string; initial: string }) {
  const bg = AVATAR_PALETTE[seed] ?? '#7a8c82';
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-[#0a1f14] ring-1 ring-black/30"
      style={{ background: bg }}
    >
      {initial}
    </div>
  );
}
