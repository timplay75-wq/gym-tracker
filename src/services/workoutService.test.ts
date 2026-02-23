import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as workoutService from './workoutService';
import type { Workout } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('workoutService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getAllWorkouts', () => {
    it('должен вернуть пустой массив если нет тренировок', () => {
      const workouts = workoutService.getAllWorkouts();
      expect(workouts).toEqual([]);
    });

    it('должен вернуть все тренировки из localStorage', () => {
      const mockWorkouts: Workout[] = [
        {
          id: '1',
          name: 'Тренировка 1',
          date: new Date('2026-02-23'),
          exercises: [],
          status: 'completed',
        },
      ];
      
      localStorage.setItem('gym-tracker-workouts', JSON.stringify(mockWorkouts));
      
      const workouts = workoutService.getAllWorkouts();
      expect(workouts).toHaveLength(1);
      expect(workouts[0].name).toBe('Тренировка 1');
    });

    it('должен вернуть пустой массив при ошибке парсинга', () => {
      localStorage.setItem('gym-tracker-workouts', 'invalid json');
      const workouts = workoutService.getAllWorkouts();
      expect(workouts).toEqual([]);
    });
  });

  describe('getTodayWorkout', () => {
    it('должен вернуть тренировку на сегодня', () => {
      const today = new Date();
      const mockWorkouts: Workout[] = [
        {
          id: '1',
          name: 'Сегодняшняя тренировка',
          date: today,
          exercises: [],
          status: 'planned',
        },
        {
          id: '2',
          name: 'Вчерашняя тренировка',
          date: new Date(today.getTime() - 86400000),
          exercises: [],
          status: 'completed',
        },
      ];
      
      localStorage.setItem('gym-tracker-workouts', JSON.stringify(mockWorkouts));
      
      const todayWorkout = workoutService.getTodayWorkout();
      expect(todayWorkout).not.toBeNull();
      expect(todayWorkout?.name).toBe('Сегодняшняя тренировка');
    });

    it('должен вернуть null если нет тренировки на сегодня', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const mockWorkouts: Workout[] = [
        {
          id: '1',
          name: 'Вчерашняя тренировка',
          date: yesterday,
          exercises: [],
          status: 'completed',
        },
      ];
      
      localStorage.setItem('gym-tracker-workouts', JSON.stringify(mockWorkouts));
      
      const todayWorkout = workoutService.getTodayWorkout();
      expect(todayWorkout).toBeNull();
    });

    it('должен игнорировать пропущенные тренировки', () => {
      const today = new Date();
      const mockWorkouts: Workout[] = [
        {
          id: '1',
          name: 'Пропущенная тренировка',
          date: today,
          exercises: [],
          status: 'skipped',
        },
      ];
      
      localStorage.setItem('gym-tracker-workouts', JSON.stringify(mockWorkouts));
      
      const todayWorkout = workoutService.getTodayWorkout();
      expect(todayWorkout).toBeNull();
    });
  });

  describe('createWorkout', () => {
    it('должен создать новую тренировку с дефолтными значениями', () => {
      const workout = workoutService.createWorkout({ name: 'Новая тренировка' });
      
      expect(workout).toBeDefined();
      expect(workout.id).toBeDefined();
      expect(workout.name).toBe('Новая тренировка');
      expect(workout.status).toBe('planned');
      expect(workout.exercises).toEqual([]);
    });

    it('должен сохранить тренировку в localStorage', () => {
      const workout = workoutService.createWorkout({ name: 'Тестовая тренировка' });
      
      const saved = workoutService.getAllWorkouts();
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe(workout.id);
    });

    it('должен использовать переданные данные', () => {
      const customDate = new Date('2026-02-25');
      const workout = workoutService.createWorkout({
        name: 'Кастомная тренировка',
        date: customDate,
        notes: 'Тестовые заметки',
      });
      
      expect(workout.name).toBe('Кастомная тренировка');
      expect(workout.notes).toBe('Тестовые заметки');
    });
  });

  describe('startWorkout', () => {
    it('должен изменить статус на in-progress', () => {
      const created = workoutService.createWorkout({ name: 'Тренировка' });
      
      const started = workoutService.startWorkout(created.id);
      
      expect(started).not.toBeNull();
      expect(started?.status).toBe('in-progress');
      expect(started?.startedAt).toBeDefined();
    });

    it('должен вернуть null для несуществующей тренировки', () => {
      const result = workoutService.startWorkout('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('completeWorkout', () => {
    it('должен завершить тренировку и сохранить метрики', () => {
      const created = workoutService.createWorkout({ name: 'Тренировка' });
      
      const completed = workoutService.completeWorkout(created.id, 60, {
        totalVolume: 5000,
        totalSets: 12,
        totalReps: 48,
      });
      
      expect(completed).not.toBeNull();
      expect(completed?.status).toBe('completed');
      expect(completed?.duration).toBe(60);
      expect(completed?.totalVolume).toBe(5000);
      expect(completed?.totalSets).toBe(12);
      expect(completed?.totalReps).toBe(48);
      expect(completed?.completedAt).toBeDefined();
    });
  });

  describe('calculateStreak', () => {
    it('должен вернуть 0 если нет завершенных тренировок', () => {
      const streak = workoutService.calculateStreak();
      expect(streak).toBe(0);
    });

    it('должен правильно подсчитать streak', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const mockWorkouts: Workout[] = [
        {
          id: '1',
          name: 'Сегодня',
          date: today,
          exercises: [],
          status: 'completed',
        },
        {
          id: '2',
          name: 'Вчера',
          date: yesterday,
          exercises: [],
          status: 'completed',
        },
      ];
      
      localStorage.setItem('gym-tracker-workouts', JSON.stringify(mockWorkouts));
      
      const streak = workoutService.calculateStreak();
      expect(streak).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getMonthStats', () => {
    it('должен вернуть статистику за текущий месяц', () => {
      const today = new Date();
      const mockWorkouts: Workout[] = [
        {
          id: '1',
          name: 'Тренировка 1',
          date: today,
          exercises: [],
          status: 'completed',
          duration: 60,
          totalVolume: 5000,
        },
        {
          id: '2',
          name: 'Тренировка 2',
          date: today,
          exercises: [],
          status: 'completed',
          duration: 45,
          totalVolume: 3000,
        },
      ];
      
      localStorage.setItem('gym-tracker-workouts', JSON.stringify(mockWorkouts));
      
      const stats = workoutService.getMonthStats();
      expect(stats.totalWorkouts).toBe(2);
      expect(stats.totalVolume).toBe(8000);
      expect(stats.totalDuration).toBe(105);
      expect(stats.averageDuration).toBe(53); // 105 / 2 = 52.5, округляется до 53
    });

    it('должен вернуть нули если нет тренировок', () => {
      const stats = workoutService.getMonthStats();
      expect(stats.totalWorkouts).toBe(0);
      expect(stats.totalVolume).toBe(0);
      expect(stats.totalDuration).toBe(0);
      expect(stats.averageDuration).toBe(0);
    });
  });

  describe('deleteWorkout', () => {
    it('должен удалить тренировку', () => {
      const created = workoutService.createWorkout({ name: 'Тренировка' });
      
      const deleted = workoutService.deleteWorkout(created.id);
      
      expect(deleted).toBe(true);
      
      const workouts = workoutService.getAllWorkouts();
      expect(workouts).toHaveLength(0);
    });

    it('должен вернуть false для несуществующей тренировки', () => {
      const deleted = workoutService.deleteWorkout('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('getRecentWorkouts', () => {
    it('должен вернуть последние завершенные тренировки', () => {
      const mockWorkouts: Workout[] = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        name: `Тренировка ${i}`,
        date: new Date(Date.now() - i * 86400000),
        exercises: [],
        status: 'completed' as const,
        duration: 60,
        totalVolume: 5000,
      }));
      
      localStorage.setItem('gym-tracker-workouts', JSON.stringify(mockWorkouts));
      
      const recent = workoutService.getRecentWorkouts(5);
      expect(recent).toHaveLength(5);
      expect(recent[0].name).toBe('Тренировка 0');
    });

    it('должен возвращать только completed тренировки', () => {
      const mockWorkouts: Workout[] = [
        {
          id: '1',
          name: 'Завершенная',
          date: new Date(),
          exercises: [],
          status: 'completed',
        },
        {
          id: '2',
          name: 'Запланированная',
          date: new Date(),
          exercises: [],
          status: 'planned',
        },
      ];
      
      localStorage.setItem('gym-tracker-workouts', JSON.stringify(mockWorkouts));
      
      const recent = workoutService.getRecentWorkouts(5);
      expect(recent).toHaveLength(1);
      expect(recent[0].name).toBe('Завершенная');
    });
  });
});
