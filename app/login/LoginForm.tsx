'use client';

import { useActionState, useState } from 'react';
import { loginAction } from '@/app/actions';

type State = { ok: boolean; error?: string } | null;

export function LoginForm({ players }: { players: string[] }) {
  const [state, formAction, pending] = useActionState<State, FormData>(loginAction, null);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Jugador
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {players.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelected(p)}
              className={`rounded-[12px] border px-3 py-3 text-[13px] font-medium transition ${
                selected === p
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] text-[var(--color-secondary-text)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <input type="hidden" name="name" value={selected ?? ''} />
      </div>

      <div>
        <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          PIN
        </label>
        <input
          type="password"
          name="pin"
          inputMode="numeric"
          autoComplete="off"
          maxLength={6}
          placeholder="••••"
          className="mt-3 block w-full mono text-center text-[24px] tracking-[0.4em]"
          required
        />
      </div>

      {state?.error && (
        <p className="rounded-[10px] border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3 text-[13px] text-[var(--color-danger)]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={!selected || pending}
        className="btn btn-primary w-full"
      >
        {pending ? 'Entrando…' : 'Entrar a la cancha'}
      </button>

      <p className="text-center text-[12px] text-[var(--color-muted)]">
        Los PINs se generan al crear la quiniela. Pídelos a tu admin.
      </p>
    </form>
  );
}
