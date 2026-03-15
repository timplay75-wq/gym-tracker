import { useEffect, useRef } from 'react';

/**
 * Screen Wake Lock API — не даёт экрану гаснуть пока active=true.
 * Автоматически запрашивает lock при active=true и освобождает при active=false.
 */
export function useWakeLock(active: boolean) {
  const lockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active) {
      lockRef.current?.release().catch(() => {});
      lockRef.current = null;
      return;
    }

    if (!('wakeLock' in navigator)) return;

    let cancelled = false;

    navigator.wakeLock.request('screen').then(lock => {
      if (cancelled) {
        lock.release().catch(() => {});
        return;
      }
      lockRef.current = lock;
      lock.addEventListener('release', () => {
        // Переполучить lock если страница снова стала видимой
        if (active && !cancelled) {
          navigator.wakeLock.request('screen').then(newLock => {
            if (!cancelled) lockRef.current = newLock;
          }).catch(() => {});
        }
      });
    }).catch(() => {});

    return () => {
      cancelled = true;
      lockRef.current?.release().catch(() => {});
      lockRef.current = null;
    };
  }, [active]);
}
