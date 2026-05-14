export default function ReglasPage() {
  return (
    <section className="mx-auto max-w-[880px] px-6 py-16 md:px-10 md:py-24">
      <p className="eyebrow">Reglas</p>
      <h1 className="display mt-4 text-[clamp(56px,9vw,128px)] leading-[0.92]">
        Las reglas son<br /><span className="text-[var(--color-primary)]">sagradas.</span>
      </h1>
      <p className="mt-6 max-w-[58ch] text-[18px] leading-[1.6] text-[var(--color-secondary-text)]">
        La idea es simple: predices el marcador de cada partido del Mundial 2026 antes de que empiece.
        Mientras más cerca de la realidad, más puntos. El que sume más al final del Mundial, manda.
      </p>

      <div className="mt-16 space-y-12">
        <Block n="01" title="El scoring">
          <ul className="space-y-4">
            <li className="flex items-center gap-6">
              <span className="display w-[80px] text-[64px] leading-none text-[var(--color-primary)]">3</span>
              <div>
                <p className="text-[16px] font-medium">Marcador exacto.</p>
                <p className="text-[14px] text-[var(--color-secondary-text)]">Le clavaste al 2-1, te llevas 3 puntos. Eres brujo.</p>
              </div>
            </li>
            <li className="flex items-center gap-6">
              <span className="display w-[80px] text-[64px] leading-none text-[var(--color-gold)]">1</span>
              <div>
                <p className="text-[16px] font-medium">Acertaste al resultado.</p>
                <p className="text-[14px] text-[var(--color-secondary-text)]">Dijiste que gana Argentina pero pusiste 2-0 y fue 3-1. Te toca 1 punto por leer la cancha.</p>
              </div>
            </li>
            <li className="flex items-center gap-6">
              <span className="display w-[80px] text-[64px] leading-none text-[var(--color-muted)]">0</span>
              <div>
                <p className="text-[16px] font-medium">Fallaste.</p>
                <p className="text-[14px] text-[var(--color-secondary-text)]">El balón a veces miente. Pa' la otra.</p>
              </div>
            </li>
          </ul>
        </Block>

        <Block n="02" title="El candado">
          <p className="text-[var(--color-secondary-text)]">
            Las predicciones se cierran <strong className="text-[var(--color-text)]">exactamente 1 minuto antes del kickoff</strong>.
            Después no puedes editar nada — ni para bien, ni para mal. Si no metiste pronóstico antes del candado, ese partido se va con 0 puntos.
          </p>
          <p className="mt-3 text-[var(--color-secondary-text)]">
            Hasta el cierre puedes cambiar tu marcador todas las veces que quieras. Confía en tu corazonada.
          </p>
        </Block>

        <Block n="03" title="Visibilidad">
          <p className="text-[var(--color-secondary-text)]">
            Los pronósticos de cada quien <strong className="text-[var(--color-text)]">se mantienen privados hasta que el partido cierra</strong>.
            Una vez que arranca el partido, todos pueden ver qué jugó cada uno. Sin trampa, sin copia.
          </p>
        </Block>

        <Block n="04" title="Empates">
          <p className="text-[var(--color-secondary-text)]">
            En la fase de grupos cuenta el marcador a los 90 minutos (tiempo regular).
            En knockout, cuenta el <strong className="text-[var(--color-text)]">marcador final que avance al equipo</strong>: si hay tiempo extra, ese marcador es el válido; si llega a penales, el marcador queda como terminó el alargue (no se cuentan los penales).
          </p>
        </Block>

        <Block n="05" title="Desempate del tablero">
          <p className="text-[var(--color-secondary-text)]">
            Si dos jugadores quedan empatados en puntos totales al final del Mundial, gana el que tenga más
            <strong className="text-[var(--color-text)]"> aciertos exactos</strong> (de 3 pts). Si siguen empatados, gana el que jugó más partidos.
          </p>
        </Block>

        <Block n="06" title="El premio">
          <p className="text-[var(--color-secondary-text)]">
            Lo acuerdan entre amigos. La app no maneja dinero — solo cuenta los puntos. El honor, las cuentas pendientes
            y la presumida en el chat las pagan ustedes.
          </p>
        </Block>
      </div>

      <div className="mt-20 border-t border-[var(--color-border)] pt-8 text-center">
        <p className="display text-[clamp(28px,4vw,48px)] leading-none">
          El que la acierta,<br />
          <span className="text-[var(--color-primary)]">se la lleva.</span>
        </p>
      </div>
    </section>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <article>
      <div className="flex items-baseline gap-4">
        <span className="mono text-[11px] tabular-nums text-[var(--color-primary)]">{n}</span>
        <h2 className="display text-[clamp(28px,3.5vw,48px)] leading-none">{title}</h2>
      </div>
      <div className="mt-5 pl-[36px] text-[16px] leading-[1.6]">{children}</div>
    </article>
  );
}
