import { useState, useEffect, useCallback } from 'react';
import type { Workout, WorkoutListItem } from '@/types';
import * as workoutService from '@/services/workoutService';

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

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Тренировка на сегодня
      const today = workoutService.getTodayWorkout();
      setTodayWorkout(today);
      
      // Последние тренировки
      const recent = workoutService.getRecentWorkouts(5);
      setRecentWorkouts(recent);
      
      // Статистика за неделю
      const weekWorkouts = workoutService.getWeekWorkouts();
      const completedThisWeek = weekWorkouts.filter(w => w.status === 'completed');
      
      // Статистика за месяц
      const monthStats = workoutService.getMonthStats();
      
      // Streak
      const streak = workoutService.calculateStreak();
      
      setStats({
        weekWorkouts: completedThisWeek.length,
        monthVolume: monthStats.totalVolume,
        currentStreak: streak,
        activeProgram: null, // TODO: из settings или context
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

  const handleStartWorkout = useCallback((id: string) => {
    try {
      workoutService.startWorkout(id);
      loadData();
    } catch (err) {
      console.error('Failed to start workout:', err);
      setError('Не удалось начать тренировку');
    }
  }, [loadData]);

  const handleCreateWorkout = useCallback((input: Partial<Workout>) => {
    try {
      const workout = workoutService.createWorkout(input);
      loadData();
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
