import { useMemo } from 'react';
import { useToastContext } from '@/contexts/ToastContext';

export function useToast() {
  const { showToast, dismissToast } = useToastContext();
  // Без мемоизации хук возвращал новый объект на каждый рендер, и любой
  // useEffect с toast в зависимостях уходил в бесконечный цикл.
  // showToast и dismissToast стабильны (useCallback в ToastProvider).
  return useMemo(() => ({
    success: (msg: string, duration?: number) => showToast(msg, 'success', duration),
    error:   (msg: string, duration?: number) => showToast(msg, 'error', duration),
    warning: (msg: string, duration?: number) => showToast(msg, 'warning', duration),
    info:    (msg: string, duration?: number) => showToast(msg, 'info', duration),
    dismiss: dismissToast,
  }), [showToast, dismissToast]);
}
