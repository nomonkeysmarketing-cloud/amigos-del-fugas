'use client';

import { useActionState, useState } from 'react';
import type { Match } from '@/lib/db';
import { setResultAction } from '@/app/actions';
import { STAGE_LABELS } from '@/lib/matches-data';

type State = { ok: boolean; error?: string; message?: string } | null;

export function AdminMatchRow({ match }: { match: Match }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<State, FormData>(setResultAction, null);

  const isFinal = match.status === 'final';

  return (
    <>
      <div className="grid grid-cols-[80px_1fr_120px_130px] items-center gap-3 border-b border-[var(--color-border)]/60 px-6 py-3 last:border-b-0">
        <span className="mono text-[12px] tabular-nums text-[var(--color-muted)]">{match.id}</span>
        <div>
          <p className="text-[14px] font-medium">
            {match.home_team} <span className="text-[var(--color-muted)]">vs</span> {match.away_team}
          </p>
          <p className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
            {match.grp ? `Grupo ${match.grp}` : STAGE_LABELS[match.stage as keyof typeof STAGE_LABELS]} ·{' '}
            {new Date(match.kickoff_utc).toLocaleString('es-MX', {
              timeZone: 'America/Mexico_City',
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span
          className={`mono text-[16px] tabular-nums ${
            isFinal ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'
          }`}
        >
          {match.home_score !== null ? `${match.home_score} · ${match.away_score}` : '—'}
        </span>
        <button onClick={() => setOpen((o) => !o)} className="btn btn-secondary h-8 px-3 text-[12px]">
          {open ? 'Cerrar' : isFinal ? 'Editar' : 'Meter resultado'}
        </button>
      </div>

      {open && (
        <form action={formAction} className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/40 px-6 py-4">
          <input type="hidden" name="match_id" value={match.id} />
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {match.home_code} ({match.home_team})
              </label>
              <input
                type="number"
                name="home_score"
                defaultValue={match.home_score ?? ''}
                min={0}
                max={20}
                placeholder="0"
                className="mt-1 block w-24 mono text-center text-[18px]"
              />
            </div>
            <span className="mono pb-3 text-[20px] text-[var(--color-muted)]">—</span>
            <div>
              <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {match.away_code} ({match.away_team})
              </label>
              <input
                type="number"
                name="away_score"
                defaultValue={match.away_score ?? ''}
                min={0}
                max={20}
                placeholder="0"
                className="mt-1 block w-24 mono text-center text-[18px]"
              />
            </div>
            <div className="ml-auto flex items-end gap-3">
              <div>
                <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  PIN admin
                </label>
                <input
                  type="password"
                  name="admin_pin"
                  inputMode="numeric"
                  placeholder="••••"
                  className="mt-1 block w-28 mono text-center"
                  required
                />
              </div>
              <button type="submit" disabled={pending} className="btn btn-primary h-11 text-[13px]">
                {pending ? 'Guardando…' : 'Guardar final'}
              </button>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-[var(--color-muted)]">
            Al guardar, este partido cuenta como <span className="text-[var(--color-primary)]">FINAL</span> y los puntos se reparten en el tablero.
            Si vacías ambos marcadores, el partido vuelve a "pendiente".
          </p>
          {state?.error && (
            <p className="mt-3 text-[12px] text-[var(--color-danger)]">{state.error}</p>
          )}
          {state?.ok && state.message && (
            <p className="mt-3 text-[12px] text-[var(--color-primary)]">{state.message}</p>
          )}
        </form>
      )}
    </>
  );
}
