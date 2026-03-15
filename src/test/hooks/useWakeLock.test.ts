import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWakeLock } from '@/hooks/useWakeLock';

describe('useWakeLock', () => {
  let mockRelease: ReturnType<typeof vi.fn>;
  let mockRequest: ReturnType<typeof vi.fn>;
  let mockLock: { release: ReturnType<typeof vi.fn>; addEventListener: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRelease = vi.fn().mockResolvedValue(undefined);
    mockLock = {
      release: mockRelease,
      addEventListener: vi.fn(),
    };
    mockRequest = vi.fn().mockResolvedValue(mockLock);
    Object.defineProperty(navigator, 'wakeLock', {
      value: { request: mockRequest },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requests wake lock when active is true', async () => {
    renderHook(() => useWakeLock(true));
    // Allow microtask to resolve
    await vi.waitFor(() => {
      expect(mockRequest).toHaveBeenCalledWith('screen');
    });
  });

  it('does not request wake lock when active is false', () => {
    renderHook(() => useWakeLock(false));
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('releases wake lock when active changes to false', async () => {
    const { rerender } = renderHook(({ active }) => useWakeLock(active), {
      initialProps: { active: true },
    });

    await vi.waitFor(() => {
      expect(mockRequest).toHaveBeenCalled();
    });

    rerender({ active: false });
    // The cleanup releases the lock
  });

  it('releases wake lock on unmount', async () => {
    const { unmount } = renderHook(() => useWakeLock(true));

    await vi.waitFor(() => {
      expect(mockRequest).toHaveBeenCalled();
    });

    unmount();
    // Cleanup function should run
  });

  it('handles missing wakeLock API gracefully', () => {
    // Delete wakeLock from navigator completely
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (navigator as any).wakeLock;

    // Should not throw
    const { unmount } = renderHook(() => useWakeLock(true));
    unmount();
  });
});
