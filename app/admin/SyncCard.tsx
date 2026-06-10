'use client';

import { useState, useTransition } from 'react';
import type { SyncLogEntry } from '@/lib/db';
import { runSyncAction } from '@/app/actions';

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso + 'Z').getTime();
  if (ms < 0) return 'ahora';
  const s = Math.floor(ms / 1000);
  if (s < 60) return `hace ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  const d = Math.floor(h / 24);
  return `hace ${d}d`;
}

type Props = {
  configured: boolean;
  last: SyncLogEntry | null;
};

export function SyncCard({ configured, last }: Props) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  const runNow = () => {
    startTransition(async () => {
      setResult(null);
      const r = await runSyncAction();
      if (!r.ok) {
        setResult(`✗ ${r.error}`);
        return;
      }
      if (r.skipped) {
        setResult(`⊘ Sync skipped: ${r.reason ?? 'token no configurado'}`);
        return;
      }
      setResult(
        `✓ ${r.updated} actualizados · ${r.matched} matcheados · ${r.mapped} mapeados nuevos`,
      );
      // Reload to refresh "last sync" + match list
      setTimeout(() => window.location.reload(), 1500);
    });
  };

  const tone = !configured
    ? 'border-[var(--color-gold)]/30 bg-[var(--color-gold)]/[0.04]'
    : last?.status === 'ok'
      ? 'border-[var(--color-primary)]/25 bg-[var(--color-primary)]/[0.04]'
      : last?.status === 'error'
        ? 'border-[var(--color-danger)]/30 bg-[var(--color-danger)]/[0.04]'
        : 'border-[var(--color-border)]';

  return (
    <div className={`surface mt-6 border ${tone}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Sync automático · Football-Data.org
          </p>
          <p className="mt-2 text-[14px] font-medium">
            {!configured ? (
              <span className="text-[var(--color-gold)]">Token no configurado</span>
            ) : !last ? (
              <span className="text-[var(--color-secondary-text)]">Aún no ha corrido</span>
            ) : last.status === 'ok' ? (
              <span className="text-[var(--color-text)]">
                Última sync{' '}
                <span className="text-[var(--color-primary)]">{timeAgo(last.ran_at)}</span>
              </span>
            ) : last.status === 'skipped' ? (
              <span className="text-[var(--color-gold)]">
                Última sync skipped {timeAgo(last.ran_at)}
              </span>
            ) : (
              <span className="text-[var(--color-danger)]">Falló {timeAgo(last.ran_at)}</span>
            )}
          </p>
          {last?.message && (
            <p className="mono mt-1 max-w-[60ch] truncate text-[11px] text-[var(--color-muted)]">
              {last.message}
            </p>
          )}
        </div>
        <button onClick={runNow} disabled={pending} className="btn btn-secondary !h-10 px-4 text-[12px]">
          {pending ? 'Corriendo…' : 'Sync ahora'}
        </button>
      </div>
      {result && (
        <p className="mono border-t border-[var(--color-border)]/60 px-5 py-2.5 text-[12px] text-[var(--color-secondary-text)]">
          {result}
        </p>
      )}
      {!configured && (
        <p className="border-t border-[var(--color-border)]/60 px-5 py-3 text-[11px] text-[var(--color-muted)]">
          Para activar: registrarse en{' '}
          <span className="text-[var(--color-text)]">football-data.org/client/register</span>,
          copiar el token del email y meterlo en Vercel como{' '}
          <span className="mono">FOOTBALL_DATA_TOKEN</span>. El cron correrá cada 30 min
          automáticamente.
        </p>
      )}
    </div>
  );
}
