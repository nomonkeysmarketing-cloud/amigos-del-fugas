import Link from 'next/link';
import { FlagBadge } from './FlagBadge';
import { StatusPill } from './StatusPill';
import { PointsBadge } from './PointsBadge';
import { CountdownTimer } from './CountdownTimer';
import type { Match, Prediction } from '@/lib/db';
import { calcPoints } from '@/lib/scoring';
import { STAGE_LABELS } from '@/lib/matches-data';

type Props = {
  match: Match;
  prediction?: Prediction;
  locked: boolean;
  href?: string;
};

function formatKickoff(utc: string) {
  const d = new Date(utc);
  // Mexico City time
  const fmt = new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Mexico_City',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return fmt.format(d).replace('.', '').toUpperCase();
}

export function MatchCard({ match, prediction, locked, href }: Props) {
  const status = match.status === 'live'
    ? 'live'
    : match.status === 'final'
      ? 'final'
      : locked
        ? 'locked'
        : 'scheduled';

  const isFinal = match.status === 'final' && match.home_score !== null && match.away_score !== null;
  const showPrediction = !!prediction;
  const earned = isFinal && prediction
    ? calcPoints(prediction.home_score, prediction.away_score, match.home_score!, match.away_score!)
    : null;

  const card = (
    <article
      className={`surface card-in relative overflow-hidden p-5 transition ${
        match.status === 'live' ? 'glow-live border-[var(--color-primary)]' : 'surface-hover'
      }`}
    >
      {/* Top row: stage + status + countdown */}
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow text-[var(--color-muted)]">
          {match.grp ? `Grupo ${match.grp}` : STAGE_LABELS[match.stage as keyof typeof STAGE_LABELS]}
          <span className="mx-1.5 opacity-40">·</span>
          <span className="mono">{match.id}</span>
        </span>
        <div className="flex items-center gap-2">
          {match.status === 'scheduled' && !locked && <CountdownTimer targetUtc={match.kickoff_utc} />}
          <StatusPill status={status as 'scheduled' | 'live' | 'locked' | 'final'} />
        </div>
      </div>

      {/* Main row */}
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center gap-3">
          <FlagBadge code={match.home_code} name={match.home_team} size={40} />
          <div className="flex flex-col">
            <span className="text-[15px] font-medium leading-tight">{match.home_team}</span>
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {match.home_code === 'TBD' ? '—' : match.home_code}
            </span>
          </div>
        </div>

        <div className="flex min-w-[80px] items-center justify-center">
          {isFinal ? (
            <span className="mono text-[40px] font-medium leading-none tabular-nums score-pop">
              {match.home_score}<span className="px-2 text-[var(--color-muted)]">·</span>{match.away_score}
            </span>
          ) : showPrediction ? (
            <span className="mono text-[26px] font-medium leading-none tabular-nums text-[var(--color-gold)]">
              {prediction!.home_score}<span className="px-1.5 text-[var(--color-muted)]">·</span>{prediction!.away_score}
            </span>
          ) : (
            <span className="mono text-[20px] font-medium leading-none text-[var(--color-muted)]">VS</span>
          )}
        </div>

        <div className="flex items-center gap-3 justify-self-end">
          <div className="flex flex-col items-end text-right">
            <span className="text-[15px] font-medium leading-tight">{match.away_team}</span>
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {match.away_code === 'TBD' ? '—' : match.away_code}
            </span>
          </div>
          <FlagBadge code={match.away_code} name={match.away_team} size={40} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-4 flex items-center justify-between gap-3 text-[12px] text-[var(--color-muted)]">
        <div className="flex items-center gap-2">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <rect x="1.5" y="2.5" width="9" height="8" rx="1" stroke="currentColor" strokeWidth="1" />
            <path d="M1.5 5H10.5M4 1.5V3.5M8 1.5V3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <span className="mono tabular-nums">{formatKickoff(match.kickoff_utc)} MX</span>
        </div>
        <div className="flex items-center gap-3">
          {earned !== null && <PointsBadge points={earned} />}
          {showPrediction && !isFinal && (
            <span className="eyebrow !text-[10px] text-[var(--color-gold)]">Tu jugada</span>
          )}
        </div>
      </div>

      {/* Locked overlay */}
      {match.status === 'scheduled' && locked && (
        <div className="hatch pointer-events-none absolute inset-0 rounded-[20px]" aria-hidden />
      )}
    </article>
  );

  if (!href) return card;
  return (
    <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[20px]">
      {card}
    </Link>
  );
}
