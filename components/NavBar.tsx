'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { User } from '@/lib/db';
import { logoutAction } from '@/app/actions';

type UserPublic = Pick<User, 'id' | 'name' | 'avatar_seed' | 'pin_changed'>;

export function NavBar({ user }: { user: UserPublic | null }) {
  const [menu, setMenu] = useState(false);

  return (
    <header className="nav-blur sticky top-0 z-40">
      <nav className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-3 px-4 md:px-10">
        {/* Left: brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <FifaMark />
          <span className="display text-[18px] leading-none -tracking-[0.02em] transition group-hover:[&_.brand-main]:text-[var(--color-primary)] md:text-[20px]">
            <span className="brand-main">Amigos del</span>&nbsp;
            <span className="text-[var(--color-primary)]">Fugas</span>
          </span>
        </Link>

        {/* Center (desktop): nav links */}
        <ul className="hidden flex-1 items-center justify-center gap-1 md:flex">
          <NavLink href="/partidos">Cancha</NavLink>
          <NavLink href="/tablero">El Tablero</NavLink>
          <NavLink href="/reglas">Reglas</NavLink>
        </ul>

        {/* Right: user / login */}
        <div className="flex items-center gap-1.5">
          {user ? (
            <>
              <span className="hidden text-[13px] text-[var(--color-secondary-text)] md:inline">
                <span className="text-[var(--color-muted)]">Hola, </span>
                <span className="font-medium text-[var(--color-text)]">{user.name}</span>
              </span>
              <Link
                href="/cambiar-pin"
                className="hidden h-9 items-center rounded-md px-3 text-[13px] text-[var(--color-secondary-text)] transition hover:bg-white/[0.04] hover:text-[var(--color-text)] md:inline-flex"
              >
                Cambiar PIN
              </Link>
              <form action={logoutAction} className="hidden md:block">
                <button className="btn btn-ghost h-10 px-3 text-[13px]" type="submit">
                  Salir
                </button>
              </form>

              {/* Mobile: user button with menu */}
              <button
                type="button"
                onClick={() => setMenu((m) => !m)}
                aria-expanded={menu}
                aria-label="Menú de cuenta"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[12px] font-semibold uppercase text-[var(--color-secondary-text)] transition active:scale-95 md:hidden"
              >
                {user.name.slice(0, 1)}
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary !h-10 px-4 text-[13px]">
              Entrar
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile dropdown sheet */}
      {user && menu && (
        <>
          <div
            className="fixed inset-0 z-30 md:hidden"
            onClick={() => setMenu(false)}
            aria-hidden
          />
          <div className="absolute right-3 top-[60px] z-40 w-56 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] py-2 shadow-[0_24px_56px_-20px_rgba(0,0,0,0.7)] md:hidden">
            <div className="border-b border-[var(--color-border)]/60 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">Hola</p>
              <p className="mt-0.5 text-[14px] font-medium">{user.name}</p>
            </div>
            <Link
              href="/cambiar-pin"
              onClick={() => setMenu(false)}
              className="flex items-center justify-between px-4 py-3 text-[14px] text-[var(--color-secondary-text)] transition active:bg-white/[0.04] active:text-[var(--color-text)]"
            >
              <span>Cambiar PIN</span>
              <span className="text-[var(--color-muted)]">›</span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center justify-between px-4 py-3 text-left text-[14px] text-[var(--color-magenta)] transition active:bg-[var(--color-magenta)]/[0.06]"
              >
                <span>Salir</span>
                <span aria-hidden>›</span>
              </button>
            </form>
          </div>
        </>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="rounded-md px-3 py-2 text-[13px] font-medium text-[var(--color-secondary-text)] transition hover:bg-white/[0.04] hover:text-[var(--color-text)]"
      >
        {children}
      </Link>
    </li>
  );
}

function FifaMark() {
  return (
    <Image
      src="/icon-192.png"
      alt=""
      width={28}
      height={28}
      className="rounded-[6px]"
      priority
      aria-hidden
    />
  );
}
