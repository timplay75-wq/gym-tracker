import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/apiClient', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '@/services/apiClient';
import { statsApi } from '../services/statsApi';

const mockFetch = apiFetch as ReturnType<typeof vi.fn>;

describe('statsApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getSummary fetches /stats/summary', async () => {
    mockFetch.mockResolvedValue({ totalWorkouts: 10 });
    const result = await statsApi.getSummary();
    expect(mockFetch).toHaveBeenCalledWith('/stats/summary');
    expect(result.totalWorkouts).toBe(10);
  });

  it('getWeekly fetches /stats/weekly', async () => {
    mockFetch.mockResolvedValue([]);
    await statsApi.getWeekly();
    expect(mockFetch).toHaveBeenCalledWith('/stats/weekly');
  });

  it('getTopExercises fetches /stats/exercises', async () => {
    mockFetch.mockResolvedValue([]);
    await statsApi.getTopExercises();
    expect(mockFetch).toHaveBeenCalledWith('/stats/exercises');
  });

  it('getMuscleDistribution fetches without period', async () => {
    mockFetch.mockResolvedValue([]);
    await statsApi.getMuscleDistribution();
    expect(mockFetch).toHaveBeenCalledWith('/stats/muscles');
  });

  it('getMuscleDistribution passes period param', async () => {
    mockFetch.mockResolvedValue([]);
    await statsApi.getMuscleDistribution('month');
    expect(mockFetch).toHaveBeenCalledWith('/stats/muscles?period=month');
  });

  it('getExerciseHistory fetches by name', async () => {
    mockFetch.mockResolvedValue({ exerciseName: 'Bench Press', history: [] });
    await statsApi.getExerciseHistory('Bench Press');
    expect(mockFetch).toHaveBeenCalledWith(`/stats/exercise/${encodeURIComponent('Bench Press')}`);
  });

  it('getWeekdayFrequency fetches /stats/weekdays', async () => {
    mockFetch.mockResolvedValue([0, 1, 2, 3, 4, 5, 6]);
    await statsApi.getWeekdayFrequency();
    expect(mockFetch).toHaveBeenCalledWith('/stats/weekdays');
  });
});
