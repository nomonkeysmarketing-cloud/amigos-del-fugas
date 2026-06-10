'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  name: string;
  defaultValue?: number;
  disabled?: boolean;
  ariaLabel?: string;
};

const MAX = 20;

export function ScoreStepper({ name, defaultValue = 0, disabled, ariaLabel }: Props) {
  const [val, setVal] = useState<number>(defaultValue);
  const [dir, setDir] = useState<1 | -1>(1);
  const clamp = (n: number) => Math.max(0, Math.min(MAX, n));

  // Hold-to-repeat
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatCount = useRef(0);

  const bump = (delta: 1 | -1) => {
    setDir(delta);
    setVal((v) => clamp(v + delta));
  };

  const startHold = (delta: 1 | -1) => {
    if (disabled) return;
    bump(delta);
    repeatCount.current = 0;
    const schedule = () => {
      const interval = repeatCount.current < 5 ? 320 : repeatCount.current < 10 ? 140 : 80;
      holdTimer.current = setTimeout(() => {
        repeatCount.current += 1;
        bump(delta);
        schedule();
      }, interval);
    };
    schedule();
  };

  const stopHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    repeatCount.current = 0;
  };

  useEffect(() => () => stopHold(), []);

  return (
    <div
      className={`flex w-full max-w-[120px] flex-col items-stretch gap-2 rounded-[16px] border bg-[var(--color-surface-2)] p-2 transition ${
        disabled
          ? 'border-[var(--color-border)] opacity-50'
          : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
      }`}
    >
      <button
        type="button"
        disabled={disabled || val >= MAX}
        onPointerDown={() => startHold(1)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onPointerCancel={stopHold}
        className="flex h-[52px] items-center justify-center rounded-[10px] text-[var(--color-muted)] transition active:scale-[0.94] active:bg-[var(--color-primary)]/12 active:text-[var(--color-primary)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:hover:text-[var(--color-muted)] disabled:active:scale-100"
        aria-label="Subir"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M6 14L12 8L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="relative h-[64px] overflow-hidden">
        <input
          type="number"
          name={name}
          value={val}
          onChange={(e) => {
            const next = clamp(parseInt(e.target.value || '0', 10));
            setDir(next > val ? 1 : -1);
            setVal(next);
          }}
          min={0}
          max={MAX}
          disabled={disabled}
          aria-label={ariaLabel ?? name}
          inputMode="numeric"
          className="!h-full !w-full !border-0 !bg-transparent !p-0 text-center mono text-[52px] font-medium leading-[64px] !text-[var(--color-text)] tabular-nums focus:!shadow-none"
          // animate using key bump for re-mount transition
          key={`${val}-${dir}`}
          style={{ animation: `score-pop 220ms cubic-bezier(0.22,1,0.36,1)` }}
        />
      </div>

      <button
        type="button"
        disabled={disabled || val <= 0}
        onPointerDown={() => startHold(-1)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onPointerCancel={stopHold}
        className="flex h-[52px] items-center justify-center rounded-[10px] text-[var(--color-muted)] transition active:scale-[0.94] active:bg-[var(--color-magenta)]/12 active:text-[var(--color-magenta)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:hover:text-[var(--color-muted)] disabled:active:scale-100"
        aria-label="Bajar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M6 10L12 16L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
