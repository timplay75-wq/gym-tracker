import { describe, it, expect } from 'vitest';
import { playBeep } from '@/utils/playBeep';

describe('playBeep', () => {
  it('does not throw with default params', () => {
    expect(() => playBeep()).not.toThrow();
  });

  it('does not throw with custom params', () => {
    expect(() => playBeep(440, 100)).not.toThrow();
  });

  it('does not throw with zero duration', () => {
    expect(() => playBeep(880, 0)).not.toThrow();
  });
});
