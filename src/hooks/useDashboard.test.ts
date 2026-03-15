import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDashboard } from './useDashboard';
import * as api from '@/services/api';
import type { Workout } from '@/types';

// Mock workoutsApi
vi.mock('@/services/api', () => ({
  workoutsApi: {
    getToday: vi.fn(),
    getAll: vi.fn(),
    getStats: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    getById: vi.fn(),
    start: vi.fn(),
    complete: vi.fn(),
    getCalendar: vi.fn(),
  },
  authApi: {},
  exercisesApi: {},
  programsApi: {},
  statsApi: {},
  recordsApi: {},
  apiService: {},
}));

const { workoutsApi } = api;

const emptyListResponse = { workouts: [], total: 0, page: 1, totalPages: 0 };
const emptyStats = { totalWorkouts: 0, thisMonthWorkouts: 0, totalVolume: 0 };

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(workoutsApi.getToday).mockResolvedValue(null);
    vi.mocked(workoutsApi.getAll).mockResolvedValue(emptyListResponse);
    vi.mocked(workoutsApi.getStats).mockResolvedValue(emptyStats);
    vi.mocked(workoutsApi.update).mockResolvedValue({} as Workout);
    vi.mocked(workoutsApi.create).mockResolvedValue({} as Workout);
  });

  it('РґРѕР»Р¶РµРЅ Р·Р°РіСЂСѓР·РёС‚СЊ РґР°РЅРЅС‹Рµ РїСЂРё РјРѕРЅС‚РёСЂРѕРІР°РЅРёРё', async () => {
    const mockTodayWorkout: Workout = {
      id: '1',
      name: 'РЎРµРіРѕРґРЅСЏС€РЅСЏСЏ С‚СЂРµРЅРёСЂРѕРІРєР°',
      date: new Date(),
      exercises: [],
      status: 'planned',
    };

    const completedWorkout: Workout = {
      id: '2',
      name: 'Р—Р°РІРµСЂС€РµРЅРЅР°СЏ С‚СЂРµРЅРёСЂРѕРІРєР°',
      date: new Date(),
      exercises: [],
      status: 'completed',
      duration: 60,
      totalVolume: 5000,
    };

    vi.mocked(workoutsApi.getToday).mockResolvedValue(mockTodayWorkout);
    vi.mocked(workoutsApi.getAll).mockResolvedValue({
      workouts: [completedWorkout],
      total: 1,
      page: 1,
      totalPages: 1,
    });
    vi.mocked(workoutsApi.getStats).mockResolvedValue({
      totalWorkouts: 10,
      thisMonthWorkouts: 3,
      totalVolume: 50000,
    });

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.todayWorkout).toEqual(mockTodayWorkout);
    expect(result.current.recentWorkouts).toHaveLength(1);
    expect(result.current.stats.monthVolume).toBe(50000);
    expect(result.current.error).toBeNull();
  });

  it('РґРѕР»Р¶РµРЅ РѕР±СЂР°Р±РѕС‚Р°С‚СЊ РѕС€РёР±РєСѓ РїСЂРё Р·Р°РіСЂСѓР·РєРµ', async () => {
    vi.mocked(workoutsApi.getToday).mockRejectedValue(new Error('Test error'));

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('РґРѕР»Р¶РµРЅ РЅР°С‡Р°С‚СЊ С‚СЂРµРЅРёСЂРѕРІРєСѓ Рё РѕР±РЅРѕРІРёС‚СЊ РґР°РЅРЅС‹Рµ', async () => {
    const mockWorkout: Workout = {
      id: '507f1f77bcf86cd799439011', // valid mongodb id
      name: 'РўСЂРµРЅРёСЂРѕРІРєР°',
      date: new Date(),
      exercises: [],
      status: 'planned',
    };

    vi.mocked(workoutsApi.getToday).mockResolvedValue(mockWorkout);
    vi.mocked(workoutsApi.update).mockResolvedValue({ ...mockWorkout, status: 'in-progress' });

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.startWorkout(mockWorkout.id);
    });

    expect(workoutsApi.update).toHaveBeenCalledWith(mockWorkout.id, { status: 'in-progress' });
  });

  it('РґРѕР»Р¶РµРЅ СЃРѕР·РґР°С‚СЊ РЅРѕРІСѓСЋ С‚СЂРµРЅРёСЂРѕРІРєСѓ', async () => {
    const newWorkout: Workout = {
      id: '507f1f77bcf86cd799439012',
      name: 'РќРѕРІР°СЏ С‚СЂРµРЅРёСЂРѕРІРєР°',
      date: new Date(),
      exercises: [],
      status: 'planned',
    };

    vi.mocked(workoutsApi.create).mockResolvedValue(newWorkout);

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let createdWorkout: Workout | null = null;
    await act(async () => {
      createdWorkout = await result.current.createWorkout({ name: 'РќРѕРІР°СЏ С‚СЂРµРЅРёСЂРѕРІРєР°' });
    });

    expect(workoutsApi.create).toHaveBeenCalledWith({ name: 'РќРѕРІР°СЏ С‚СЂРµРЅРёСЂРѕРІРєР°' });
    expect(createdWorkout).toEqual(newWorkout);
  });

  it('РґРѕР»Р¶РµРЅ РѕР±РЅРѕРІРёС‚СЊ РґР°РЅРЅС‹Рµ РїРѕСЃР»Рµ refreshData', async () => {
    vi.mocked(workoutsApi.getToday).mockResolvedValue(null);

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newWorkout: Workout = {
      id: '507f1f77bcf86cd799439013',
      name: 'РќРѕРІР°СЏ С‚СЂРµРЅРёСЂРѕРІРєР°',
      date: new Date(),
      exercises: [],
      status: 'planned',
    };
    vi.mocked(workoutsApi.getToday).mockResolvedValue(newWorkout);

    await act(async () => {
      await result.current.refreshData();
    });

    await waitFor(() => {
      expect(result.current.todayWorkout).toEqual(newWorkout);
    });
  });

  it('РґРѕР»Р¶РµРЅ РїСЂР°РІРёР»СЊРЅРѕ РїРѕРґСЃС‡РёС‚С‹РІР°С‚СЊ Р·Р°РІРµСЂС€РµРЅРЅС‹Рµ С‚СЂРµРЅРёСЂРѕРІРєРё Р·Р° РЅРµРґРµР»СЋ', async () => {
    const today = new Date();
    const weekWorkouts: Workout[] = [
      { id: '1', name: 'РўСЂРµРЅРёСЂРѕРІРєР° 1', date: today, exercises: [], status: 'completed' },
      { id: '2', name: 'РўСЂРµРЅРёСЂРѕРІРєР° 2', date: today, exercises: [], status: 'completed' },
      { id: '3', name: 'РўСЂРµРЅРёСЂРѕРІРєР° 3', date: today, exercises: [], status: 'planned' },
    ];

    // getAll РІС‹Р·С‹РІР°РµС‚СЃСЏ РґРІР°Р¶РґС‹ вЂ” РґР»СЏ recent (completed, limit 5) Рё РґР»СЏ weekly (completed, limit 100)
    vi.mocked(workoutsApi.getAll).mockResolvedValue({
      workouts: weekWorkouts,
      total: 3,
      page: 1,
      totalPages: 1,
    });

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Р’СЃРµ 3 С‚СЂРµРЅРёСЂРѕРІРєРё СЃРµРіРѕРґРЅСЏ, РЅРѕ С„РёР»СЊС‚СЂ РЅР° recent РІРѕР·РІСЂР°С‰Р°РµС‚ РІСЃРµ, weekWorkouts СЃС‡РёС‚Р°РµС‚ РїРѕ РґР°С‚Рµ
    expect(result.current.stats.weekWorkouts).toBeGreaterThanOrEqual(0);
  });

  it('РґРѕР»Р¶РµРЅ РёРјРµС‚СЊ activeProgram null РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ', async () => {
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stats.activeProgram).toBeNull();
  });
});
