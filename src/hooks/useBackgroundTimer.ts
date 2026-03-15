import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Таймер отсчёта вниз (countdown), который корректно работает
 * при сворачивании приложения / переключении вкладки.
 *
 * Вместо слепого `setInterval(-1)` запоминает startTime и при каждом тике
 * вычисляет реальное прошедшее время через Date.now().
 */
export function useBackgroundTimer(
  initialSeconds: number,
  onEnd: () => void,
) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  const endTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  const tick = useCallback(() => {
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    setSeconds(remaining);
    if (remaining <= 0) {
      setRunning(false);
      onEndRef.current();
      return;
    }
    rafRef.current = window.setTimeout(tick, 250);
  }, []);

  const start = useCallback((secs?: number) => {
    const duration = (secs ?? initialSeconds) * 1000;
    endTimeRef.current = Date.now() + duration;
    setSeconds(secs ?? initialSeconds);
    setRunning(true);
    window.clearTimeout(rafRef.current);
    rafRef.current = window.setTimeout(tick, 250);
  }, [initialSeconds, tick]);

  const stop = useCallback(() => {
    window.clearTimeout(rafRef.current);
    setRunning(false);
    setSeconds(0);
  }, []);

  const addSeconds = useCallback((extra: number) => {
    endTimeRef.current += extra * 1000;
    setSeconds(prev => prev + extra);
  }, []);

  // Обработка visibilitychange — пересчитываем при возврате на страницу
  useEffect(() => {
    const handleVisible = () => {
      if (!running) return;
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining <= 0) {
        setRunning(false);
        onEndRef.current();
      }
    };
    document.addEventListener('visibilitychange', handleVisible);
    return () => document.removeEventListener('visibilitychange', handleVisible);
  }, [running]);

  useEffect(() => () => window.clearTimeout(rafRef.current), []);

  return { seconds, running, start, stop, addSeconds };
}
