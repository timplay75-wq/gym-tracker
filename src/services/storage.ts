import type { Workout } from '@/types';
import { calculateTonnage } from '@/utils/helpers';

const STORAGE_KEY = 'gym-tracker-workouts';

export const storageService = {
  getWorkouts: (): Workout[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getWorkoutById: (id: string): Workout | null => {
    const workouts = storageService.getWorkouts();
    return workouts.find(w => w.id === id) || null;
  },

  saveWorkout: (workout: Workout): void => {
    const workouts = storageService.getWorkouts();
    const existingIndex = workouts.findIndex(w => w.id === workout.id);
    
    if (existingIndex >= 0) {
      workouts[existingIndex] = workout;
    } else {
      workouts.push(workout);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  },

  updateWorkout: (id: string, updatedWorkout: Workout): void => {
    const workouts = storageService.getWorkouts();
    const index = workouts.findIndex(w => w.id === id);
    
    if (index >= 0) {
      workouts[index] = { ...workouts[index], ...updatedWorkout };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    }
  },

  deleteWorkout: (id: string): void => {
    const workouts = storageService.getWorkouts();
    const filtered = workouts.filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getRecentWorkouts: (limit: number = 5): Workout[] => {
    const workouts = storageService.getWorkouts();
    return workouts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },

  getStats: () => {
    const workouts = storageService.getWorkouts();
    const totalWorkouts = workouts.filter(w => w.completedAt).length;
    
    let totalTonnage = 0;
    workouts.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        if (exercise.sets) {
          totalTonnage += calculateTonnage(exercise.sets);
        }
      });
    });

    return {
      totalWorkouts,
      totalTonnage,
    };
  },

  clearAllWorkouts: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
