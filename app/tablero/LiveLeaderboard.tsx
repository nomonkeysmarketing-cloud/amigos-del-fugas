'use client';

import { useEffect, useRef, useState } from 'react';
import type { LeaderboardRow } from '@/lib/db';

type Props = {
  initial: LeaderboardRow[];
  meId: number | null;
};

export function LiveLeaderboard({ initial, meId }: Props) {
  const [rows, setRows] = useState<LeaderboardRow[]>(initial);
  const [updatedAt, setUpdatedAt] = useState<string>(new Date().toISOString());
  const prevTotals = useRef<Map<number, number>>(new Map(initial.map((r) => [r.user_id, r.total])));
  const prevRanks = useRef<Map<number, number>>(new Map(initial.map((r, i) => [r.user_id, i])));
  const [flash, setFlash] = useState<Set<number>>(new Set());

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const res = await fetch('/api/leaderboard', { cache: 'no-store' });
        if (!res.ok) return;
        const data: { rows: LeaderboardRow[]; updated_at: string } = await res.json();
        if (!alive) return;

        // Detect changed totals → flash
        const flashed = new Set<number>();
        for (const r of data.rows) {
          const prev = prevTotals.current.get(r.user_id);
          if (prev !== undefined && prev !== r.total) flashed.add(r.user_id);
        }
        if (flashed.size > 0) {
          setFlash(flashed);
          setTimeout(() => alive && setFlash(new Set()), 1200);
        }

        prevRanks.current = new Map(rows.map((r, i) => [r.user_id, i]));
        prevTotals.current = new Map(data.rows.map((r) => [r.user_id, r.total]));
        setRows(data.rows);
        setUpdatedAt(data.updated_at);
      } catch {
        // network blip — ignore
      }
    };
    const i = setInterval(tick, 5000);
    return () => {
      alive = false;
      clearInterval(i);
    };
  }, [rows]);

  return (
    <>
      <div className="surface mt-10 overflow-hidden">
        <header className="grid grid-cols-[56px_1fr_auto_auto_auto] items-center gap-4 border-b border-[var(--color-border)] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          <span>#</span>
          <span>Jugador</span>
          <span className="hidden sm:inline">Jugadas</span>
          <span>Aciertos</span>
          <span>PTS</span>
        </header>
        {rows.map((row, i) => {
          const isMe = meId === row.user_id;
          const isFlashing = flash.has(row.user_id);
          const prevRank = prevRanks.current.get(row.user_id);
          const delta = prevRank !== undefined ? prevRank - i : 0;
          return (
            <div
              key={row.user_id}
              className={`relative grid grid-cols-[56px_1fr_auto_auto_auto] items-center gap-4 border-b border-[var(--color-border)]/60 px-6 py-5 last:border-b-0 transition-all duration-300 ${
                isMe ? 'bg-[var(--color-primary)]/[0.05]' : ''
              } ${isFlashing ? 'bg-[var(--color-primary)]/12' : ''}`}
              style={isMe ? { boxShadow: 'inset 4px 0 0 var(--color-primary)' } : undefined}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`mono text-[26px] tabular-nums leading-none ${
                    i === 0
                      ? 'text-[var(--color-gold)]'
                      : i < 3
                        ? 'text-[var(--color-primary)]'
                        : 'text-[var(--color-muted)]'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {delta !== 0 && (
                  <span
                    className={`mono text-[10px] tabular-nums ${
                      delta > 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-magenta)]'
                    }`}
                  >
                    {delta > 0 ? '↑' : '↓'}
                    {Math.abs(delta)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Avatar seed={row.avatar_seed} />
                <div>
                  <p className="text-[15px] font-medium leading-tight">
                    {row.name}
                    {isMe && (
                      <span className="ml-2 mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-primary)]">
                        TÚ
                      </span>
                    )}
                  </p>
                  <p className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    {row.predicted} jugadas
                  </p>
                </div>
              </div>
              <span className="mono hidden text-[12px] tabular-nums text-[var(--color-muted)] sm:inline">
                {row.predicted}
              </span>
              <span className="mono text-[12px] tabular-nums text-[var(--color-muted)]">
                <span className="text-[var(--color-primary)]">{row.exact_count}</span>·
                <span className="text-[var(--color-gold)]">{row.result_count}</span>
              </span>
              <span
                className={`mono text-[28px] font-medium tabular-nums leading-none ${
                  isFlashing ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'
                }`}
              >
                {row.total}
              </span>
            </div>
          );
        })}
        {rows.length === 0 && (
          <div className="px-6 py-16 text-center text-[var(--color-muted)]">
            El tablero se enciende con el primer silbatazo.
          </div>
        )}
      </div>
      <p className="mt-4 text-right text-[11px] text-[var(--color-muted)] mono tabular-nums">
        Actualizado {new Date(updatedAt).toLocaleTimeString('es-MX')}
      </p>
    </>
  );
}

function Avatar({ seed }: { seed: string }) {
  // Deterministic initials avatar
  const initials = seed
    .split('-')
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);
  // Hash to pick from 4 brand accents
  const h = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const palette = ['var(--color-primary)', 'var(--color-gold)', 'var(--color-magenta)', '#7a8c82'];
  const bg = palette[h % palette.length];
  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold text-[#0a1f14] ring-1 ring-black/20"
      style={{ background: bg }}
    >
      {initials}
    </div>
  );
}
