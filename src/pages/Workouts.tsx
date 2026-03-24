import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { workoutsApi } from '@/services/api';
import { useLanguage } from '@/i18n';
import { useToast } from '@/hooks/useToast';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import type { Workout } from '@/types';
import { formatDate } from '@/utils/helpers';
import { Card, Modal, Button, Input } from '@/components';

// Компонент иконки категории мышцы
function CategoryIcon({ category }: { category?: string }) {
  const colorMap: Record<string, string> = {
    chest: '#9333ea', back: '#3b82f6', legs: '#22c55e',
    shoulders: '#f59e0b', arms: '#ef4444', core: '#f97316',
    cardio: '#06b6d4', other: '#6b7280',
  };
  const color = colorMap[category || 'other'] || '#6b7280';
  return (
    <div
      className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: color + '20' }}
    >
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
    </div>
  );
}

type FilterPeriod = 'week' | 'month' | 'year' | 'all';

export const Workouts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const toast = useToast();
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Для удаления
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  
  // Свайп для удаления
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{ id: string; offset: number } | null>(null);
  const touchData = useRef<{ x: number; y: number; id: string } | null>(null);

  // Pull-to-refresh
  const containerRef = useRef<HTMLDivElement>(null);

  const loadWorkouts = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await workoutsApi.getAll({ limit: 200 });
      const sorted = res.workouts.sort((a, b) => {
        const ca = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const cb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (cb !== ca) return cb - ca;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setAllWorkouts(sorted);
    } catch (err) {
      console.error('Load error:', err);
      setLoadError(err instanceof Error ? err.message : t.workouts.loadError);
    } finally {
      setIsLoading(false);
    }
  }, [t.workouts.loadError]);

  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: loadWorkouts,
    containerRef,
  });

  // Фильтры
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Перезагружаем при каждом навигировании на страницу (location.key меняется при каждом переходе)
  useEffect(() => {
    loadWorkouts();
  }, [location.key, loadWorkouts]);

  // Вспомогательные функции
  const calculateVolume = (workout: Workout): number => {
    return workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((exTotal, set) => {
        return set.completed ? exTotal + (set.weight || 0) * (set.reps || 0) : exTotal;
      }, 0);
    }, 0);
  };

  // Подсчет подходов
  const countSets = (workout: Workout): number => {
    return workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  };

  // Форматирование названия месяца
  const formatMonthYear = (monthKey: string): string => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  };

  // Фильтрация тренировок
  const filteredWorkouts = useMemo(() => {
    let filtered = [...allWorkouts];

    // Фильтр по периоду
    if (filterPeriod !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filterPeriod) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(w => new Date(w.date) >= filterDate);
    }

    // Фильтр по поиску
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(query) ||
        w.exercises.some(ex => ex.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [allWorkouts, filterPeriod, searchQuery]);

  // Группировка по месяцам
  const groupedWorkouts = useMemo(() => {
    const groups: { [key: string]: Workout[] } = {};
    
    filteredWorkouts.forEach(workout => {
      const date = new Date(workout.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(workout);
    });
    
    return groups;
  }, [filteredWorkouts]);

  // Статистика за период
  const periodStats = useMemo(() => {
    const totalWorkouts = filteredWorkouts.length;
    const totalVolume = filteredWorkouts.reduce((sum, w) => sum + calculateVolume(w), 0);
    const totalSets = filteredWorkouts.reduce((sum, w) => sum + countSets(w), 0);
    const totalExercises = filteredWorkouts.reduce((sum, w) => sum + w.exercises.length, 0);
    
    return { totalWorkouts, totalVolume, totalSets, totalExercises };
  }, [filteredWorkouts]);

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Проверяем, нужно ли спрашивать подтверждение
    const skipConfirmation = localStorage.getItem('workout-delete-no-confirm') === 'true';
    
    if (skipConfirmation) {
      // Удаляем сразу без подтверждения
      try {
        await workoutsApi.delete(id);
        setAllWorkouts(allWorkouts.filter(w => w.id !== id));
        toast.success(t.workouts.deleted);
        setShowDetailModal(false);
        setSelectedWorkout(null);
      } catch (err) {
        console.error('Delete error:', err);
        toast.error('Ошибка удаления');
      }
    } else {
      // Показываем кастомное окно подтверждения
      setWorkoutToDelete(id);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!workoutToDelete) return;
    
    // Сохраняем настройку "больше не спрашивать"
    if (dontAskAgain) {
      localStorage.setItem('workout-delete-no-confirm', 'true');
    }
    
    // Удаляем тренировку
    try {
      await workoutsApi.delete(workoutToDelete);
      setAllWorkouts(allWorkouts.filter(w => w.id !== workoutToDelete));
      toast.success(t.workouts.deleted);
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Ошибка удаления');
    }
    
    // Закрываем модалки
    setShowDeleteModal(false);
    setShowDetailModal(false);
    setSelectedWorkout(null);
    setWorkoutToDelete(null);
    setDontAskAgain(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setWorkoutToDelete(null);
    setDontAskAgain(false);
  };

  const handleSwipeDelete = async (id: string) => {
    setSwipedId(null);
    setDragState(null);
    try {
      await workoutsApi.delete(id);
      setAllWorkouts(prev => prev.filter(w => w.id !== id));
      toast.success(t.workouts.deleted);
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Ошибка удаления');
    }
  };

  const onSwipeTouchStart = (id: string, e: React.TouchEvent) => {
    if (swipedId && swipedId !== id) {
      setSwipedId(null);
      touchData.current = null;
      return;
    }
    touchData.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, id };
  };

  const onSwipeTouchMove = (id: string, e: React.TouchEvent) => {
    if (!touchData.current || touchData.current.id !== id) return;
    if (swipedId === id) return;
    const dx = e.touches[0].clientX - touchData.current.x;
    const dy = Math.abs(e.touches[0].clientY - touchData.current.y);
    if (dx < 0 && Math.abs(dx) > dy) {
      setDragState({ id, offset: Math.max(dx, -72) });
    }
  };

  const onSwipeTouchEnd = (id: string) => {
    if (!touchData.current || touchData.current.id !== id) {
      touchData.current = null;
      return;
    }
    const currentOffset = dragState?.id === id ? dragState.offset : 0;
    if (currentOffset < -60) {
      setSwipedId(id);
    }
    setDragState(null);
    touchData.current = null;
  };

  const handleWorkoutClick = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowDetailModal(true);
  };

  const handleRepeatWorkout = async () => {
    if (!selectedWorkout) return;
    
    // Создаем копию тренировки без _id полей (MongoDB сам сгенерирует)
    const workoutData = {
      name: selectedWorkout.name,
      date: new Date(),
      status: 'in-progress' as const,
      notes: selectedWorkout.notes,
      dayOfWeek: selectedWorkout.dayOfWeek,
      exercises: selectedWorkout.exercises.map(ex => ({
        name: ex.name,
        category: ex.category,
        type: ex.type,
        equipment: ex.equipment,
        targetMuscles: ex.targetMuscles,
        sets: ex.sets.map(set => ({
          weight: set.weight,
          reps: set.reps,
          restTime: set.restTime,
          rpe: set.rpe,
          completed: false,
        })),
      })),
    };

    try {
      const saved = await workoutsApi.create(workoutData);
      setShowDetailModal(false);
      navigate('/active-workout', { state: { workout: saved } });
    } catch (err) {
      console.error('Repeat error:', err);
    }
  };

  // Периоды для фильтра
  const filterPeriods: { value: FilterPeriod; label: string }[] = [
    { value: 'week', label: t.workouts.week },
    { value: 'month', label: t.workouts.month },
    { value: 'year', label: t.workouts.year },
    { value: 'all', label: t.workouts.all },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-8 overflow-auto">
      {/* Pull-to-refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="flex items-center justify-center transition-all"
          style={{ height: pullDistance }}
        >
          <div
            className={`w-6 h-6 border-2 border-[#7c3aed] border-t-transparent rounded-full ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={!isRefreshing ? { transform: `rotate(${pullDistance * 4}deg)` } : undefined}
          />
        </div>
      )}
      <div className="max-w-[480px] mx-auto px-5">
        {/* Header */}
        <header className="pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.workouts.title}</h1>
          </div>
          <button
            onClick={() => {
              setIsLoading(true);
              setLoadError(null);
              loadWorkouts();
            }}
            className="text-[#7c3aed] text-sm font-medium"
          >
            ↻
          </button>
        </header>

        {/* Состояния загрузки / ошибки */}
        {isLoading && !isRefreshing && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {loadError && !isLoading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4 text-center">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-2">{t.workouts.loadError}: {loadError}</p>
            <button
              onClick={() => loadWorkouts()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
            >
              {t.workouts.retry}
            </button>
          </div>
        )}

        {/* Фильтры */}
        <div className="space-y-3 mb-5">
          {/* Поиск */}
          <Input
            type="text"
            placeholder={t.workouts.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 text-base"
          />

          {/* Кнопки периодов */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterPeriods.map((period) => (
              <button
                key={period.value}
                onClick={() => setFilterPeriod(period.value)}
                className={`px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all text-sm ${
                  filterPeriod === period.value
                    ? 'bg-[#7c3aed] text-white shadow-lg shadow-[#9333ea]/50'
                    : 'bg-white dark:bg-[#16213e] text-[#7c3aed] hover:bg-[#f3e8ff] dark:hover:bg-[#1a1a2e] border-2 border-[#9333ea]'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Статистика за период */}
        {filteredWorkouts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Card padding="sm" className="text-center bg-white border-2 border-[#9333ea]">
              <div className="text-2xl font-bold text-[#7c3aed]">
                {periodStats.totalWorkouts}
              </div>
              <div className="text-xs text-[#7c3aed]/70 mt-1 font-medium">
                {t.workouts.totalWorkouts}
              </div>
            </Card>
            
            <Card padding="sm" className="text-center bg-white border-2 border-[#9333ea]">
              <div className="text-2xl font-bold text-[#7c3aed]">
                {periodStats.totalVolume.toFixed(0)}
              </div>
              <div className="text-xs text-[#7c3aed]/70 mt-1 font-medium">
                {t.workouts.totalVolume}
              </div>
            </Card>

            <Card padding="sm" className="text-center bg-white border-2 border-[#9333ea]">
              <div className="text-2xl font-bold text-[#7c3aed]">
                {periodStats.totalSets}
              </div>
              <div className="text-xs text-[#7c3aed]/70 mt-1 font-medium">
                {t.workouts.sets}
              </div>
            </Card>

            <Card padding="sm" className="text-center bg-white border-2 border-[#9333ea]">
              <div className="text-2xl font-bold text-[#7c3aed]">
                {periodStats.totalExercises}
              </div>
              <div className="text-xs text-[#7c3aed]/70 mt-1 font-medium">
                {t.workouts.exercises}
              </div>
            </Card>
          </div>
        )}

        {/* Список тренировок */}
        <div className="mt-5">
          {filteredWorkouts.length === 0 ? (
            <Card padding="lg" className="text-center shadow-sm">
              <div className="py-12">
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-[#9333ea] opacity-60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <p className="text-lg text-primary-700 mb-2 font-medium">
                  {searchQuery ? t.workouts.nothingFound : t.workouts.noWorkouts}
                </p>
                <p className="text-sm text-primary-500 mb-6">
                  {searchQuery ? t.workouts.nothingFoundHint : t.workouts.addFirst}
                </p>
                {!searchQuery && (
                  <Button variant="primary" size="lg" className="h-14" onClick={() => navigate('/exercises')}>
                    {t.workouts.noWorkoutsDesc}
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-8 animate-stagger">
              {Object.entries(groupedWorkouts)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([monthKey, monthWorkouts]) => (
                  <div key={monthKey}>
                    {/* Заголовок месяца */}
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                        {formatMonthYear(monthKey)}
                      </h2>
                      <div className="text-sm text-primary-500">
                        {monthWorkouts.length} {monthWorkouts.length === 1 ? t.workouts.workout1 : t.workouts.workoutsMany}
                      </div>
                    </div>

                    {/* Тренировки месяца */}
                    <div className="space-y-2">
                      {monthWorkouts.map(workout => {
                        const volume = calculateVolume(workout);
                        
                        // Получаем уникальные группы мышц
                        const muscleGroups = [...new Set(
                          workout.exercises.map(ex => ex.category)
                        )].slice(0, 3); // Показываем максимум 3

                        const isDragging = dragState?.id === workout.id;
                        const isOpen = swipedId === workout.id;
                        const translateX = isDragging ? (dragState?.offset ?? 0) : isOpen ? -72 : 0;

                        return (
                          <div
                            key={workout.id}
                            className="relative overflow-hidden rounded-xl"
                            onTouchStart={(e) => onSwipeTouchStart(workout.id, e)}
                            onTouchMove={(e) => onSwipeTouchMove(workout.id, e)}
                            onTouchEnd={() => onSwipeTouchEnd(workout.id)}
                          >
                            {/* Кнопка удаления (за карточкой) */}
                            <div className="absolute right-0 inset-y-0 w-[72px] flex items-center justify-center bg-red-500 rounded-r-xl">
                              <button
                                onClick={() => handleSwipeDelete(workout.id)}
                                className="flex flex-col items-center justify-center gap-1 text-white w-full h-full"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="text-xs font-medium">Удалить</span>
                              </button>
                            </div>

                            {/* Карточка тренировки */}
                            <div style={{ transform: `translateX(${translateX}px)`, transition: isDragging ? 'none' : 'transform 0.2s ease' }}>
                              <Card 
                                padding="sm" 
                                variant="interactive"
                                onClick={() => {
                                  if (isOpen) { setSwipedId(null); return; }
                                  handleWorkoutClick(workout);
                                }}
                                className="hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  {/* Левая часть - название и дата */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      {/* Группы мышц эмодзи */}
                                      <div className="flex gap-1">
                                        {muscleGroups.map((cat, idx) => (
                                          <CategoryIcon key={idx} category={cat} />
                                        ))}
                                      </div>
                                      
                                      <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                        {workout.name}
                                      </h3>
                                      
                                      {workout.status === 'completed' && (
                                        <span className="text-success-600 text-sm">✓</span>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center gap-3 text-xs text-primary-500">
                                      <span>{formatDate(new Date(workout.date))}</span>
                                      <span>•</span>
                                      <span>{workout.exercises.length} {t.workouts.exercisesShort}</span>
                                      {volume > 0 && (
                                        <>
                                          <span>•</span>
                                          <span>{volume.toFixed(0)} {t.home.kg}</span>
                                        </>
                                      )}
                                      {workout.duration && (
                                        <>
                                          <span>•</span>
                                          <span>{workout.duration} {t.workouts.min}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Кнопка удалить (desktop) */}
                                  <button
                                    onClick={(e) => handleDelete(workout.id, e)}
                                    className="p-1.5 text-primary-600 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors flex-shrink-0"
                                    aria-label={t.common.delete}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </Card>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Workout Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedWorkout(null);
        }}
        title={selectedWorkout?.name || t.workouts.detailsTitle}
      >
        {selectedWorkout && (
          <div className="space-y-4">
            {/* Информация о тренировке */}
            <div className="bg-white dark:bg-[#16213e] rounded-2xl p-4 border-2 border-primary-500">
              <div className="text-sm text-primary-600 mb-1">
                {formatDate(new Date(selectedWorkout.date))}
              </div>
              {selectedWorkout.duration && (
                <div className="text-sm text-primary-600">
                  {t.workouts.durationLabel}: {selectedWorkout.duration} {t.workouts.min}
                </div>
              )}
            </div>

            {/* Упражнения */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {selectedWorkout.exercises.map((exercise, idx) => {
                const exerciseVolume = exercise.sets.reduce(
                  (sum, set) => sum + (set.completed ? set.weight * set.reps : 0),
                  0
                );

                return (
                  <Card key={idx} padding="sm">
                    <div className="flex items-center gap-2 mb-2">
                      <CategoryIcon category={exercise.category} />
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {exercise.name}
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      {exercise.sets.map((set, setIdx) => (
                        <div 
                          key={setIdx}
                          className="flex justify-between items-center text-primary-500"
                        >
                          <span>{t.workouts.setLabel} {setIdx + 1}:</span>
                          <span className={set.completed ? 'text-gray-900 dark:text-white' : ''}>
                            {set.weight} {t.home.kg} × {set.reps} {set.completed ? '✓' : ''}
                          </span>
                        </div>
                      ))}
                    </div>

                    {exerciseVolume > 0 && (
                      <div className="mt-2 pt-2 border-t border-primary-500 text-xs text-primary-600">
                        {t.workouts.tonnageLabel}: {exerciseVolume} {t.home.kg}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Общая статистика */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-white dark:bg-[#16213e] rounded-2xl border-2 border-primary-500">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#7c3aed]">
                  {calculateVolume(selectedWorkout)}
                </div>
                <div className="text-xs text-[#7c3aed]/70 mt-1 font-medium">
                  {t.workouts.totalTonnage}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#7c3aed]">
                  {countSets(selectedWorkout)}
                </div>
                <div className="text-xs text-[#7c3aed]/70 mt-1 font-medium">
                  {t.workouts.totalSets}
                </div>
              </div>
            </div>

            {/* Действия */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                onClick={handleRepeatWorkout}
                className="flex-1"
              >
                {t.workouts.repeatWorkout}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete(selectedWorkout.id)}
                className="flex-shrink-0"
              >
                🗑️
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title={t.workouts.deleteWorkout}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            {t.workouts.deleteConfirm}
          </p>
          
          {/* Чекбокс "больше не спрашивать" */}
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <input
              type="checkbox"
              checked={dontAskAgain}
              onChange={(e) => setDontAskAgain(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-[#9333ea] text-[#9333ea] focus:ring-[#9333ea] cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{t.workouts.dontAskAgain}</span>
          </label>

          {/* Кнопки действий */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={cancelDelete}
              className="flex-1"
            >
              {t.common.cancel}
            </Button>
            <Button
              variant="primary"
              onClick={confirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {t.common.delete}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
