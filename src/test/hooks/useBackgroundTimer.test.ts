import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBackgroundTimer } from '@/hooks/useBackgroundTimer';

describe('useBackgroundTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with 0 seconds and not running', () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() => useBackgroundTimer(30, onEnd));
    expect(result.current.seconds).toBe(0);
    expect(result.current.running).toBe(false);
  });

  it('starts countdown when start() is called', () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() => useBackgroundTimer(10, onEnd));

    act(() => {
      result.current.start();
    });

    expect(result.current.running).toBe(true);
    expect(result.current.seconds).toBe(10);
  });

  it('starts countdown with custom seconds', () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() => useBackgroundTimer(10, onEnd));

    act(() => {
      result.current.start(5);
    });

    expect(result.current.seconds).toBe(5);
  });

  it('counts down and calls onEnd at zero', () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() => useBackgroundTimer(2, onEnd));

    act(() => {
      result.current.start();
    });

    // Advance time past the 2 seconds
    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(onEnd).toHaveBeenCalled();
    expect(result.current.running).toBe(false);
  });

  it('stop() cancels the timer', () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() => useBackgroundTimer(10, onEnd));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.stop();
    });

    expect(result.current.running).toBe(false);
    expect(result.current.seconds).toBe(0);
  });

  it('addSeconds increases remaining time', () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() => useBackgroundTimer(10, onEnd));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.addSeconds(5);
    });

    expect(result.current.seconds).toBe(15);
  });

  it('handles visibilitychange when running', () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() => useBackgroundTimer(10, onEnd));

    act(() => {
      result.current.start();
    });

    // Simulate visibility change
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current.running).toBe(true);
  });

  it('handles visibilitychange when timer expired during hidden', () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() => useBackgroundTimer(1, onEnd));

    act(() => {
      result.current.start();
    });

    // Advance past the end
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Simulate returning to page
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(onEnd).toHaveBeenCalled();
  });

  it('cleans up timeout on unmount', () => {
    const onEnd = vi.fn();
    const { result, unmount } = renderHook(() => useBackgroundTimer(10, onEnd));

    act(() => {
      result.current.start();
    });

    unmount();
    // Should not throw
    act(() => {
      vi.advanceTimersByTime(11000);
    });
    expect(onEnd).not.toHaveBeenCalled();
  });
});
