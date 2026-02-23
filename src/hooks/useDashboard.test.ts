import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDashboard } from './useDashboard';
import * as workoutService from '@/services/workoutService';
import type { Workout } from '@/types';

// Mock workoutService
vi.mock('@/services/workoutService', () => ({
  getTodayWorkout: vi.fn(),
  getRecentWorkouts: vi.fn(),
  getWeekWorkouts: vi.fn(),
  getMonthStats: vi.fn(),
  calculateStreak: vi.fn(),
  startWorkout: vi.fn(),
  createWorkout: vi.fn(),
}));

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Дефолтные моки
    vi.mocked(workoutService.getTodayWorkout).mockReturnValue(null);
    vi.mocked(workoutService.getRecentWorkouts).mockReturnValue([]);
    vi.mocked(workoutService.getWeekWorkouts).mockReturnValue([]);
    vi.mocked(workoutService.getMonthStats).mockReturnValue({
      totalWorkouts: 0,
      totalVolume: 0,
      totalDuration: 0,
      averageDuration: 0,
    });
    vi.mocked(workoutService.calculateStreak).mockReturnValue(0);
  });

  it('должен загрузить данные при монтировании', async () => {
    const mockTodayWorkout: Workout = {
      id: '1',
      name: 'Сегодняшняя тренировка',
      date: new Date(),
      exercises: [],
      status: 'planned',
    };
    
    const mockCompletedWorkout: Workout = {
      id: '3',
      name: 'Завершенная тренировка',
      date: new Date(),
      exercises: [],
      status: 'completed',
    };

    vi.mocked(workoutService.getTodayWorkout).mockReturnValue(mockTodayWorkout);
    vi.mocked(workoutService.getRecentWorkouts).mockReturnValue([
      {
        id: '2',
        name: 'Прошлая тренировка',
        date: '2026-02-22',
        status: 'completed',
        duration: 60,
        totalVolume: 5000,
      },
    ]);
    vi.mocked(workoutService.getWeekWorkouts).mockReturnValue([mockCompletedWorkout]);
    vi.mocked(workoutService.getMonthStats).mockReturnValue({
      totalWorkouts: 10,
      totalVolume: 50000,
      totalDuration: 600,
      averageDuration: 60,
    });
    vi.mocked(workoutService.calculateStreak).mockReturnValue(5);

    const { result } = renderHook(() => useDashboard());

    // Ждем загрузки данных
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Проверяем загруженные данные
    expect(result.current.todayWorkout).toEqual(mockTodayWorkout);
    expect(result.current.recentWorkouts).toHaveLength(1);
    expect(result.current.stats.weekWorkouts).toBe(1);
    expect(result.current.stats.monthVolume).toBe(50000);
    expect(result.current.stats.currentStreak).toBe(5);
    expect(result.current.error).toBeNull();
  });

  it('должен обработать ошибку при загрузке', async () => {
    vi.mocked(workoutService.getTodayWorkout).mockImplementation(() => {
      throw new Error('Test error');
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Не удалось загрузить данные');
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('должен начать тренировку и обновить данные', async () => {
    const mockWorkout: Workout = {
      id: '1',
      name: 'Тренировка',
      date: new Date(),
      exercises: [],
      status: 'planned',
    };

    const startedWorkout: Workout = {
      ...mockWorkout,
      status: 'in-progress',
      startedAt: Date.now(),
    };

    vi.mocked(workoutService.getTodayWorkout).mockReturnValue(mockWorkout);
    vi.mocked(workoutService.startWorkout).mockReturnValue(startedWorkout);

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Начинаем тренировку
    act(() => {
      result.current.startWorkout('1');
    });

    // Проверяем, что startWorkout был вызван
    expect(workoutService.startWorkout).toHaveBeenCalledWith('1');
  });

  it('должен создать новую тренировку', async () => {
    const newWorkout: Workout = {
      id: '123',
      name: 'Новая тренировка',
      date: new Date(),
      exercises: [],
      status: 'planned',
    };

    vi.mocked(workoutService.createWorkout).mockReturnValue(newWorkout);

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Создаем тренировку
    let createdWorkout: Workout | null = null;
    act(() => {
      createdWorkout = result.current.createWorkout({ name: 'Новая тренировка' });
    });

    expect(workoutService.createWorkout).toHaveBeenCalledWith({ name: 'Новая тренировка' });
    expect(createdWorkout).toEqual(newWorkout);
  });

  it('должен обновить данные после refreshData', async () => {
    vi.mocked(workoutService.getTodayWorkout).mockReturnValue(null);

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Меняем мок
    const newWorkout: Workout = {
      id: '1',
      name: 'Новая тренировка',
      date: new Date(),
      exercises: [],
      status: 'planned',
    };
    vi.mocked(workoutService.getTodayWorkout).mockReturnValue(newWorkout);

    // Обновляем данные
    act(() => {
      result.current.refreshData();
    });

    await waitFor(() => {
      expect(result.current.todayWorkout).toEqual(newWorkout);
    });
  });

  it('должен правильно подсчитывать завершенные тренировки за неделю', async () => {
    const weekWorkouts: Workout[] = [
      {
        id: '1',
        name: 'Тренировка 1',
        date: new Date(),
        exercises: [],
        status: 'completed',
      },
      {
        id: '2',
        name: 'Тренировка 2',
        date: new Date(),
        exercises: [],
        status: 'completed',
      },
      {
        id: '3',
        name: 'Тренировка 3',
        date: new Date(),
        exercises: [],
        status: 'planned',
      },
    ];

    vi.mocked(workoutService.getWeekWorkouts).mockReturnValue(weekWorkouts);

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Должны быть учтены только completed тренировки
    expect(result.current.stats.weekWorkouts).toBe(2);
  });

  it('должен иметь activeProgram null по умолчанию', async () => {
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stats.activeProgram).toBeNull();
  });
});
