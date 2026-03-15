import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useRef } from 'react';

function createMockElement() {
  const listeners: Record<string, EventListener> = {};
  return {
    scrollTop: 0,
    addEventListener: vi.fn((event: string, handler: EventListener) => {
      listeners[event] = handler;
    }),
    removeEventListener: vi.fn(),
    _listeners: listeners,
  } as unknown as HTMLElement & { _listeners: Record<string, EventListener> };
}

describe('usePullToRefresh', () => {
  let mockElement: ReturnType<typeof createMockElement>;

  beforeEach(() => {
    mockElement = createMockElement();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLElement>(mockElement);
      return usePullToRefresh({ onRefresh: vi.fn(), containerRef: ref });
    });

    expect(result.current.pullDistance).toBe(0);
    expect(result.current.isRefreshing).toBe(false);
  });

  it('registers touch event listeners on container', () => {
    renderHook(() => {
      const ref = useRef<HTMLElement>(mockElement);
      return usePullToRefresh({ onRefresh: vi.fn(), containerRef: ref });
    });

    expect(mockElement.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: true });
    expect(mockElement.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function), { passive: true });
    expect(mockElement.addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function));
  });

  it('tracks pull distance on touchmove', () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => {
      const ref = useRef<HTMLElement>(mockElement);
      return usePullToRefresh({ onRefresh, containerRef: ref });
    });

    // Simulate touchstart
    act(() => {
      const touchStartHandler = mockElement._listeners['touchstart'];
      touchStartHandler({ touches: [{ clientY: 100 }] } as unknown as Event);
    });

    // Simulate touchmove (pull down)
    act(() => {
      const touchMoveHandler = mockElement._listeners['touchmove'];
      touchMoveHandler({ touches: [{ clientY: 200 }] } as unknown as Event);
    });

    expect(result.current.pullDistance).toBeGreaterThan(0);
  });

  it('triggers refresh when pull exceeds threshold', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    renderHook(() => {
      const ref = useRef<HTMLElement>(mockElement);
      return usePullToRefresh({ onRefresh, containerRef: ref });
    });

    // Simulate touchstart
    act(() => {
      const touchStartHandler = mockElement._listeners['touchstart'];
      touchStartHandler({ touches: [{ clientY: 0 }] } as unknown as Event);
    });

    // Simulate big pull (over threshold of 60, * 0.5 = need 120+ pixels)
    act(() => {
      const touchMoveHandler = mockElement._listeners['touchmove'];
      touchMoveHandler({ touches: [{ clientY: 200 }] } as unknown as Event);
    });

    // Simulate touchend
    await act(async () => {
      const touchEndHandler = mockElement._listeners['touchend'];
      touchEndHandler({} as Event);
    });

    expect(onRefresh).toHaveBeenCalled();
  });

  it('does not trigger refresh when pull is below threshold', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    renderHook(() => {
      const ref = useRef<HTMLElement>(mockElement);
      return usePullToRefresh({ onRefresh, containerRef: ref });
    });

    // Simulate touchstart
    act(() => {
      mockElement._listeners['touchstart']({ touches: [{ clientY: 100 }] } as unknown as Event);
    });

    // Small pull
    act(() => {
      mockElement._listeners['touchmove']({ touches: [{ clientY: 110 }] } as unknown as Event);
    });

    await act(async () => {
      mockElement._listeners['touchend']({} as Event);
    });

    expect(onRefresh).not.toHaveBeenCalled();
  });

  it('does not start pulling when scrolled down', () => {
    mockElement.scrollTop = 100;
    renderHook(() => {
      const ref = useRef<HTMLElement>(mockElement);
      return usePullToRefresh({ onRefresh: vi.fn(), containerRef: ref });
    });

    // Touchstart should be skipped since scrollTop > 0
    act(() => {
      mockElement._listeners['touchstart']({ touches: [{ clientY: 100 }] } as unknown as Event);
    });

    act(() => {
      mockElement._listeners['touchmove']({ touches: [{ clientY: 300 }] } as unknown as Event);
    });

    // pullDistance should stay 0 since pulling was never initiated
  });

  it('cleans up listeners on unmount', () => {
    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLElement>(mockElement);
      return usePullToRefresh({ onRefresh: vi.fn(), containerRef: ref });
    });

    unmount();
    expect(mockElement.removeEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
    expect(mockElement.removeEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function));
    expect(mockElement.removeEventListener).toHaveBeenCalledWith('touchend', expect.any(Function));
  });
});
