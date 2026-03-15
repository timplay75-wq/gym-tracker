import { useEffect, useState } from 'react';
import { useToastContext, type ToastItem, type ToastVariant } from '@/contexts/ToastContext';

const BG: Record<ToastVariant, string> = {
  success: 'bg-[#22c55e]',
  error:   'bg-[#ef4444]',
  warning: 'bg-[#f59e0b]',
  info:    'bg-[#9333ea]',
};

const ICON: Record<ToastVariant, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
};

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(enterTimer);
  }, []);

  return (
    <div
      role="alert"
      onClick={onDismiss}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-white cursor-pointer
        transition-all duration-300 max-w-[340px] w-full
        ${BG[toast.variant]}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <span className="text-lg font-bold leading-none flex-shrink-0">{ICON[toast.variant]}</span>
      <span className="text-sm font-medium leading-snug flex-1">{toast.message}</span>
      <span className="opacity-60 text-xs flex-shrink-0">✕</span>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none"
    >
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto w-full">
          <ToastCard toast={toast} onDismiss={() => dismissToast(toast.id)} />
        </div>
      ))}
    </div>
  );
}
