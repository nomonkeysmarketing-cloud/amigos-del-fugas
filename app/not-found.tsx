import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-20 md:py-32 text-center md:text-left">
      <p className="eyebrow">Error 404 · Fuera de juego</p>
      <h1 className="display mt-4 text-[clamp(64px,14vw,140px)] leading-[0.88]">
        El balón<br />
        <span className="text-[var(--color-primary)]">se salió</span><br />
        del campo<span className="text-[var(--color-primary)]">.</span>
      </h1>
      <p className="mt-6 max-w-[42ch] text-[var(--color-secondary-text)] mx-auto md:mx-0">
        Esta página no existe. O se cayó la red. O alguien metió mano en el calendario. Vuelve a la cancha.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3 md:justify-start">
        <Link href="/" className="btn btn-primary">
          Volver al inicio
        </Link>
        <Link href="/tablero" className="btn btn-secondary">
          Ver el tablero
        </Link>
      </div>
    </section>
  );
}
