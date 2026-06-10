import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'La Quiniela de los Amigos del Fugas',
    short_name: 'Amigos del Fugas',
    description: 'Quiniela del Mundial FIFA 2026 entre los amigos del Fugas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#54C431',
    theme_color: '#08110d',
    orientation: 'portrait',
    lang: 'es-MX',
    categories: ['sports', 'entertainment', 'games'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
