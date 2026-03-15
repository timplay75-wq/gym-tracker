import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { hapticLight, hapticMedium, hapticSuccess } from '@/utils/haptics';

describe('haptics', () => {
  let vibrateMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vibrateMock = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: vibrateMock,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('hapticLight vibrates for 10ms', () => {
    hapticLight();
    expect(vibrateMock).toHaveBeenCalledWith(10);
  });

  it('hapticMedium vibrates for 30ms', () => {
    hapticMedium();
    expect(vibrateMock).toHaveBeenCalledWith(30);
  });

  it('hapticSuccess vibrates with pattern', () => {
    hapticSuccess();
    expect(vibrateMock).toHaveBeenCalledWith([10, 20, 10]);
  });

  it('does nothing when vibrate is not available', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (navigator as any).vibrate;

    // Should not throw
    expect(() => hapticLight()).not.toThrow();
    expect(() => hapticMedium()).not.toThrow();
    expect(() => hapticSuccess()).not.toThrow();
  });
});
