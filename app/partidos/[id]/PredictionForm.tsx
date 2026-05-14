'use client';

import { useActionState } from 'react';
import { savePredictionAction } from '@/app/actions';
import { ScoreStepper } from '@/components/ScoreStepper';

type State = { ok: boolean; error?: string; message?: string } | null;

type Props = {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  initialHome: number;
  initialAway: number;
  hasPrediction: boolean;
};

export function PredictionForm({
  matchId,
  homeTeam,
  awayTeam,
  initialHome,
  initialAway,
  hasPrediction,
}: Props) {
  const [state, formAction, pending] = useActionState<State, FormData>(savePredictionAction, null);

  return (
    <form action={formAction} className="surface mt-4 p-8">
      <input type="hidden" name="match_id" value={matchId} />

      <div className="flex items-center justify-center gap-6 md:gap-12">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[13px] font-medium text-[var(--color-secondary-text)]">{homeTeam}</span>
          <ScoreStepper name="home_score" defaultValue={initialHome} ariaLabel={`Marcador ${homeTeam}`} />
        </div>
        <span className="mono text-[40px] leading-none text-[var(--color-muted)]">—</span>
        <div className="flex flex-col items-center gap-3">
          <span className="text-[13px] font-medium text-[var(--color-secondary-text)]">{awayTeam}</span>
          <ScoreStepper name="away_score" defaultValue={initialAway} ariaLabel={`Marcador ${awayTeam}`} />
        </div>
      </div>

      {state?.error && (
        <p className="mt-6 rounded-[10px] border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3 text-center text-[13px] text-[var(--color-danger)]">
          {state.error}
        </p>
      )}
      {state?.ok && state?.message && (
        <p className="mt-6 rounded-[10px] border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 px-4 py-3 text-center text-[13px] text-[var(--color-primary)]">
          {state.message}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary min-w-[220px]">
          {pending ? 'Guardando…' : hasPrediction ? 'Actualizar pronóstico' : 'Lanzar pronóstico'}
        </button>
        <p className="text-center text-[11px] text-[var(--color-muted)]">
          Puedes actualizar tu marcador hasta 1 minuto antes del kickoff.
        </p>
      </div>
    </form>
  );
}
