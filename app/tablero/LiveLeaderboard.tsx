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
      <div className="surface mt-8 overflow-hidden md:mt-10">
        {/* Desktop header — hidden on mobile (mobile uses inline labels) */}
        <header className="hidden md:grid grid-cols-[56px_1fr_80px_88px_72px] items-center gap-4 border-b border-[var(--color-border)] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          <span>#</span>
          <span>Jugador</span>
          <span className="text-right">Jugadas</span>
          <span className="text-right">Aciertos</span>
          <span className="text-right">PTS</span>
        </header>

        {rows.map((row, i) => {
          const isMe = meId === row.user_id;
          const isFlashing = flash.has(row.user_id);
          const prevRank = prevRanks.current.get(row.user_id);
          const delta = prevRank !== undefined ? prevRank - i : 0;

          const rankColor =
            i === 0
              ? 'text-[var(--color-gold)]'
              : i < 3
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-muted)]';

          return (
            <div
              key={row.user_id}
              className={`relative border-b border-[var(--color-border)]/60 px-4 py-4 transition-all duration-300 last:border-b-0 md:grid md:grid-cols-[56px_1fr_80px_88px_72px] md:items-center md:gap-4 md:px-6 md:py-5 ${
                isMe ? 'bg-[var(--color-primary)]/[0.05]' : ''
              } ${isFlashing ? 'bg-[var(--color-primary)]/12' : ''}`}
              style={isMe ? { boxShadow: 'inset 4px 0 0 var(--color-primary)' } : undefined}
            >
              {/* MOBILE: 3-col layout — [rank] [name+stats] [pts] */}
              <div className="grid grid-cols-[40px_1fr_auto] items-center gap-3 md:contents">
                {/* Rank */}
                <div className="flex flex-col items-start md:flex-row md:items-center md:gap-2">
                  <span
                    className={`mono text-[22px] tabular-nums leading-none md:text-[26px] ${rankColor}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {delta !== 0 && (
                    <span
                      className={`mono text-[9px] tabular-nums leading-none mt-0.5 md:mt-0 md:text-[10px] ${
                        delta > 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-magenta)]'
                      }`}
                    >
                      {delta > 0 ? '↑' : '↓'}
                      {Math.abs(delta)}
                    </span>
                  )}
                </div>

                {/* Name + avatar + (mobile) sub-stats */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar seed={row.avatar_seed} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium leading-tight">
                      {row.name}
                      {isMe && (
                        <span className="ml-2 mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-primary)]">
                          TÚ
                        </span>
                      )}
                    </p>
                    {/* MOBILE-only sub stats */}
                    <p className="mono mt-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] md:hidden">
                      <span>{row.predicted} jug.</span>
                      <span aria-hidden>·</span>
                      <span>
                        <span className="text-[var(--color-primary)]">{row.exact_count}</span> exactos
                      </span>
                      {row.result_count > 0 && (
                        <>
                          <span aria-hidden>·</span>
                          <span>
                            <span className="text-[var(--color-gold)]">{row.result_count}</span> al ganador
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Points — mobile shows big */}
                <span
                  className={`mono text-[28px] font-medium tabular-nums leading-none md:hidden ${
                    isFlashing ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'
                  }`}
                >
                  {row.total}
                </span>
              </div>

              {/* DESKTOP-only columns (jugadas / aciertos / pts) */}
              <span className="mono hidden text-right text-[12px] tabular-nums text-[var(--color-muted)] md:block">
                {row.predicted}
              </span>
              <span className="mono hidden text-right text-[12px] tabular-nums md:block">
                <span className="text-[var(--color-primary)]">{row.exact_count}</span>
                <span className="text-[var(--color-muted)]"> · </span>
                <span className="text-[var(--color-gold)]">{row.result_count}</span>
              </span>
              <span
                className={`mono hidden text-right text-[28px] font-medium tabular-nums leading-none md:block ${
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
      <p className="mono mt-4 text-right text-[11px] tabular-nums text-[var(--color-muted)]">
        Actualizado {new Date(updatedAt).toLocaleTimeString('es-MX')}
      </p>
    </>
  );
}

function Avatar({ seed }: { seed: string }) {
  const initials = seed
    .split('-')
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);
  const h = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const palette = ['var(--color-primary)', 'var(--color-gold)', 'var(--color-magenta)', '#7a8c82'];
  const bg = palette[h % palette.length];
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-[#0a1f14] ring-1 ring-black/20"
      style={{ background: bg }}
    >
      {initials}
    </div>
  );
}
