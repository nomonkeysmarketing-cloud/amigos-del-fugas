import { listMatches, listUsers } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { adminLogoutAction } from '@/app/actions';
import { AdminGate } from './AdminGate';
import { AdminMatchRow } from './AdminMatchRow';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminGate />;
  }

  const [matches, players] = await Promise.all([listMatches(), listUsers()]);

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 md:px-10 md:py-16">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Admin · Resultados</p>
          <h1 className="display mt-3 text-[clamp(36px,7vw,72px)] leading-[0.92]">
            Mete los <span className="text-[var(--color-magenta)]">resultados</span>.
          </h1>
        </div>
        <form action={adminLogoutAction}>
          <button type="submit" className="btn btn-ghost h-9 px-3 text-[12px]">
            Cerrar sesión admin
          </button>
        </form>
      </header>

      <p className="mt-5 max-w-[60ch] text-[var(--color-secondary-text)]">
        Cuando termina un partido, mete el marcador final aquí. El tablero se actualiza solo.
      </p>

      <div className="surface mt-8 p-5 md:px-6 md:py-4">
        <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Jugadores ({players.length})
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {players.map((p) => (
            <div
              key={p.id}
              className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-[12px]"
            >
              <span className="font-medium">{p.name}</span>
              {p.pin_changed ? (
                <span className="mono text-[var(--color-primary)]">PIN personalizado ✓</span>
              ) : (
                <span className="mono text-[var(--color-gold)]">PIN: {p.pin}</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-[var(--color-muted)]">
          PINs en dorado = el original. <span className="text-[var(--color-primary)]">PIN personalizado ✓</span> = el jugador ya lo cambió.
        </p>
      </div>

      <div className="surface mt-8 overflow-hidden md:mt-10">
        <header className="hidden md:grid grid-cols-[80px_1fr_120px_140px] items-center gap-3 border-b border-[var(--color-border)] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          <span>ID</span>
          <span>Partido</span>
          <span>Marcador</span>
          <span>Acción</span>
        </header>
        {matches.map((m) => (
          <AdminMatchRow key={m.id} match={m} />
        ))}
      </div>
    </section>
  );
}
