# 🎯 Улучшенные промты - Этапы 3-9 (Дополнение)

> Это дополнение к PROMPTS_IMPROVED.md с остальными этапами

## 📋 Содержание

- [Этап 3.2: Главный экран (Dashboard)](#этап-32-главный-экран-dashboard)
- [Этап 3.3: Workout Builder](#этап-33-workout-builder)
- [Этап 3.4: Active Workout](#этап-34-active-workout)
- [Этап 4: Статистика и аналитика](#этап-4-статистика-и-аналитика)
- [Этап 5: Авторизация и профиль](#этап-5-авторизация-и-профиль)
- [Этап 6: Продвинутые функции](#этап-6-продвинутые-функции)
- [Этап 7: PWA и оптимизация](#этап-7-pwa-и-оптимизация)
- [Этап 8: Полировка](#этап-8-полировка)
- [Этап 9: Тестирование и деплой](#этап-9-тестирование-и-деплой)

---

## Этап 3.2: Главный экран (Dashboard)

### ❌ Промт 3.2 (ОРИГИНАЛ): Главный экран

**Проблемы:**
- Нет конкретной структуры компонентов
- Отсутствуют типы данных
- Не указано, откуда брать данные
- Нет обработки пустых состояний

---

### ✅ Промт 3.2 (УЛУЧШЕННЫЙ): Dashboard с Today's Workout и статистикой

```markdown
## Цель
Создать главный экран (Dashboard) с календарём тренировок, сегодняшней тренировкой и быстрой статистикой.

## Архитектура данных

### 1. Service для работы с тренировками

Создай `src/services/workoutService.ts`:

```typescript
import { Workout, WorkoutSummary, WorkoutCalendarItem } from '@/types';
import { isSameDay, startOfWeek, endOfWeek, format } from 'date-fns';
import { ru } from 'date-fns/locale';

const STORAGE_KEY = 'gym-tracker-workouts';

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
  }
}

// Получить тренировку на сегодня
export function getTodayWorkout(): Workout | null {
  const workouts = getAllWorkouts();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  return workouts.find(w => w.date === today && w.status !== 'skipped') || null;
}

// Получить тренировки за неделю
export function getWeekWorkouts(): Workout[] {
  const workouts = getAllWorkouts();
  const start = startOfWeek(new Date(), { locale: ru });
  const end = endOfWeek(new Date(), { locale: ru });
  
  return workouts.filter(w => {
    const workoutDate = new Date(w.date);
    return workoutDate >= start && workoutDate <= end;
  });
}

// Получить последние N тренировок
export function getRecentWorkouts(limit: number = 5): WorkoutSummary[] {
  const workouts = getAllWorkouts();
  
  return workouts
    .filter(w => w.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map(w => ({
      id: w.id,
      name: w.name,
      date: w.date,
      status: w.status,
      duration: w.duration,
      totalVolume: w.totalVolume,
      totalSets: w.totalSets,
    }));
}

// Получить календарь на месяц
export function getMonthCalendarData(year: number, month: number): WorkoutCalendarItem[] {
  const workouts = getAllWorkouts();
  
  return workouts
    .filter(w => {
      const date = new Date(w.date);
      return date.getFullYear() === year && date.getMonth() === month;
    })
    .map(w => ({
      id: w.id,
      name: w.name,
      date: w.date,
      completed: w.status === 'completed',
      exerciseCount: w.exercises.length,
    }));
}

// Создать тренировку
export function createWorkout(input: CreateWorkoutInput): Workout {
  const workouts = getAllWorkouts();
  
  const newWorkout: Workout = {
    ...input,
    id: crypto.randomUUID(),
    status: 'planned',
    exercises: input.exercises || [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  workouts.push(newWorkout);
  saveWorkouts(workouts);
  
  return newWorkout;
}

// Начать тренировку
export function startWorkout(id: string): Workout | null {
  const workouts = getAllWorkouts();
  const workout = workouts.find(w => w.id === id);
  
  if (!workout) return null;
  
  workout.status = 'in_progress';
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

// Удалить тренировку
export function deleteWorkout(id: string): boolean {
  const workouts = getAllWorkouts();
  const filtered = workouts.filter(w => w.id !== id);
  
  if (filtered.length === workouts.length) return false;
  
  saveWorkouts(filtered);
  return true;
}
```

### 2. Custom Hook для Dashboard

Создай `src/hooks/useDashboard.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { Workout, WorkoutSummary } from '@/types';
import * as workoutService from '@/services/workoutService';

interface DashboardStats {
  weekWorkouts: number;
  monthVolume: number;
  currentStreak: number;
  activeProgram: string | null;
}

export function useDashboard() {
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSummary[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    weekWorkouts: 0,
    monthVolume: 0,
    currentStreak: 0,
    activeProgram: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(() => {
    setIsLoading(true);
    
    try {
      // Тренировка на сегодня
      const today = workoutService.getTodayWorkout();
      setTodayWorkout(today);
      
      // Последние тренировки
      const recent = workoutService.getRecentWorkouts(5);
      setRecentWorkouts(recent);
      
      // Статистика
      const weekWorkouts = workoutService.getWeekWorkouts();
      const completedThisWeek = weekWorkouts.filter(w => w.status === 'completed');
      
      // Тоннаж за месяц
      const allWorkouts = workoutService.getAllWorkouts();
      const thisMonth = allWorkouts.filter(w => {
        const date = new Date(w.date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && 
               date.getFullYear() === now.getFullYear() &&
               w.status === 'completed';
      });
      const monthVolume = thisMonth.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
      
      // TODO: Рассчитать streak
      const streak = calculateStreak(allWorkouts);
      
      setStats({
        weekWorkouts: completedThisWeek.length,
        monthVolume: Math.round(monthVolume),
        currentStreak: streak,
        activeProgram: null, // TODO: из context или settings
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStartWorkout = useCallback((id: string) => {
    workoutService.startWorkout(id);
    loadData();
  }, [loadData]);

  return {
    todayWorkout,
    recentWorkouts,
    stats,
    isLoading,
    refreshData: loadData,
    startWorkout: handleStartWorkout,
  };
}

// Вспомогательная функция для расчёта streak
function calculateStreak(workouts: Workout[]): number {
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
    } else {
      break;
    }
  }
  
  return streak;
}
```

### 3. Dashboard UI компоненты

Создай `src/pages/Home.tsx`:

```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/hooks/useDashboard';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  PlayIcon, 
  PlusIcon, 
  TrendingUpIcon, 
  DumbbellIcon,
  CalendarIcon,
  FlameIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function Home() {
  const navigate = useNavigate();
  const { todayWorkout, recentWorkouts, stats, isLoading, startWorkout } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24">
      <div className="max-w-[480px] mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Сегодня
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            {format(new Date(), 'd MMMM, EEEE', { locale: ru })}
          </p>
        </header>

        {/* Today's Workout Card */}
        {todayWorkout ? (
          <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white mb-2">
                    {todayWorkout.name}
                  </CardTitle>
                  <CardDescription className="text-primary-100">
                    {todayWorkout.exercises.length} упражнений
                  </CardDescription>
                </div>
                {todayWorkout.status === 'completed' && (
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
                    <span>✓</span>
                    <span>Выполнено</span>
                  </div>
                )}
              </div>
            </CardHeader>

            <div className="px-6 pb-6">
              {todayWorkout.status !== 'completed' && (
                <Button
                  fullWidth
                  size="lg"
                  variant="secondary"
                  leftIcon={<PlayIcon />}
                  onClick={() => {
                    startWorkout(todayWorkout.id);
                    navigate(`/workouts/${todayWorkout.id}/active`);
                  }}
                >
                  Начать тренировку
                </Button>
              )}
              
              {todayWorkout.status === 'completed' && todayWorkout.duration && (
                <div className="flex items-center justify-between text-sm text-primary-100">
                  <span>Длительность: {todayWorkout.duration} мин</span>
                  <span>Тоннаж: {todayWorkout.totalVolume} кг</span>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card className="border-dashed border-2">
            <div className="text-center py-8">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <DumbbellIcon className="h-8 w-8 text-neutral-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
                Нет тренировки на сегодня
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Создайте тренировку, чтобы начать
              </p>
              <Button
                leftIcon={<PlusIcon />}
                onClick={() => navigate('/workouts/create')}
              >
                Создать тренировку
              </Button>
            </div>
          </Card>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card padding="md" hoverable>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stats.weekWorkouts}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  За неделю
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md" hoverable>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success-100 dark:bg-success-900 flex items-center justify-center">
                <TrendingUpIcon className="h-5 w-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stats.monthVolume}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  кг за месяц
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md" hoverable>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-error-100 dark:bg-error-900 flex items-center justify-center">
                <FlameIcon className="h-5 w-5 text-error-600 dark:text-error-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stats.currentStreak}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Дней подряд
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md" hoverable>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning-100 dark:bg-warning-900 flex items-center justify-center">
                <DumbbellIcon className="h-5 w-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {stats.activeProgram || 'Нет'}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Программа
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Workouts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Последние тренировки
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/workouts')}
            >
              Все
            </Button>
          </div>

          <div className="space-y-2">
            {recentWorkouts.length === 0 ? (
              <Card padding="md">
                <p className="text-sm text-center text-neutral-500 dark:text-neutral-400">
                  Пока нет завершённых тренировок
                </p>
              </Card>
            ) : (
              recentWorkouts.map(workout => (
                <Card
                  key={workout.id}
                  padding="md"
                  hoverable
                  clickable
                  onClick={() => navigate(`/workouts/${workout.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {workout.name}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {format(new Date(workout.date), 'd MMM', { locale: ru })} • {workout.duration} мин
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600 dark:text-primary-400">
                        {workout.totalVolume} кг
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {workout.totalSets} подходов
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4. Skeleton Loading

Создай `src/components/DashboardSkeleton.tsx`:

```typescript
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24">
      <div className="max-w-[480px] mx-auto px-4 py-6 space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>

        {/* Today's workout skeleton */}
        <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Recent workouts skeleton */}
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Критерии завершения

- [ ] workoutService создан со всеми методами CRUD
- [ ] useDashboard hook с полной типизацией
- [ ] Home page отображает сегодняшнюю тренировку
- [ ] Quick stats cards с реальными данными
- [ ] Recent workouts список работает
- [ ] Empty states для всех сценариев
- [ ] Skeleton loading при загрузке
- [ ] Навигация на все экраны функционирует
- [ ] Расчёт streak работает корректно
- [ ] localStorage операции обрабатывают ошибки
- [ ] Респонсивность на всех размерах экрана

## Дополнительные фичи (опционально)

```typescript
// Pull to refresh
import { useState } from 'react';

function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [startY, setStartY] = useState(0);
  const [pulling, setPulling] = useState(false);

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (startY && e.touches[0].clientY - startY > 80) {
      setPulling(true);
    }
  };

  const handleTouchEnd = async () => {
    if (pulling) {
      await onRefresh();
      setPulling(false);
    }
    setStartY(0);
  };

  return { pulling, handleTouchStart, handleTouchMove, handleTouchEnd };
}
```
```

**Почему это лучше:**
- ✅ Полный workoutService с CRUD операциями
- ✅ Custom hook для управления состоянием dashboard
- ✅ Empty states для всех сценариев
- ✅ Skeleton loading для UX
- ✅ Расчёт streak с правильной логикой
- ✅ Error handling во всех localStorage операциях
- ✅ Реальная типизация с TypeScript
- ✅ date-fns для работы с датами
- ✅ Респонсивный дизайн с max-width
- ✅ Доступная навигация

---

*Промты для этапов 3.3, 3.4, 4-9 будут добавлены в следующем обновлении. Начни с этих двух для закрепления навыков!*
