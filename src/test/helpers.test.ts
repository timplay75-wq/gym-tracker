import { describe, it, expect } from 'vitest';
import { formatDate, formatDuration, calculateTonnage } from '../utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = formatDate(date);
      
      expect(formatted).toMatch(/15/); // Day should be present
      expect(formatted).toMatch(/янв|января/i); // Month in Russian
      expect(formatted).toMatch(/2024/); // Year should be present
    });

    it('handles string input', () => {
      const formatted = formatDate('2024-01-15');
      expect(formatted).toBeTruthy();
    });
  });

  describe('formatDuration', () => {
    it('formats seconds correctly', () => {
      expect(formatDuration(30)).toBe('0:30');
      expect(formatDuration(45)).toBe('0:45');
    });

    it('formats minutes correctly', () => {
      expect(formatDuration(60)).toBe('1:00');
      expect(formatDuration(90)).toBe('1:30');
      expect(formatDuration(120)).toBe('2:00');
    });

    it('formats hours correctly', () => {
      expect(formatDuration(3600)).toBe('1:00:00');
      expect(formatDuration(3665)).toBe('1:01:05');
      expect(formatDuration(7200)).toBe('2:00:00');
    });

    it('handles zero', () => {
      expect(formatDuration(0)).toBe('0:00');
    });

    it('pads single digits with zero', () => {
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(3605)).toBe('1:00:05');
    });
  });

  describe('calculateTonnage', () => {
    it('calculates tonnage for single set', () => {
      const sets = [{ weight: 100, reps: 10, completed: true }];
      expect(calculateTonnage(sets)).toBe(1000);
    });

    it('calculates tonnage for multiple sets', () => {
      const sets = [
        { weight: 100, reps: 10, completed: true },
        { weight: 80, reps: 12, completed: true },
        { weight: 60, reps: 15, completed: true },
      ];
      expect(calculateTonnage(sets)).toBe(2860);
    });

    it('ignores incomplete sets', () => {
      const sets = [
        { weight: 100, reps: 10, completed: true },
        { weight: 80, reps: 12, completed: false },
      ];
      expect(calculateTonnage(sets)).toBe(1000);
    });

    it('handles empty array', () => {
      expect(calculateTonnage([])).toBe(0);
    });

    it('handles sets with zero weight', () => {
      const sets = [
        { weight: 0, reps: 10, completed: true },
        { weight: 50, reps: 10, completed: true },
      ];
      expect(calculateTonnage(sets)).toBe(500);
    });

    it('handles decimal weights', () => {
      const sets = [
        { weight: 52.5, reps: 10, completed: true },
      ];
      expect(calculateTonnage(sets)).toBe(525);
    });
  });
});
