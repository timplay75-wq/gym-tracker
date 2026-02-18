import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '@/services/storage';
import type { Workout } from '@/types';
import { formatDate } from '@/utils/helpers';
import { Card, Modal, Button, Input } from '@/components';

// Категории мышечных групп с эмодзи
const MUSCLE_CATEGORY_EMOJI: Record<string, string> = {
  chest: '💪',
  back: '🦾', 
  legs: '🦵',
  shoulders: '🏋️',
  arms: '💪',
  core: '🔥',
  cardio: '🏃',
  other: '⚡',
};

type FilterPeriod = 'week' | 'month' | 'year' | 'all';

export const Workouts = () => {
  const navigate = useNavigate();
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Фильтры
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadedWorkouts = storageService.getWorkouts();
    // Сортируем по дате (новые сначала)
    const sorted = loadedWorkouts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setAllWorkouts(sorted);
  }, []);

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

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Удалить эту тренировку?')) {
      storageService.deleteWorkout(id);
      setAllWorkouts(allWorkouts.filter(w => w.id !== id));
      setShowDetailModal(false);
      setSelectedWorkout(null);
    }
  };

  const handleWorkoutClick = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowDetailModal(true);
  };

  const handleRepeatWorkout = () => {
    if (!selectedWorkout) return;
    
    // Создаем копию тренировки
    const newWorkout: Workout = {
      ...selectedWorkout,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
      status: 'in-progress',
      // Сбрасываем completed флаги на подходах
      exercises: selectedWorkout.exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(set => ({ ...set, completed: false }))
      }))
    };

    setShowDetailModal(false);
    navigate('/active-workout', { state: { workout: newWorkout } });
  };

  // Периоды для фильтра
  const filterPeriods: { value: FilterPeriod; label: string }[] = [
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
    { value: 'year', label: 'Год' },
    { value: 'all', label: 'Всё время' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-[480px] mx-auto px-5">
        {/* Header */}
        <header className="pt-6 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Тренировки
          </h1>
        </header>

        {/* Фильтры */}
        <div className="space-y-3 mb-5">
          {/* Поиск */}
          <Input
            type="text"
            placeholder="Поиск тренировок..."
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
                    : 'bg-white text-[#7c3aed] hover:bg-[#f3e8ff] border-2 border-[#9333ea]'
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
                Тренировок
              </div>
            </Card>
            
            <Card padding="sm" className="text-center bg-white border-2 border-[#9333ea]">
              <div className="text-2xl font-bold text-[#7c3aed]">
                {periodStats.totalVolume.toFixed(0)}
              </div>
              <div className="text-xs text-[#7c3aed]/70 mt-1 font-medium">
                Тоннаж (кг)
              </div>
            </Card>

            <Card padding="sm" className="text-center bg-white border-2 border-[#9333ea]">
              <div className="text-2xl font-bold text-[#7c3aed]">
                {periodStats.totalSets}
              </div>
              <div className="text-xs text-[#7c3aed]/70 mt-1 font-medium">
                Подходов
              </div>
            </Card>

            <Card padding="sm" className="text-center bg-white border-2 border-[#9333ea]">
              <div className="text-2xl font-bold text-[#7c3aed]">
                {periodStats.totalExercises}
              </div>
              <div className="text-xs text-[#7c3aed]/70 mt-1 font-medium">
                Упражнений
              </div>
            </Card>
          </div>
        )}

        {/* Список тренировок */}
        <div className="mt-5">
          {filteredWorkouts.length === 0 ? (
            <Card padding="lg" className="text-center shadow-sm">
              <div className="py-12">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-lg text-primary-700 mb-2 font-medium">
                  {searchQuery ? 'Ничего не найдено' : 'Нет завершенных тренировок'}
                </p>
                <p className="text-sm text-primary-500 mb-6">
                  {searchQuery ? 'Попробуйте изменить запрос' : 'Добавьте первую тренировку!'}
                </p>
                {!searchQuery && (
                  <Button variant="primary" size="lg" className="h-14" onClick={() => navigate('/add-workout')}>
                    Создать тренировку
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedWorkouts)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([monthKey, monthWorkouts]) => (
                  <div key={monthKey}>
                    {/* Заголовок месяца */}
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-lg font-semibold text-gray-900 capitalize">
                        {formatMonthYear(monthKey)}
                      </h2>
                      <div className="text-sm text-primary-500">
                        {monthWorkouts.length} {monthWorkouts.length === 1 ? 'тренировка' : 'тренировок'}
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

                        return (
                          <Card 
                            key={workout.id} 
                            padding="sm" 
                            variant="interactive"
                            onClick={() => handleWorkoutClick(workout)}
                            className="hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between gap-3">
                              {/* Левая часть - название и дата */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  {/* Группы мышц эмодзи */}
                                  <div className="flex gap-1 text-lg">
                                    {muscleGroups.map((cat, idx) => (
                                      <span key={idx}>{MUSCLE_CATEGORY_EMOJI[cat] || '⚡'}</span>
                                    ))}
                                  </div>
                                  
                                  <h3 className="text-base font-semibold text-gray-900 truncate">
                                    {workout.name}
                                  </h3>
                                  
                                  {workout.status === 'completed' && (
                                    <span className="text-success-600 text-sm">✓</span>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-3 text-xs text-primary-500">
                                  <span>{formatDate(new Date(workout.date))}</span>
                                  <span>•</span>
                                  <span>{workout.exercises.length} упр.</span>
                                  {volume > 0 && (
                                    <>
                                      <span>•</span>
                                      <span>{volume.toFixed(0)} кг</span>
                                    </>
                                  )}
                                  {workout.duration && (
                                    <>
                                      <span>•</span>
                                      <span>{workout.duration} мин</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {/* Кнопка удалить */}
                              <button
                                onClick={(e) => handleDelete(workout.id, e)}
                                className="p-1.5 text-primary-600 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors flex-shrink-0"
                                aria-label="Удалить"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </Card>
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
        title={selectedWorkout?.name || 'Детали тренировки'}
      >
        {selectedWorkout && (
          <div className="space-y-4">
            {/* Информация о тренировке */}
            <div className="bg-white rounded-2xl p-4 border-2 border-primary-500">
              <div className="text-sm text-primary-600 mb-1">
                {formatDate(new Date(selectedWorkout.date))}
              </div>
              {selectedWorkout.duration && (
                <div className="text-sm text-primary-600">
                  Длительность: {selectedWorkout.duration} мин
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
                      <span className="text-lg">{MUSCLE_CATEGORY_EMOJI[exercise.category] || '⚡'}</span>
                      <div className="font-semibold text-gray-900">
                        {exercise.name}
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      {exercise.sets.map((set, setIdx) => (
                        <div 
                          key={setIdx}
                          className="flex justify-between items-center text-primary-500"
                        >
                          <span>Подход {setIdx + 1}:</span>
                          <span className={set.completed ? 'text-gray-900' : ''}>
                            {set.weight} кг × {set.reps} {set.completed ? '✓' : ''}
                          </span>
                        </div>
                      ))}
                    </div>

                    {exerciseVolume > 0 && (
                      <div className="mt-2 pt-2 border-t border-primary-500 text-xs text-primary-600">
                        Тоннаж: {exerciseVolume} кг
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Общая статистика */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-2xl border-2 border-primary-500">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#7c3aed]">
                  {calculateVolume(selectedWorkout)}
                </div>
                <div className="text-xs text-[#7c3aed]/70 mt-1 font-medium">
                  Общий тоннаж (кг)
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#7c3aed]">
                  {countSets(selectedWorkout)}
                </div>
                <div className="text-xs text-[#7c3aed]/70 mt-1 font-medium">
                  Всего подходов
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
                🔁 Повторить тренировку
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
    </div>
  );
};
