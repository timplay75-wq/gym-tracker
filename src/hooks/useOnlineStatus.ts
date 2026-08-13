import { useState, useEffect, useRef, useCallback } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    setWasOffline(true);
    // Reset wasOffline after 5s
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setWasOffline(false), 5000);
  }, []);

  const handleOffline = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setIsOnline(false);
    setWasOffline(false);
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      // Таймер переживал размонтирование и дёргал setState у мёртвого компонента.
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [handleOnline, handleOffline]);

  return { isOnline, wasOffline };
}
