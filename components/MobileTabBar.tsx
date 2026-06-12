'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/partidos', label: 'Cancha', icon: 'pitch' },
  { href: '/tablero', label: 'Tablero', icon: 'trophy' },
  { href: '/historial', label: 'Historial', icon: 'history' },
  { href: '/reglas', label: 'Reglas', icon: 'rules' },
] as const;

type IconName = (typeof TABS)[number]['icon'];

export function MobileTabBar({ visible }: { visible: boolean }) {
  const pathname = usePathname() || '/';
  if (!visible) return null;

  return (
    <nav
      aria-label="Navegación principal"
      className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[rgba(8,17,13,0.85)] backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex h-16 max-w-md items-stretch justify-around">
        {TABS.map((t) => {
          const active = pathname === t.href || pathname.startsWith(t.href + '/');
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={`flex h-full flex-col items-center justify-center gap-1 transition ${
                  active
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-muted)] active:text-[var(--color-text)]'
                }`}
              >
                <TabIcon name={t.icon} active={active} />
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.14em]"
                >
                  {t.label}
                </span>
                {active && (
                  <span className="absolute top-0 h-[2px] w-10 rounded-b-full bg-[var(--color-primary)]" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function TabIcon({ name, active }: { name: IconName; active: boolean }) {
  const stroke = active ? 'var(--color-primary)' : 'currentColor';
  const fill = active ? 'var(--color-primary)' : 'none';
  switch (name) {
    case 'pitch':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="1.5" stroke={stroke} strokeWidth="1.5" />
          <path d="M12 5v14" stroke={stroke} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2.2" stroke={stroke} strokeWidth="1.5" />
          <path d="M3 9h2.5v6H3M21 9h-2.5v6H21" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'trophy':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 4h10v4.5a5 5 0 1 1-10 0V4Z"
            stroke={stroke}
            strokeWidth="1.5"
            fill={active ? fill : 'none'}
            opacity={active ? 0.18 : 1}
          />
          <path d="M7 4h10v4.5a5 5 0 1 1-10 0V4Z" stroke={stroke} strokeWidth="1.5" />
          <path
            d="M5 6h2M17 6h2M5 6v2a3 3 0 0 0 2 2.8M19 6v2a3 3 0 0 1-2 2.8"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M10 14h4l1 6H9l1-6Z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8 20h8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'history':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.5" />
          <path d="M12 7v5l3 2" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 12a9 9 0 0 1 3-6.7" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'rules':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="5" y="3" width="14" height="18" rx="2" stroke={stroke} strokeWidth="1.5" />
          <path d="M9 8h6M9 12h6M9 16h4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}
