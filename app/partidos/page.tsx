import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { listMatches, getPredictionsForUser, isMatchLocked } from '@/lib/db';
import { MatchCard } from '@/components/MatchCard';
import { STAGE_LABELS } from '@/lib/matches-data';

export const dynamic = 'force-dynamic';

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.pin_changed) redirect('/cambiar-pin');

  const { filter = 'upcoming' } = await searchParams;
  const [allMatches, predictions] = await Promise.all([
    listMatches(),
    getPredictionsForUser(user.id),
  ]);
  const now = new Date();

  let matches = allMatches;
  if (filter === 'upcoming') {
    matches = allMatches.filter((m) => m.status !== 'final' && new Date(m.kickoff_utc).getTime() > now.getTime() - 3 * 60 * 60 * 1000);
  } else if (filter === 'mine') {
    matches = allMatches.filter((m) => predictions.has(m.id));
  } else if (filter === 'done') {
    matches = allMatches.filter((m) => m.status === 'final');
  }

  const totalPredicted = predictions.size;
  const totalMatches = allMatches.length;

  return (
    <section className="mx-auto max-w-[1320px] px-6 py-12 md:px-10 md:py-16">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Cancha · {user.name}</p>
          <h1 className="display mt-3 text-[clamp(40px,6vw,80px)] leading-[0.95]">
            Mis<br />
            <span className="text-[var(--color-primary)]">Pronósticos.</span>
          </h1>
        </div>
        <div className="flex items-baseline gap-6">
          <Counter label="Jugadas" value={`${totalPredicted}`} sub={`de ${totalMatches}`} />
          <Counter label="Cierre" value="-1 MIN" sub="antes del kickoff" />
        </div>
      </header>

      {/* Filters */}
      <nav className="mt-10 flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] pb-4">
        <FilterTab href="/partidos?filter=upcoming" active={filter === 'upcoming'}>Próximos</FilterTab>
        <FilterTab href="/partidos?filter=mine" active={filter === 'mine'}>Mis jugadas</FilterTab>
        <FilterTab href="/partidos?filter=done" active={filter === 'done'}>Finalizados</FilterTab>
        <FilterTab href="/partidos?filter=all" active={filter === 'all'}>Todos</FilterTab>
      </nav>

      {/* Match list */}
      {matches.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {matches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              prediction={predictions.get(m.id)}
              locked={isMatchLocked(m)}
              href={`/partidos/${m.id}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function FilterTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-[10px] px-4 py-2 text-[13px] font-medium transition ${
        active
          ? 'bg-[var(--color-primary)]/12 text-[var(--color-primary)]'
          : 'text-[var(--color-secondary-text)] hover:bg-white/4 hover:text-[var(--color-text)]'
      }`}
    >
      {children}
    </Link>
  );
}

function Counter({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="display mt-1 text-[32px] leading-none">{value}</p>
      <p className="mt-1 text-[11px] text-[var(--color-muted)]">{sub}</p>
    </div>
  );
}

function EmptyState({ filter }: { filter: string }) {
  const messages: Record<string, string> = {
    upcoming: 'No hay partidos próximos. Calentando la cancha…',
    mine: 'Aún no has lanzado ningún pronóstico. El primer partido te espera.',
    done: 'Todavía no hay partidos finalizados. Paciencia.',
    all: 'No hay partidos cargados.',
  };
  return (
    <div className="surface mt-10 p-12 text-center">
      <p className="text-[var(--color-secondary-text)]">{messages[filter] ?? messages.all}</p>
      {filter !== 'upcoming' && (
        <Link href="/partidos?filter=upcoming" className="btn btn-secondary mt-6 inline-flex">
          Ver próximos
        </Link>
      )}
    </div>
  );
}
