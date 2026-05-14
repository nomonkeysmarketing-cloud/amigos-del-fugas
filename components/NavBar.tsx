import Link from 'next/link';
import type { User } from '@/lib/db';
import { logoutAction } from '@/app/actions';

export function NavBar({ user }: { user: User | null }) {
  return (
    <header className="nav-blur sticky top-0 z-40">
      <nav className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <BallMark />
          <span className="display text-[20px] leading-none -tracking-[0.02em] transition group-hover:[&_.brand-main]:text-[var(--color-primary)]">
            <span className="brand-main">Amigos del</span>&nbsp;
            <span className="text-[var(--color-primary)]">Fugas</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          <NavLink href="/partidos">Cancha</NavLink>
          <NavLink href="/tablero">El Tablero</NavLink>
          <NavLink href="/reglas">Reglas</NavLink>
        </ul>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-[13px] text-[var(--color-secondary-text)] md:inline">
                <span className="text-[var(--color-muted)]">Hola, </span>
                <span className="font-medium text-[var(--color-text)]">{user.name}</span>
              </span>
              <Link
                href="/cambiar-pin"
                className="hidden h-9 items-center rounded-md px-3 text-[13px] text-[var(--color-secondary-text)] transition hover:bg-white/4 hover:text-[var(--color-text)] md:inline-flex"
              >
                Cambiar PIN
              </Link>
              <form action={logoutAction}>
                <button className="btn btn-ghost h-9 px-3 text-[13px]" type="submit">
                  Salir
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary h-9 px-4 text-[13px]">
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="rounded-md px-3 py-2 text-[13px] font-medium text-[var(--color-secondary-text)] transition hover:bg-white/4 hover:text-[var(--color-text)]"
      >
        {children}
      </Link>
    </li>
  );
}

function BallMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-primary)]" />
      <path
        d="M12 4L14.5 7.5L13 11.5L9.5 11L8 7.5L12 4ZM12 4L16 7M12 4L8 7M8 7.5L4.5 9M14.5 7.5L19.5 9M9.5 11L7 14.5M13 11.5L16.5 14.5M7 14.5L9 19M16.5 14.5L15 19M9 19L12 20M15 19L12 20M4.5 9L4 14L7 14.5M19.5 9L20 14L16.5 14.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        className="text-[var(--color-text)]"
      />
    </svg>
  );
}
