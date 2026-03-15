import { describe, it, expect } from 'vitest';
import { validateImportFile } from '../services/dataExport';

describe('dataExport', () => {
  describe('validateImportFile', () => {
    it('rejects invalid JSON', () => {
      const result = validateImportFile('not json at all');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid JSON file');
    });

    it('rejects JSON without version', () => {
      const result = validateImportFile(JSON.stringify({ workouts: [] }));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('missing version');
    });

    it('rejects JSON without workouts array', () => {
      const result = validateImportFile(JSON.stringify({ version: '1.0', exportedAt: '2024-01-01', workouts: 'not array' }));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('workouts must be an array');
    });

    it('accepts valid export data', () => {
      const data = {
        version: '1.0',
        exportedAt: '2024-01-15T10:00:00Z',
        workouts: [{ name: 'Test', date: '2024-01-15' }],
        exercises: [{ name: 'Bench Press' }],
        programs: [],
      };
      const result = validateImportFile(JSON.stringify(data));
      expect(result.valid).toBe(true);
      expect(result.preview).toEqual({
        workouts: 1,
        exercises: 1,
        programs: 0,
      });
      expect(result.data).toBeDefined();
    });

    it('handles empty arrays', () => {
      const data = {
        version: '1.0',
        exportedAt: '2024-01-15T10:00:00Z',
        workouts: [],
        exercises: [],
        programs: [],
      };
      const result = validateImportFile(JSON.stringify(data));
      expect(result.valid).toBe(true);
      expect(result.preview).toEqual({ workouts: 0, exercises: 0, programs: 0 });
    });

    it('rejects JSON without exportedAt', () => {
      const result = validateImportFile(JSON.stringify({ version: '1.0', workouts: [] }));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('missing version');
    });

    it('counts exercises and programs in preview', () => {
      const data = {
        version: '1.0',
        exportedAt: '2024-01-01T00:00:00Z',
        workouts: [{ name: 'A' }, { name: 'B' }],
        exercises: [{ name: 'E1' }, { name: 'E2' }, { name: 'E3' }],
        programs: [{ name: 'P1' }],
      };
      const result = validateImportFile(JSON.stringify(data));
      expect(result.valid).toBe(true);
      expect(result.preview).toEqual({ workouts: 2, exercises: 3, programs: 1 });
    });

    it('handles missing exercises and programs gracefully', () => {
      const data = {
        version: '1.0',
        exportedAt: '2024-01-01T00:00:00Z',
        workouts: [],
      };
      const result = validateImportFile(JSON.stringify(data));
      expect(result.valid).toBe(true);
      expect(result.preview!.exercises).toBe(0);
      expect(result.preview!.programs).toBe(0);
    });

    it('preserves original data object', () => {
      const data = {
        version: '1.0',
        exportedAt: '2024-01-01T00:00:00Z',
        workouts: [{ name: 'Leg Day', date: '2024-01-01', exercises: [] }],
        exercises: [],
        programs: [],
      };
      const result = validateImportFile(JSON.stringify(data));
      expect(result.data!.workouts[0]).toEqual({ name: 'Leg Day', date: '2024-01-01', exercises: [] });
    });
  });
});
