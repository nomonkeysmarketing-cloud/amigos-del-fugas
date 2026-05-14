import { leaderboard } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { LiveLeaderboard } from './LiveLeaderboard';

export const dynamic = 'force-dynamic';

export default async function TableroPage() {
  const [initial, me] = await Promise.all([leaderboard(), getCurrentUser()]);

  return (
    <section className="mx-auto max-w-[1080px] px-6 py-12 md:px-10 md:py-16">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Tablero · En vivo</p>
          <h1 className="display mt-3 text-[clamp(48px,7vw,96px)] leading-[0.92]">
            El tablero<br />
            <span className="text-[var(--color-primary)]">no miente.</span>
          </h1>
          <p className="mt-5 max-w-[44ch] text-[var(--color-secondary-text)]">
            Posiciones, aciertos exactos y atinadas al ganador. Se actualiza solo cada 5 segundos.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-end">
          <span className="live-dot inline-block h-2 w-2 rounded-full bg-[var(--color-primary)]" />
          <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-primary)]">
            EN VIVO
          </span>
        </div>
      </header>

      <LiveLeaderboard initial={initial} meId={me?.id ?? null} />

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Legend big="3" tone="primary" title="Exacto" desc="Marcador clavado" />
        <Legend big="1" tone="gold" title="Resultado" desc="Atinaste al ganador" />
        <Legend big="0" tone="muted" title="Fallaste" desc="Pa' la otra" />
      </div>
    </section>
  );
}

function Legend({
  big,
  tone,
  title,
  desc,
}: {
  big: string;
  tone: 'primary' | 'gold' | 'muted';
  title: string;
  desc: string;
}) {
  const colors = {
    primary: 'text-[var(--color-primary)]',
    gold: 'text-[var(--color-gold)]',
    muted: 'text-[var(--color-muted)]',
  } as const;
  return (
    <div className="surface flex items-center gap-5 px-6 py-4">
      <span className={`display text-[48px] leading-none ${colors[tone]}`}>{big}</span>
      <div>
        <p className="text-[14px] font-medium">{title}</p>
        <p className="text-[12px] text-[var(--color-muted)]">{desc}</p>
      </div>
    </div>
  );
}
