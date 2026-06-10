import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NavBar } from '@/components/NavBar';
import { MobileTabBar } from '@/components/MobileTabBar';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { getCurrentUser } from '@/lib/auth';

const display = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
});
const sans = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'La Quiniela de los Amigos del Fugas · Mundial 2026',
  description:
    'La pool de predicciones del Mundial FIFA 2026 entre los amigos del Fugas. Marcador exacto vale 3, ganador vale 1, fallar no vale nada. Que hable el tablero.',
  applicationName: 'Amigos del Fugas',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Amigos del Fugas',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'La Quiniela de los Amigos del Fugas · Mundial 2026',
    description: 'Los cuates del Fugas. Un Mundial. Un campeón.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#08110d',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      style={
        {
          // map next/font CSS vars onto the @theme tokens
          ['--font-display' as string]: 'var(--font-bebas), Impact, sans-serif',
          ['--font-sans' as string]: 'var(--font-geist), system-ui, sans-serif',
          ['--font-mono' as string]: 'var(--font-geist-mono), Menlo, monospace',
        } as React.CSSProperties
      }
    >
      <body>
        <div className="relative z-10">
          <NavBar user={user} />
          <main
            className="relative md:pb-0"
            style={{ paddingBottom: user ? 'calc(80px + env(safe-area-inset-bottom))' : '0' }}
          >
            {children}
          </main>
        </div>
        <MobileTabBar visible={Boolean(user)} />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
