import { apiFetch } from './apiClient';

export const statsApi = {
  getSummary: () => apiFetch<{
    totalWorkouts: number;
    thisMonthWorkouts: number;
    lastMonthWorkouts: number;
    totalVolume: number;
    avgDuration: number;
    currentStreak: number;
  }>('/stats/summary'),

  getWeekly: () => apiFetch<Array<{
    week: string;
    count: number;
    volume: number;
    duration: number;
  }>>('/stats/weekly'),

  getTopExercises: () => apiFetch<Array<{
    _id: string;
    category: string;
    totalVolume: number;
    totalSets: number;
    maxWeight: number;
    timesPerformed: number;
  }>>('/stats/exercises'),

  getMuscleDistribution: (period?: string) => {
    const q = period ? `?period=${period}` : '';
    return apiFetch<Array<{
      _id: string;
      volume: number;
      sets: number;
      exerciseCount: number;
    }>>(`/stats/muscles${q}`);
  },

  getExerciseHistory: (name: string) => apiFetch<{
    exerciseName: string;
    totalSessions: number;
    isDoubleWeight: boolean;
    isBodyweight: boolean;
    personalRecords: {
      maxWeight: { value: number; date: string | null };
      maxReps: { value: number; date: string | null };
      maxVolume: { value: number; date: string | null };
    };
    history: Array<{
      date: string;
      sets: Array<{ weight: number; reps: number }>;
      maxWeight: number;
      maxReps: number;
      totalVolume: number;
      totalReps: number;
      setsCount: number;
    }>;
  }>(`/stats/exercise/${encodeURIComponent(name)}`),

  getWeekdayFrequency: () => apiFetch<number[]>('/stats/weekdays'),
};
