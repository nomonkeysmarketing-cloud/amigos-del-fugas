// Service worker mínimo — sólo presencia para habilitar instalación PWA en Android.
// NO cacheamos nada para evitar mostrar datos viejos (predicciones, marcadores).
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Pass-through: cada request va a la red, sin caché.
self.addEventListener('fetch', () => {});
