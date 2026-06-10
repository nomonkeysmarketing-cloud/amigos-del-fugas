'use client';

import { useEffect, useState } from 'react';

type Props = {
  targetUtc: string;
  /** Lock offset in ms. Default 60_000 (predictions close 1 min before kickoff). */
  lockOffsetMs?: number;
};

function fmt(ms: number) {
  if (ms <= 0) return null;
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (d > 0) return `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  if (m > 0) return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  return `${String(s).padStart(2, '0')}s`;
}

export function CountdownTimer({ targetUtc, lockOffsetMs = 60_000 }: Props) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const target = new Date(targetUtc).getTime();
  const lockAt = target - lockOffsetMs;
  const remainingToLock = lockAt - now;
  const remainingToKickoff = target - now;

  // Past kickoff: nothing to count down
  if (remainingToKickoff <= 0) return null;

  const isLocked = remainingToLock <= 0;
  const label = isLocked ? 'POR ARRANCAR' : 'CIERRA EN';
  const value = fmt(isLocked ? remainingToKickoff : remainingToLock);
  if (!value) return null;

  // Urgency tiers
  const remaining = isLocked ? remainingToKickoff : remainingToLock;
  const lessThanHour = remaining < 60 * 60 * 1000;
  const lessThan10min = remaining < 10 * 60 * 1000;

  const color = isLocked
    ? 'text-[var(--color-magenta)]'
    : lessThan10min
      ? 'text-[var(--color-magenta)]'
      : lessThanHour
        ? 'text-[var(--color-gold)]'
        : 'text-[var(--color-text)]';

  return (
    <div className="flex items-center gap-1.5">
      {(lessThan10min || isLocked) && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-magenta)] live-dot"
          aria-hidden
        />
      )}
      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </span>
      <span className={`mono text-xs tabular-nums tracking-tight ${color}`}>{value}</span>
    </div>
  );
}
