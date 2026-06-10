'use client';

import { useActionState } from 'react';
import { changePinAction } from '@/app/actions';

type State = { ok: boolean; error?: string } | null;

export function ChangePinForm() {
  const [state, formAction, pending] = useActionState<State, FormData>(changePinAction, null);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Nuevo PIN (4 dígitos)
        </label>
        <input
          type="password"
          name="new_pin"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          autoComplete="new-password"
          placeholder="••••"
          className="mt-3 block w-full mono text-center text-[28px] tracking-[0.25em]"
          required
        />
      </div>

      <div>
        <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Confirma tu PIN
        </label>
        <input
          type="password"
          name="confirm_pin"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          autoComplete="new-password"
          placeholder="••••"
          className="mt-3 block w-full mono text-center text-[28px] tracking-[0.25em]"
          required
        />
      </div>

      {state?.error && (
        <p className="rounded-[10px] border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3 text-[13px] text-[var(--color-danger)]">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? 'Guardando…' : 'Guardar PIN y jugar'}
      </button>

      <p className="text-center text-[11px] text-[var(--color-muted)]">
        Si lo olvidas, pídele al admin que te lo regenere.
      </p>
    </form>
  );
}
