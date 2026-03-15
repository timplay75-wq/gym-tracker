import { useState, useEffect, useCallback } from 'react';
import type { Workout, WorkoutListItem } from '@/types';
import { workoutsApi } from '@/services/api';

interface DashboardStats {
  weekWorkouts: number;
  monthVolume: number;
  currentStreak: number;
  activeProgram: string | null;
}

export function useDashboard() {
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutListItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    weekWorkouts: 0,
    monthVolume: 0,
    currentStreak: 0,
    activeProgram: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [today, recentRes, apiStats] = await Promise.all([
        workoutsApi.getToday(),
        workoutsApi.getAll({ status: 'completed', limit: 5 }),
        workoutsApi.getStats(),
      ]);

      setTodayWorkout(today);

      // Маппим в WorkoutListItem
      const recent: WorkoutListItem[] = recentRes.workouts.map(w => ({
        id: w.id,
        name: w.name,
        date: typeof w.date === 'string' ? w.date : w.date.toISOString().split('T')[0],
        status: w.status,
        duration: w.duration,
        totalVolume: w.totalVolume,
        totalSets: w.totalSets,
      }));
      setRecentWorkouts(recent);

      // Подсчёт тренировок за неделю из последних данных
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekRes = await workoutsApi.getAll({ status: 'completed', limit: 100 });
      const weekCount = weekRes.workouts.filter(w => new Date(w.date) >= weekAgo).length;

      setStats({
        weekWorkouts: weekCount,
        monthVolume: apiStats.totalVolume,
        currentStreak: 0,
        activeProgram: null,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Не удалось загрузить данные');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStartWorkout = useCallback(async (id: string) => {
    try {
      await workoutsApi.update(id, { status: 'in-progress' });
      await loadData();
    } catch (err) {
      console.error('Failed to start workout:', err);
      setError('Не удалось начать тренировку');
    }
  }, [loadData]);

  const handleCreateWorkout = useCallback(async (input: Partial<Workout>) => {
    try {
      const workout = await workoutsApi.create(input);
      await loadData();
      return workout;
    } catch (err) {
      console.error('Failed to create workout:', err);
      setError('Не удалось создать тренировку');
      return null;
    }
  }, [loadData]);

  return {
    todayWorkout,
    recentWorkouts,
    stats,
    isLoading,
    error,
    refreshData: loadData,
    startWorkout: handleStartWorkout,
    createWorkout: handleCreateWorkout,
  };
}
