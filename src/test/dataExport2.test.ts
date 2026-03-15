import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateImportFile, importData, exportAllJSON, exportWorkoutsCSV } from '../services/dataExport';
import type { ExportData } from '../services/dataExport';

vi.mock('@/services/api', () => ({
  workoutsApi: {
    getAll: vi.fn(),
    create: vi.fn(),
  },
  exercisesApi: {
    getAll: vi.fn(),
    create: vi.fn(),
  },
  programsApi: {
    getAll: vi.fn(),
    create: vi.fn(),
  },
}));

import { workoutsApi, exercisesApi, programsApi } from '@/services/api';

describe('dataExport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateImportFile', () => {
    it('validates correct export data', () => {
      const data = JSON.stringify({
        version: '1.0',
        exportedAt: '2024-01-01',
        workouts: [{ name: 'w1' }],
        exercises: [{ name: 'e1' }],
        programs: [{ name: 'p1' }],
      });
      const result = validateImportFile(data);
      expect(result.valid).toBe(true);
      expect(result.preview).toEqual({ workouts: 1, exercises: 1, programs: 1 });
    });

    it('rejects invalid JSON', () => {
      const result = validateImportFile('not json {{{');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid JSON file');
    });

    it('rejects missing version', () => {
      const result = validateImportFile(JSON.stringify({ exportedAt: '2024', workouts: [] }));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('missing version');
    });

    it('rejects missing exportedAt', () => {
      const result = validateImportFile(JSON.stringify({ version: '1.0', workouts: [] }));
      expect(result.valid).toBe(false);
    });

    it('rejects non-array workouts', () => {
      const result = validateImportFile(JSON.stringify({ version: '1.0', exportedAt: '2024', workouts: 'not array' }));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('workouts must be an array');
    });

    it('handles missing exercises/programs arrays in preview', () => {
      const result = validateImportFile(JSON.stringify({
        version: '1.0',
        exportedAt: '2024',
        workouts: [],
      }));
      expect(result.valid).toBe(true);
      expect(result.preview?.exercises).toBe(0);
      expect(result.preview?.programs).toBe(0);
    });
  });

  describe('importData', () => {
    it('imports workouts by creating them one by one', async () => {
      (workoutsApi.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
      const data: ExportData = {
        version: '1.0',
        exportedAt: '2024-01-01',
        workouts: [{ _id: 'old1', name: 'W1', exercises: [] }],
        exercises: [],
        programs: [],
      };

      const result = await importData(data, 'merge');
      expect(result.workouts).toBe(1);
      expect(workoutsApi.create).toHaveBeenCalled();
    });

    it('imports exercises', async () => {
      (exercisesApi.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
      const data: ExportData = {
        version: '1.0',
        exportedAt: '2024-01-01',
        workouts: [],
        exercises: [{ _id: 'e1', name: 'Bench' }],
        programs: [],
      };

      const result = await importData(data, 'merge');
      expect(result.exercises).toBe(1);
    });

    it('imports programs', async () => {
      (programsApi.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
      const data: ExportData = {
        version: '1.0',
        exportedAt: '2024-01-01',
        workouts: [],
        exercises: [],
        programs: [{ _id: 'p1', name: 'PPL' }],
      };

      const result = await importData(data, 'merge');
      expect(result.programs).toBe(1);
    });

    it('skips failed items silently', async () => {
      (workoutsApi.create as ReturnType<typeof vi.fn>)
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce({});

      const data: ExportData = {
        version: '1.0',
        exportedAt: '2024-01-01',
        workouts: [{ name: 'W1' }, { name: 'W2' }],
        exercises: [],
        programs: [],
      };

      const result = await importData(data, 'merge');
      expect(result.workouts).toBe(1); // Only second succeeded
    });

    it('strips _id, id, userId from workouts and their exercises/sets', async () => {
      (workoutsApi.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
      const data: ExportData = {
        version: '1.0',
        exportedAt: '2024',
        workouts: [{
          _id: 'old', id: '123', userId: 'u1', createdAt: 'c', updatedAt: 'u', __v: 0,
          name: 'W1',
          exercises: [{
            _id: 'ex1', id: 'e1', personalRecords: {},
            name: 'Bench',
            sets: [{ _id: 's1', id: 'sid', reps: 10, weight: 80 }],
          }],
        }],
        exercises: [],
        programs: [],
      };

      await importData(data, 'merge');
      const arg = (workoutsApi.create as ReturnType<typeof vi.fn>).mock.calls[0][0] as Record<string, unknown>;
      expect(arg._id).toBeUndefined();
      expect(arg.id).toBeUndefined();
      expect(arg.userId).toBeUndefined();
    });

    it('handles empty data', async () => {
      const data: ExportData = {
        version: '1.0',
        exportedAt: '2024',
        workouts: [],
        exercises: [],
        programs: [],
      };
      const result = await importData(data, 'merge');
      expect(result).toEqual({ workouts: 0, exercises: 0, programs: 0 });
    });
  });

  describe('exportAllJSON', () => {
    it('fetches all data and triggers download', async () => {
      (workoutsApi.getAll as ReturnType<typeof vi.fn>).mockResolvedValue({ workouts: [] });
      (exercisesApi.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);
      (programsApi.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      const createObjectURL = vi.fn().mockReturnValue('blob:url');
      const revokeObjectURL = vi.fn();
      global.URL.createObjectURL = createObjectURL;
      global.URL.revokeObjectURL = revokeObjectURL;

      const mockClick = vi.fn();
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      vi.spyOn(document, 'createElement').mockReturnValue({
        href: '',
        download: '',
        click: mockClick,
      } as unknown as HTMLElement);
      vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
      vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);

      await exportAllJSON();
      expect(workoutsApi.getAll).toHaveBeenCalledWith({ limit: 9999 });
      expect(exercisesApi.getAll).toHaveBeenCalled();
      expect(programsApi.getAll).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('exportWorkoutsCSV', () => {
    it('fetches workouts and creates CSV download', async () => {
      (workoutsApi.getAll as ReturnType<typeof vi.fn>).mockResolvedValue({
        workouts: [{
          date: '2024-01-15',
          name: 'Chest Day',
          status: 'completed',
          duration: 60,
          totalVolume: 5000,
          totalSets: 15,
          totalReps: 100,
          exercises: [
            { name: 'Bench Press', sets: [{ reps: 10, weight: 80 }] },
          ],
        }],
      });

      const createObjectURL = vi.fn().mockReturnValue('blob:url');
      const revokeObjectURL = vi.fn();
      global.URL.createObjectURL = createObjectURL;
      global.URL.revokeObjectURL = revokeObjectURL;

      const mockClick = vi.fn();
      vi.spyOn(document, 'createElement').mockReturnValue({
        href: '',
        download: '',
        click: mockClick,
      } as unknown as HTMLElement);
      vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn());
      vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn());

      await exportWorkoutsCSV();
      expect(workoutsApi.getAll).toHaveBeenCalledWith({ limit: 9999 });
      expect(mockClick).toHaveBeenCalled();
    });
  });
});
