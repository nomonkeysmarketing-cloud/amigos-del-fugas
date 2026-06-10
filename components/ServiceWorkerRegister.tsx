'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    // Don't register in dev — avoids stale caching while developing.
    if (window.location.hostname === 'localhost') return;

    const t = window.setTimeout(() => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // ignore — non-critical
      });
    }, 1500);

    return () => window.clearTimeout(t);
  }, []);

  return null;
}
