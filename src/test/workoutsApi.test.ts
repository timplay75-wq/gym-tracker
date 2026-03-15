import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/apiClient', () => ({
  apiFetch: vi.fn(),
  normalizeWorkout: vi.fn((w: unknown) => w),
}));

import { apiFetch, normalizeWorkout } from '@/services/apiClient';
import { workoutsApi } from '../services/workoutsApi';

const mockFetch = apiFetch as ReturnType<typeof vi.fn>;
const mockNormalize = normalizeWorkout as ReturnType<typeof vi.fn>;

describe('workoutsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNormalize.mockImplementation((w: unknown) => w);
  });

  it('getAll fetches workouts and normalizes them', async () => {
    const raw = { workouts: [{ _id: '1' }], total: 1, page: 1, totalPages: 1 };
    mockFetch.mockResolvedValue(raw);
    mockNormalize.mockReturnValue({ id: '1' });
    const result = await workoutsApi.getAll();
    expect(mockFetch).toHaveBeenCalled();
    expect(result.workouts).toHaveLength(1);
    expect(result.workouts[0]).toEqual({ id: '1' });
  });

  it('getAll passes query params', async () => {
    mockFetch.mockResolvedValue({ workouts: [], total: 0, page: 1, totalPages: 0 });
    await workoutsApi.getAll({ status: 'completed', page: 2, limit: 10 });
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('status=completed'));
  });

  it('getToday returns null when no workout', async () => {
    mockFetch.mockResolvedValue(null);
    const result = await workoutsApi.getToday();
    expect(result).toBeNull();
  });

  it('getToday normalizes workout when exists', async () => {
    mockFetch.mockResolvedValue({ _id: '1', name: 'Today' });
    await workoutsApi.getToday();
    expect(mockNormalize).toHaveBeenCalled();
  });

  it('getById normalizes result', async () => {
    mockFetch.mockResolvedValue({ _id: '1' });
    await workoutsApi.getById('1');
    expect(mockFetch).toHaveBeenCalledWith('/workouts/1');
    expect(mockNormalize).toHaveBeenCalled();
  });

  it('create sends POST and normalizes', async () => {
    mockFetch.mockResolvedValue({ _id: 'new' });
    await workoutsApi.create({ name: 'Test' });
    expect(mockFetch).toHaveBeenCalledWith('/workouts', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }),
    });
  });

  it('update sends PUT and normalizes', async () => {
    mockFetch.mockResolvedValue({ _id: '1' });
    await workoutsApi.update('1', { name: 'Updated' });
    expect(mockFetch).toHaveBeenCalledWith('/workouts/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated' }),
    });
  });

  it('delete sends DELETE', async () => {
    mockFetch.mockResolvedValue(undefined);
    await workoutsApi.delete('1');
    expect(mockFetch).toHaveBeenCalledWith('/workouts/1', { method: 'DELETE' });
  });

  it('start sends POST to /start', async () => {
    mockFetch.mockResolvedValue({});
    await workoutsApi.start('1');
    expect(mockFetch).toHaveBeenCalledWith('/workouts/1/start', { method: 'POST' });
  });

  it('complete sends POST with duration/exercises and normalizes', async () => {
    mockFetch.mockResolvedValue({ _id: '1' });
    await workoutsApi.complete('1', { duration: 60 });
    expect(mockFetch).toHaveBeenCalledWith('/workouts/1/complete', {
      method: 'POST',
      body: JSON.stringify({ duration: 60 }),
    });
  });

  it('getStats fetches stats', async () => {
    mockFetch.mockResolvedValue({ totalWorkouts: 5 });
    const result = await workoutsApi.getStats();
    expect(mockFetch).toHaveBeenCalledWith('/workouts/stats');
    expect(result.totalWorkouts).toBe(5);
  });

  it('getCalendar fetches with year and month params', async () => {
    mockFetch.mockResolvedValue([]);
    await workoutsApi.getCalendar(2024, 6);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('year=2024'));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('month=6'));
  });

  it('getCalendar works without params', async () => {
    mockFetch.mockResolvedValue([]);
    await workoutsApi.getCalendar();
    expect(mockFetch).toHaveBeenCalledWith('/workouts/calendar');
  });
});
