import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider } from '../contexts/ToastContext';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';

// Helper: render with toast infrastructure
function ToastTestHarness({ action }: { action: () => void }) {
  const toast = useToast();
  return (
    <button onClick={() => { action(); toast.success('Тест успешен'); }}>
      trigger
    </button>
  );
}

function renderWithToast(ui: React.ReactNode) {
  return render(
    <ToastProvider>
      {ui}
      <ToastContainer />
    </ToastProvider>
  );
}

// Simple trigger component
function Trigger({ variant, msg }: { variant: 'success' | 'error' | 'warning' | 'info'; msg: string }) {
  const toast = useToast();
  const fn = toast[variant] as (msg: string) => void;
  return <button onClick={() => fn(msg)}>trigger</button>;
}

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders nothing when no toasts', () => {
    const { container } = renderWithToast(<div />);
    expect(container.querySelector('[aria-live]')).toBeNull();
  });

  it('shows a success toast', () => {
    renderWithToast(<Trigger variant="success" msg="Сохранено" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Сохранено')).toBeInTheDocument();
  });

  it('shows an error toast', () => {
    renderWithToast(<Trigger variant="error" msg="Ошибка" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Ошибка')).toBeInTheDocument();
  });

  it('shows a warning toast', () => {
    renderWithToast(<Trigger variant="warning" msg="Внимание" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Внимание')).toBeInTheDocument();
  });

  it('shows an info toast', () => {
    renderWithToast(<Trigger variant="info" msg="Инфо" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Инфо')).toBeInTheDocument();
  });

  it('auto-dismisses toast after duration', async () => {
    renderWithToast(<Trigger variant="success" msg="Исчезну" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Исчезну')).toBeInTheDocument();

    await act(() => {
      vi.advanceTimersByTime(3100);
    });
    expect(screen.queryByText('Исчезну')).toBeNull();
  });

  it('dismisses toast on click', () => {
    renderWithToast(<Trigger variant="info" msg="Кликни меня" />);
    fireEvent.click(screen.getByRole('button'));
    const toast = screen.getByRole('alert');
    fireEvent.click(toast);
    expect(screen.queryByText('Кликни меня')).toBeNull();
  });

  it('limits to max 3 toasts', () => {
    function MultiTrigger() {
      const toast = useToast();
      return (
        <button onClick={() => {
          toast.info('Toast 1');
          toast.info('Toast 2');
          toast.info('Toast 3');
          toast.info('Toast 4');
        }}>
          trigger
        </button>
      );
    }
    renderWithToast(<MultiTrigger />);
    fireEvent.click(screen.getByRole('button'));
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeLessThanOrEqual(3);
  });

  it('each variant renders with correct icon', () => {
    const variants = [
      { variant: 'success' as const, icon: '✓' },
      { variant: 'warning' as const, icon: '⚠' },
      { variant: 'info' as const, icon: 'ℹ' },
    ];
    for (const { variant, icon } of variants) {
      const { unmount } = renderWithToast(<Trigger variant={variant} msg={`test-${variant}`} />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText(icon)).toBeInTheDocument();
      unmount();
    }
  });

  it('error variant renders error icon', () => {
    renderWithToast(<Trigger variant="error" msg="err-test" />);
    fireEvent.click(screen.getByRole('button'));
    // ✕ appears twice (icon + close button) — use getAllByText
    const crosses = screen.getAllByText('✕');
    expect(crosses.length).toBeGreaterThanOrEqual(2);
  });

  it('useToast throws outside provider', () => {
    function Bad() {
      const toast = useToast();
      return <span>{toast ? 'ok' : 'no'}</span>;
    }
    expect(() => render(<Bad />)).toThrow();
  });
});
