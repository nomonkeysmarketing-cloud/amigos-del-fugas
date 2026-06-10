'use client';

import { useActionState } from 'react';
import { adminLoginAction } from '@/app/actions';

type State = { ok: boolean; error?: string } | null;

export function AdminGate() {
  const [state, formAction, pending] = useActionState<State, FormData>(adminLoginAction, null);

  return (
    <section className="mx-auto max-w-md px-5 py-16 md:py-24">
      <p className="eyebrow">Admin · Panel reservado</p>
      <h1 className="display mt-3 text-[clamp(40px,8vw,72px)] leading-[0.92]">
        Mete tu<br />
        <span className="text-[var(--color-magenta)]">PIN admin</span>.
      </h1>
      <p className="mt-5 text-[var(--color-secondary-text)]">
        Esta zona controla los resultados de los partidos. Sólo el jurado entra.
      </p>

      <form action={formAction} className="mt-10 space-y-6">
        <div>
          <label className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            PIN admin
          </label>
          <input
            type="password"
            name="admin_pin"
            inputMode="numeric"
            pattern="\d*"
            autoComplete="off"
            placeholder="••••"
            className="mt-3 block w-full mono text-center text-[28px] tracking-[0.35em]"
            required
            autoFocus
          />
        </div>

        {state?.error && (
          <p
            role="alert"
            className="rounded-[10px] border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3 text-[13px] text-[var(--color-danger)]"
          >
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn btn-primary w-full">
          {pending ? 'Validando…' : 'Entrar al panel'}
        </button>
      </form>
    </section>
  );
}
