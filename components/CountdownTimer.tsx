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
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
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

  if (remainingToKickoff <= 0) return null;

  const label = remainingToLock > 0 ? 'CIERRA EN' : 'KICKOFF EN';
  const value = fmt(remainingToLock > 0 ? remainingToLock : remainingToKickoff);
  const urgent = (remainingToLock > 0 ? remainingToLock : remainingToKickoff) < 60 * 60 * 1000;

  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </span>
      <span
        className={`mono text-xs tabular-nums ${
          urgent ? 'text-[var(--color-danger)] live-dot' : 'text-[var(--color-text)]'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
