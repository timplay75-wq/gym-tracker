import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../services/storage';
import type { Workout } from '../types/workout';

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Workouts', () => {
    const mockWorkout: Workout = {
      id: '1',
      name: 'Test Workout',
      date: new Date().toISOString(),
      exercises: [],
      duration: 0,
    };

    it('saves workout to localStorage', () => {
      storageService.saveWorkout(mockWorkout);
      const workouts = storageService.getWorkouts();

      expect(workouts).toHaveLength(1);
      expect(workouts[0]).toEqual(mockWorkout);
    });

    it('retrieves all workouts', () => {
      const workout1 = { ...mockWorkout, id: '1', name: 'Workout 1' };
      const workout2 = { ...mockWorkout, id: '2', name: 'Workout 2' };

      storageService.saveWorkout(workout1);
      storageService.saveWorkout(workout2);

      const workouts = storageService.getWorkouts();
      expect(workouts).toHaveLength(2);
    });

    it('retrieves workout by id', () => {
      storageService.saveWorkout(mockWorkout);
      const retrieved = storageService.getWorkoutById('1');

      expect(retrieved).toEqual(mockWorkout);
    });

    it('returns null for non-existent workout', () => {
      const retrieved = storageService.getWorkoutById('non-existent');
      expect(retrieved).toBeNull();
    });

    it('updates existing workout', () => {
      storageService.saveWorkout(mockWorkout);
      const updated = { ...mockWorkout, name: 'Updated Workout' };
      storageService.updateWorkout('1', updated);

      const retrieved = storageService.getWorkoutById('1');
      expect(retrieved?.name).toBe('Updated Workout');
    });

    it('deletes workout', () => {
      storageService.saveWorkout(mockWorkout);
      storageService.deleteWorkout('1');

      const workouts = storageService.getWorkouts();
      expect(workouts).toHaveLength(0);
    });

    it('handles empty storage', () => {
      const workouts = storageService.getWorkouts();
      expect(workouts).toEqual([]);
    });
  });

  describe('Recent Workouts', () => {
    it('returns most recent workouts first', () => {
      const workout1 = {
        id: '1',
        name: 'Old Workout',
        date: new Date('2024-01-01').toISOString(),
        exercises: [],
        duration: 0,
        completedAt: new Date('2024-01-01').toISOString(),
      };

      const workout2 = {
        id: '2',
        name: 'Recent Workout',
        date: new Date('2024-01-15').toISOString(),
        exercises: [],
        duration: 0,
        completedAt: new Date('2024-01-15').toISOString(),
      };

      storageService.saveWorkout(workout1);
      storageService.saveWorkout(workout2);

      const recent = storageService.getRecentWorkouts(2);
      expect(recent[0].name).toBe('Recent Workout');
      expect(recent[1].name).toBe('Old Workout');
    });

    it('limits number of returned workouts', () => {
      for (let i = 0; i < 10; i++) {
        storageService.saveWorkout({
          id: `${i}`,
          name: `Workout ${i}`,
          date: new Date().toISOString(),
          exercises: [],
          duration: 0,
          completedAt: new Date().toISOString(),
        });
      }

      const recent = storageService.getRecentWorkouts(5);
      expect(recent).toHaveLength(5);
    });
  });

  describe('Statistics', () => {
    it('calculates total workouts', () => {
      for (let i = 0; i < 5; i++) {
        storageService.saveWorkout({
          id: `${i}`,
          name: `Workout ${i}`,
          date: new Date().toISOString(),
          exercises: [],
          duration: 0,
          completedAt: new Date().toISOString(),
        });
      }

      const stats = storageService.getStats();
      expect(stats.totalWorkouts).toBe(5);
    });

    it('calculates total tonnage', () => {
      const workoutWithTonnage: Workout = {
        id: '1',
        name: 'Heavy Workout',
        date: new Date().toISOString(),
        exercises: [
          {
            id: '1',
            name: 'Bench Press',
            sets: [
              { weight: 100, reps: 10, completed: true, rest: 60 },
              { weight: 100, reps: 10, completed: true, rest: 60 },
            ],
            muscleGroup: 'chest',
          },
        ],
        duration: 3600,
        completedAt: new Date().toISOString(),
      };

      storageService.saveWorkout(workoutWithTonnage);
      const stats = storageService.getStats();
      
      expect(stats.totalTonnage).toBe(2000);
    });
  });
});
