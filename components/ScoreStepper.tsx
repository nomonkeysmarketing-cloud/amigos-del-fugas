'use client';

import { useState } from 'react';

type Props = {
  name: string;
  defaultValue?: number;
  disabled?: boolean;
  ariaLabel?: string;
};

export function ScoreStepper({ name, defaultValue = 0, disabled, ariaLabel }: Props) {
  const [val, setVal] = useState<number>(defaultValue);
  const clamp = (n: number) => Math.max(0, Math.min(20, n));
  return (
    <div
      className={`flex w-[88px] flex-col items-center gap-1 rounded-[14px] border bg-[var(--color-surface-2)] px-2 py-3 transition ${
        disabled ? 'border-[var(--color-border)] opacity-50' : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
      }`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setVal((v) => clamp(v + 1))}
        className="text-[var(--color-muted)] hover:text-[var(--color-primary)] disabled:hover:text-[var(--color-muted)] transition"
        aria-label="Subir"
      >
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
          <path d="M2 8L6 4L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <input
        type="number"
        name={name}
        value={val}
        onChange={(e) => setVal(clamp(parseInt(e.target.value || '0', 10)))}
        min={0}
        max={20}
        disabled={disabled}
        aria-label={ariaLabel ?? name}
        className="!border-0 !bg-transparent !p-0 text-center mono text-[40px] font-medium leading-none !text-[var(--color-text)] focus:!shadow-none w-full"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setVal((v) => clamp(v - 1))}
        className="text-[var(--color-muted)] hover:text-[var(--color-magenta)] disabled:hover:text-[var(--color-muted)] transition"
        aria-label="Bajar"
      >
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
