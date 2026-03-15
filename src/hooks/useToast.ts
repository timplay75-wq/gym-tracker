import { useToastContext } from '@/contexts/ToastContext';

export function useToast() {
  const { showToast, dismissToast } = useToastContext();
  return {
    success: (msg: string, duration?: number) => showToast(msg, 'success', duration),
    error:   (msg: string, duration?: number) => showToast(msg, 'error', duration),
    warning: (msg: string, duration?: number) => showToast(msg, 'warning', duration),
    info:    (msg: string, duration?: number) => showToast(msg, 'info', duration),
    dismiss: dismissToast,
  };
}
