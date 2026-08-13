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
  // Держим свежий onEnd, не перезапуская таймер при смене колбэка.
  // Присваивание вынесено в эффект: во время рендера ref менять нельзя.
  const onEndRef = useRef(onEnd);
  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);

  // setInterval, а не цепочка setTimeout(tick): та ссылалась на tick изнутри
  // самого tick. Точности это не меняет — остаток каждый раз считается
  // от endTimeRef, а не накапливается.
  const tick = useCallback(() => {
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    setSeconds(remaining);
    if (remaining <= 0) {
      window.clearInterval(rafRef.current);
      setRunning(false);
      onEndRef.current();
    }
  }, []);

  const start = useCallback((secs?: number) => {
    const duration = (secs ?? initialSeconds) * 1000;
    endTimeRef.current = Date.now() + duration;
    setSeconds(secs ?? initialSeconds);
    setRunning(true);
    window.clearInterval(rafRef.current);
    rafRef.current = window.setInterval(tick, 250);
  }, [initialSeconds, tick]);

  const stop = useCallback(() => {
    window.clearInterval(rafRef.current);
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
        window.clearInterval(rafRef.current);
        setRunning(false);
        onEndRef.current();
      }
    };
    document.addEventListener('visibilitychange', handleVisible);
    return () => document.removeEventListener('visibilitychange', handleVisible);
  }, [running]);

  useEffect(() => () => window.clearInterval(rafRef.current), []);

  return { seconds, running, start, stop, addSeconds };
}
