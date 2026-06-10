import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'La Quiniela de los Amigos del Fugas',
    short_name: 'Amigos del Fugas',
    description: 'Quiniela del Mundial FIFA 2026 entre los amigos del Fugas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#08110d',
    theme_color: '#08110d',
    orientation: 'portrait',
    lang: 'es-MX',
    categories: ['sports', 'entertainment', 'games'],
    icons: [
      { src: '/api/icon-192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/api/icon-512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/api/icon-maskable-512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
