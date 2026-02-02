import type { Workout } from '@/types';

const STORAGE_KEY = 'gym-tracker-workouts';

export const storageService = {
  getWorkouts: (): Workout[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
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

  deleteWorkout: (id: string): void => {
    const workouts = storageService.getWorkouts();
    const filtered = workouts.filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  clearAllWorkouts: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
