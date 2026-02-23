import type { Workout, WorkoutListItem, WorkoutCalendarItem } from '@/types';

const STORAGE_KEY = 'gym-tracker-workouts';

// Helper function to format Date to ISO string (YYYY-MM-DD)
function formatDateToISO(date: Date): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Получить все тренировки
export function getAllWorkouts(): Workout[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load workouts:', error);
    return [];
  }
}

// Сохранить тренировки
function saveWorkouts(workouts: Workout[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.error('Failed to save workouts:', error);
    throw new Error('Не удалось сохранить тренировки');
  }
}

// Получить тренировку на сегодня
export function getTodayWorkout(): Workout | null {
  const workouts = getAllWorkouts();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return workouts.find(w => {
    const workoutDate = new Date(w.date);
    workoutDate.setHours(0, 0, 0, 0);
    return workoutDate.getTime() === today.getTime() && w.status !== 'skipped';
  }) || null;
}

// Получить тренировки за неделю
export function getWeekWorkouts(): Workout[] {
  const workouts = getAllWorkouts();
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  return workouts.filter(w => {
    const workoutDate = new Date(w.date);
    return workoutDate >= weekAgo && workoutDate <= today;
  });
}

// Получить последние N тренировок
export function getRecentWorkouts(limit: number = 5): WorkoutListItem[] {
  const workouts = getAllWorkouts();
  
  return workouts
    .filter(w => w.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map(w => ({
      id: w.id,
      name: w.name,
      date: formatDateToISO(w.date),
      status: w.status,
      duration: w.duration,
      totalVolume: w.totalVolume,
      totalSets: w.totalSets,
    }));
}

// Получить календарь на месяц
export function getMonthCalendarData(year: number, month: number): WorkoutCalendarItem[] {
  const workouts = getAllWorkouts();
  const dateMap = new Map<string, WorkoutCalendarItem>();
  
  workouts
    .filter(w => {
      const date = new Date(w.date);
      return date.getFullYear() === year && date.getMonth() === month;
    })
    .forEach(w => {
      const dateStr = formatDateToISO(w.date);
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, {
          date: dateStr,
          workouts: [],
          hasWorkout: false,
        });
      }
      const item = dateMap.get(dateStr)!;
      item.workouts.push({
        id: w.id,
        name: w.name,
        status: w.status,
      });
      item.hasWorkout = true;
    });
  
  return Array.from(dateMap.values());
}

// Создать тренировку
export function createWorkout(input: Partial<Workout>): Workout {
  const workouts = getAllWorkouts();
  
  const newWorkout: Workout = {
    id: crypto.randomUUID(),
    name: input.name || 'Новая тренировка',
    date: input.date || new Date(),
    status: 'planned',
    exercises: input.exercises || [],
    scheduledTime: input.scheduledTime,
    programId: input.programId,
    notes: input.notes,
    updatedAt: Date.now(),
  };
  
  workouts.push(newWorkout);
  saveWorkouts(workouts);
  
  return newWorkout;
}

// Получить тренировку по ID
export function getWorkoutById(id: string): Workout | null {
  const workouts = getAllWorkouts();
  return workouts.find(w => w.id === id) || null;
}

// Начать тренировку
export function startWorkout(id: string): Workout | null {
  const workouts = getAllWorkouts();
  const workout = workouts.find(w => w.id === id);
  
  if (!workout) return null;
  
  workout.status = 'in-progress';
  workout.startedAt = Date.now();
  workout.updatedAt = Date.now();
  
  saveWorkouts(workouts);
  return workout;
}

// Завершить тренировку
export function completeWorkout(id: string, duration: number, metrics: {
  totalVolume: number;
  totalSets: number;
  totalReps: number;
}): Workout | null {
  const workouts = getAllWorkouts();
  const workout = workouts.find(w => w.id === id);
  
  if (!workout) return null;
  
  workout.status = 'completed';
  workout.completedAt = Date.now();
  workout.duration = duration;
  workout.totalVolume = metrics.totalVolume;
  workout.totalSets = metrics.totalSets;
  workout.totalReps = metrics.totalReps;
  workout.updatedAt = Date.now();
  
  saveWorkouts(workouts);
  return workout;
}

// Обновить тренировку
export function updateWorkout(id: string, updates: Partial<Workout>): Workout | null {
  const workouts = getAllWorkouts();
  const index = workouts.findIndex(w => w.id === id);
  
  if (index === -1) return null;
  
  workouts[index] = {
    ...workouts[index],
    ...updates,
    updatedAt: Date.now(),
  };
  
  saveWorkouts(workouts);
  return workouts[index];
}

// Удалить тренировку
export function deleteWorkout(id: string): boolean {
  const workouts = getAllWorkouts();
  const filtered = workouts.filter(w => w.id !== id);
  
  if (filtered.length === workouts.length) return false;
  
  saveWorkouts(filtered);
  return true;
}

// Рассчитать streak (дни подряд)
export function calculateStreak(): number {
  const workouts = getAllWorkouts();
  const completed = workouts
    .filter(w => w.status === 'completed')
    .map(w => w.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  if (completed.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < completed.length; i++) {
    const workoutDate = new Date(completed[i]);
    workoutDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - streak);
    
    if (workoutDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else if (streak === 0 && workoutDate < today) {
      // Если сегодня не было тренировки, но вчера была
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (workoutDate.getTime() === yesterday.getTime()) {
        streak++;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  
  return streak;
}

// Получить статистику за месяц
export function getMonthStats() {
  const workouts = getAllWorkouts();
  const now = new Date();
  const thisMonth = workouts.filter(w => {
    const date = new Date(w.date);
    return date.getMonth() === now.getMonth() && 
           date.getFullYear() === now.getFullYear() &&
           w.status === 'completed';
  });
  
  const totalVolume = thisMonth.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
  const totalWorkouts = thisMonth.length;
  const totalDuration = thisMonth.reduce((sum, w) => sum + (w.duration || 0), 0);
  
  return {
    totalVolume: Math.round(totalVolume),
    totalWorkouts,
    totalDuration,
    averageDuration: totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0,
  };
}
