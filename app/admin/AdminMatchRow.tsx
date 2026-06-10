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
    <div className="border-b border-[var(--color-border)]/60 last:border-b-0">
      {/* Row — mobile stack, desktop grid */}
      <div className="flex items-center gap-3 px-4 py-3 md:grid md:grid-cols-[80px_1fr_120px_140px] md:items-center md:gap-3 md:px-6 md:py-3">
        <span className="mono w-[44px] shrink-0 text-[11px] tabular-nums text-[var(--color-muted)] md:w-auto md:text-[12px]">
          {match.id}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium md:text-[14px]">
            {match.home_team} <span className="text-[var(--color-muted)]">vs</span> {match.away_team}
          </p>
          <p className="mono mt-0.5 truncate text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
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
          className={`mono shrink-0 text-[14px] tabular-nums md:text-[16px] ${
            isFinal ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'
          }`}
        >
          {match.home_score !== null ? `${match.home_score} · ${match.away_score}` : '—'}
        </span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="btn btn-secondary !h-10 shrink-0 px-3 text-[12px]"
        >
          {open ? 'Cerrar' : isFinal ? 'Editar' : 'Meter'}
        </button>
      </div>

      {open && (
        <form
          action={formAction}
          className="border-t border-[var(--color-border)]/60 bg-[var(--color-surface-2)]/40 px-4 py-4 md:px-6"
        >
          <input type="hidden" name="match_id" value={match.id} />
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-3">
            <div className="flex items-end gap-3">
              <div className="flex-1 md:flex-none">
                <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {match.home_code} · {match.home_team}
                </label>
                <input
                  type="number"
                  name="home_score"
                  defaultValue={match.home_score ?? ''}
                  min={0}
                  max={20}
                  placeholder="0"
                  className="mt-1 block w-full md:w-24 mono text-center text-[20px]"
                />
              </div>
              <span className="mono pb-3 text-[20px] text-[var(--color-muted)]">—</span>
              <div className="flex-1 md:flex-none">
                <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {match.away_code} · {match.away_team}
                </label>
                <input
                  type="number"
                  name="away_score"
                  defaultValue={match.away_score ?? ''}
                  min={0}
                  max={20}
                  placeholder="0"
                  className="mt-1 block w-full md:w-24 mono text-center text-[20px]"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="btn btn-primary !h-11 w-full text-[13px] md:ml-auto md:w-auto"
            >
              {pending ? 'Guardando…' : 'Guardar final'}
            </button>
          </div>
          <p className="mt-3 text-[11px] text-[var(--color-muted)]">
            Al guardar, este partido cuenta como <span className="text-[var(--color-primary)]">FINAL</span> y los puntos se reparten en el tablero.
            Vaciar ambos campos lo vuelve a "pendiente".
          </p>
          {state?.error && (
            <p role="alert" className="mt-3 text-[12px] text-[var(--color-danger)]">{state.error}</p>
          )}
          {state?.ok && state.message && (
            <p className="mt-3 text-[12px] text-[var(--color-primary)]">{state.message}</p>
          )}
        </form>
      )}
    </div>
  );
}
