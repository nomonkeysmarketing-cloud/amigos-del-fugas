import { listMatches, listUsers } from '@/lib/db';
import { STAGE_LABELS } from '@/lib/matches-data';
import { AdminMatchRow } from './AdminMatchRow';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [matches, players] = await Promise.all([listMatches(), listUsers()]);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
      <p className="eyebrow">Admin · Resultados</p>
      <h1 className="display mt-3 text-[clamp(40px,6vw,80px)] leading-[0.92]">
        Mete los <span className="text-[var(--color-magenta)]">resultados</span>.
      </h1>
      <p className="mt-5 max-w-[60ch] text-[var(--color-secondary-text)]">
        Cuando termina un partido, mete el marcador final aquí y marca como <span className="mono text-[var(--color-primary)]">FINAL</span>. El tablero se actualiza solo. Necesitas el PIN admin.
      </p>

      <div className="surface mt-8 px-6 py-4">
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
          PINs en dorado = el original que reparte el sistema. <span className="text-[var(--color-primary)]">PIN personalizado ✓</span> = el jugador ya lo cambió por uno suyo (no lo puedes ver).
        </p>
      </div>

      <div className="mt-10 surface overflow-hidden">
        <header className="grid grid-cols-[80px_1fr_120px_130px] items-center gap-3 border-b border-[var(--color-border)] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
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
