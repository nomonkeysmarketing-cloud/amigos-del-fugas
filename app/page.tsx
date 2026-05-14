import Link from 'next/link';
import { FlagBadge } from '@/components/FlagBadge';
import { CountdownTimer } from '@/components/CountdownTimer';
import { listMatches, listUsers, leaderboard, isMatchLocked } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [user, matches, players, board] = await Promise.all([
    getCurrentUser(),
    listMatches(),
    listUsers(),
    leaderboard(),
  ]);

  const now = new Date();
  const upcoming = matches.find((m) => new Date(m.kickoff_utc) > now) ?? matches[0];

  // Ticker fixtures (first 10 group-stage matches)
  const ticker = matches.slice(0, 14);

  return (
    <>
      {/* Editorial top rule */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 right-0 top-[64px] h-px bg-[var(--color-border)]/60" />
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="field-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        {/* Giant outline 26 */}
        <span
          aria-hidden
          className="display pointer-events-none absolute -bottom-12 -right-20 select-none text-[clamp(280px,40vw,520px)] leading-none text-transparent"
          style={{ WebkitTextStroke: '1px rgba(232,229,216,0.08)' }}
        >
          26
        </span>

        <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 pb-24 pt-20 md:grid-cols-12 md:px-10 md:pt-28 lg:gap-8 lg:pb-32">
          {/* LEFT */}
          <div className="md:col-span-7">
            <p className="eyebrow">LIGA PRIVADA · LOS AMIGOS DEL FUGAS · {players.length} JUGADORES</p>

            <h1 className="display mt-6 text-[clamp(56px,9vw,128px)] leading-[0.92] tracking-[-0.01em]">
              Quiniela
              <br />
              <span className="text-[var(--color-primary)]">Mundial&nbsp;26<span className="text-[var(--color-primary)]">.</span></span>
            </h1>

            <p className="mt-7 max-w-[44ch] text-[18px] leading-[1.55] text-[var(--color-secondary-text)]">
              La pool donde se juega el orgullo del grupo. Lanzas tu marcador antes del silbatazo,{' '}
              <span className="text-[var(--color-text)]">acertaste exacto vale 3</span>, le atinaste
              al ganador vale 1, fallar no vale nada.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              {user ? (
                <Link href="/partidos" className="btn btn-primary">
                  Hacer mi quiniela
                </Link>
              ) : (
                <Link href="/login" className="btn btn-primary">
                  Entrar a jugar
                </Link>
              )}
              <Link href="/reglas" className="btn btn-ghost">
                Ver reglas →
              </Link>
            </div>

            {/* Mini stats */}
            <div className="mt-12 grid max-w-[520px] grid-cols-3 gap-6 border-t border-[var(--color-border)] pt-6">
              <Stat label="Partidos" value="104" />
              <Stat label="Selecciones" value="48" />
              <Stat label="Final" value="19·JUL" />
            </div>
          </div>

          {/* RIGHT — next match card */}
          <div className="md:col-span-5">
            <div className="relative">
              <div
                className="surface relative rotate-[-2.5deg] p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]"
                style={{ borderColor: 'rgba(0,216,107,0.15)' }}
              >
                <p className="eyebrow text-[var(--color-muted)]">Próximo partido</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <FlagBadge code={upcoming.home_code} name={upcoming.home_team} size={56} />
                    <span className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-secondary-text)]">
                      {upcoming.home_code === 'TBD' ? '—' : upcoming.home_code}
                    </span>
                  </div>
                  <div className="mono text-[clamp(40px,5vw,64px)] font-medium leading-none text-[var(--color-muted)]">
                    —
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <FlagBadge code={upcoming.away_code} name={upcoming.away_team} size={56} />
                    <span className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-secondary-text)]">
                      {upcoming.away_code === 'TBD' ? '—' : upcoming.away_code}
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex flex-col items-center gap-1">
                  <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    Kickoff
                  </p>
                  <CountdownTimer targetUtc={upcoming.kickoff_utc} />
                </div>
                <div className="mt-4 border-t border-[var(--color-border)] pt-3 text-center text-[12px] text-[var(--color-muted)]">
                  {upcoming.venue}
                </div>
              </div>
              {/* shadow card behind */}
              <div
                className="surface absolute inset-0 -z-10 translate-x-3 translate-y-3 rotate-[3deg] opacity-40"
                aria-hidden
              />
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-surface)]/40 py-3">
          <div className="ticker flex whitespace-nowrap mono text-[12px] tabular-nums text-[var(--color-muted)]">
            {[...ticker, ...ticker].map((m, i) => (
              <span key={i} className="px-6">
                <span className="text-[var(--color-secondary-text)]">{m.home_code}</span>
                <span className="mx-2 text-[var(--color-muted)]/50">vs</span>
                <span className="text-[var(--color-secondary-text)]">{m.away_code}</span>
                <span className="mx-3 text-[var(--color-muted)]/40">·</span>
                <span>{new Date(m.kickoff_utc).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-[1320px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Cómo funciona</p>
            <h2 className="display mt-4 text-[clamp(40px,5vw,72px)] leading-[0.95]">
              Así se<br />juega.
            </h2>
            <p className="mt-6 max-w-[36ch] text-[var(--color-secondary-text)]">
              Tres pasos. Cero pretextos. Cada partido es una jugada y cada jugada cuenta para el tablero.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:col-span-8 md:grid-cols-3">
            <Step n="01" title="Lee la cancha">
              Antes del silbatazo, lanzas tu marcador exacto para cada partido.
            </Step>
            <Step n="02" title="Le atinas al marcador">
              Clavaste el resultado exacto: te llevas 3 puntos limpios.
            </Step>
            <Step n="03" title="Le atinas al ganador">
              Falló el marcador, pero acertaste quién gana: 1 punto para la causa.
            </Step>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/30">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 py-24 md:grid-cols-12 md:px-10 md:py-28">
          <div className="md:col-span-5">
            <p className="eyebrow">Reglas</p>
            <h2 className="display mt-4 text-[clamp(40px,5vw,72px)] leading-[0.95]">
              Las reglas<br />son <span className="text-[var(--color-primary)]">sagradas</span>.
            </h2>
            <p className="mt-6 max-w-[36ch] text-[var(--color-secondary-text)]">
              Simple, justo, sin trampa. El candado se cierra exactamente un minuto antes del kickoff.
            </p>
          </div>
          <ul className="space-y-3 md:col-span-7">
            <Rule big="3" unit="puntos" title="Marcador exacto" desc="Clavaste el resultado tal cual. Eres brujo." tone="primary" />
            <Rule big="1" unit="punto" title="Solo el resultado" desc="Le atinaste al ganador o al empate, pero no al marcador." tone="gold" />
            <Rule big="0" unit="puntos" title="Fallaste" desc="Pa' la otra. Sigue el siguiente partido." tone="muted" />
            <Rule big="60" unit="seg" title="Candado" desc="Las predicciones se cierran 1 minuto antes del kickoff. Cero excepciones." tone="magenta" />
          </ul>
        </div>
      </section>

      {/* LEADERBOARD PREVIEW */}
      <section className="mx-auto max-w-[1320px] px-6 py-24 md:px-10 md:py-32">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Tablero</p>
            <h2 className="display mt-4 text-[clamp(40px,5vw,72px)] leading-[0.95]">
              El tablero<br />no miente.
            </h2>
            <p className="mt-6 max-w-[40ch] text-[var(--color-secondary-text)]">
              Mira quién manda y quién carga la cheve. En tiempo real, partido a partido.
            </p>
          </div>
          <Link href="/tablero" className="btn btn-secondary hidden md:inline-flex">
            Ver tablero completo →
          </Link>
        </div>

        <div className="mt-10 surface overflow-hidden">
          <header className="grid grid-cols-[56px_1fr_auto_auto] items-center gap-4 border-b border-[var(--color-border)] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            <span>#</span>
            <span>Jugador</span>
            <span>Aciertos</span>
            <span>PTS</span>
          </header>
          {board.slice(0, 7).map((row, i) => (
            <div
              key={row.user_id}
              className={`grid grid-cols-[56px_1fr_auto_auto] items-center gap-4 border-b border-[var(--color-border)]/60 px-6 py-4 last:border-b-0 transition ${
                i === 0 ? 'bg-[var(--color-gold)]/[0.04]' : ''
              }`}
            >
              <span className={`mono text-[22px] tabular-nums ${i < 3 ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[15px] font-medium">{row.name}</span>
              <span className="mono text-[12px] tabular-nums text-[var(--color-muted)]">
                {row.exact_count}·{row.result_count}
              </span>
              <span className="mono text-[22px] font-medium tabular-nums">{row.total}</span>
            </div>
          ))}
          {board.length === 0 && (
            <div className="px-6 py-12 text-center text-[var(--color-muted)]">
              El tablero se enciende con el primer silbatazo.
            </div>
          )}
        </div>
      </section>

      {/* CTA / FOOTER */}
      <section className="border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-[1320px] px-6 py-20 text-center md:px-10">
          <h3 className="display text-[clamp(40px,6vw,96px)] leading-[0.95]">
            Que ruede el balón.<br />
            <span className="text-[var(--color-primary)]">Que hable el tablero.</span>
          </h3>
          <p className="mx-auto mt-6 max-w-[44ch] text-[var(--color-secondary-text)]">
            Hecha entre amigos. Jugada en serio.
          </p>
          <div className="mt-8">
            {user ? (
              <Link href="/partidos" className="btn btn-primary">
                Ir a mis pronósticos
              </Link>
            ) : (
              <Link href="/login" className="btn btn-primary">
                Entrar a jugar
              </Link>
            )}
          </div>
        </div>
        <div className="border-t border-[var(--color-border)]">
          <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-2 px-6 py-6 text-[12px] text-[var(--color-muted)] md:flex-row md:px-10">
            <span>La Quiniela de los Amigos del Fugas · Mundial FIFA 2026</span>
            <span className="mono">EL QUE LA ACIERTA, SE LA LLEVA.</span>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">{label}</p>
      <p className="display mt-1 text-[36px] leading-none text-[var(--color-text)]">{value}</p>
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="surface p-6 surface-hover">
      <span className="mono text-[12px] tabular-nums text-[var(--color-primary)]">{n}</span>
      <h3 className="display mt-4 text-[28px] leading-none">{title}</h3>
      <p className="mt-3 text-[14px] leading-[1.55] text-[var(--color-secondary-text)]">{children}</p>
    </div>
  );
}

function Rule({
  big,
  unit,
  title,
  desc,
  tone,
}: {
  big: string;
  unit: string;
  title: string;
  desc: string;
  tone: 'primary' | 'gold' | 'muted' | 'magenta';
}) {
  const colors: Record<typeof tone, string> = {
    primary: 'text-[var(--color-primary)]',
    gold: 'text-[var(--color-gold)]',
    muted: 'text-[var(--color-muted)]',
    magenta: 'text-[var(--color-magenta)]',
  };
  return (
    <li className="surface flex items-center gap-6 px-6 py-5 surface-hover">
      <div className="flex min-w-[88px] items-baseline gap-1.5">
        <span className={`display text-[64px] leading-none ${colors[tone]}`}>{big}</span>
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {unit}
        </span>
      </div>
      <div className="flex-1">
        <h4 className="text-[18px] font-medium">{title}</h4>
        <p className="mt-1 text-[14px] text-[var(--color-secondary-text)]">{desc}</p>
      </div>
    </li>
  );
}
