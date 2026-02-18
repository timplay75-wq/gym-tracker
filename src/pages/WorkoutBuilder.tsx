import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Modal } from '@/components';
import { generateId } from '@/utils/helpers';
import { storageService } from '@/services/storage';
import type { Workout, Exercise, Set, DayOfWeek } from '@/types';
import { MUSCLE_GROUPS, DETAILED_EXERCISES, type MuscleGroupKey } from '@/utils/muscleGroups';

// Категории для фильтрации
const FILTER_CATEGORIES = {
  all: { name: 'Все', emoji: '💪' },
  chest: { name: 'Грудь', emoji: '💪' },
  back: { name: 'Спина', emoji: '🦾' },
  arms: { name: 'Руки', emoji: '💪' },
  shoulders: { name: 'Плечи', emoji: '🏋️' },
  legs: { name: 'Ноги', emoji: '🦵' },
  core: { name: 'Пресс', emoji: '🔥' },
} as const;

type FilterCategory = keyof typeof FILTER_CATEGORIES;

export const WorkoutBuilder = () => {
  const navigate = useNavigate();
  
  // Форма тренировки
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | ''>('');
  
  // Упражнения
  const [exercises, setExercises] = useState<Exercise[]>([]);
  
  // Модальное окно добавления упражнения
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация упражнений
  const filteredExercises = DETAILED_EXERCISES.filter(ex => {
    const muscleGroup = MUSCLE_GROUPS[ex.muscleGroup as MuscleGroupKey];
    const matchesCategory = selectedCategory === 'all' || muscleGroup.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      muscleGroup.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Добавление упражнения
  const handleAddExercise = (exerciseName: string, muscleGroupKey: MuscleGroupKey) => {
    const muscleGroup = MUSCLE_GROUPS[muscleGroupKey];
    const newExercise: Exercise = {
      id: generateId(),
      name: exerciseName,
      category: muscleGroup.category,
      type: 'strength',
      sets: [],
      targetMuscles: [muscleGroup.name],
    };
    setExercises([...exercises, newExercise]);
    setIsAddExerciseOpen(false);
    setSearchQuery('');
  };

  // Удаление упражнения
  const handleRemoveExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  // Добавление подхода к упражнению
  const handleAddSet = (exerciseId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet: Set = {
          id: generateId(),
          reps: lastSet?.reps || 10,
          weight: lastSet?.weight || 0,
          completed: false,
          restTime: lastSet?.restTime || 90,
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      }
      return ex;
    }));
  };

  // Обновление подхода
  const handleUpdateSet = (exerciseId: string, setId: string, field: keyof Set, value: number | boolean) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(set => 
            set.id === setId ? { ...set, [field]: value } : set
          ),
        };
      }
      return ex;
    }));
  };

  // Удаление подхода
  const handleRemoveSet = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets.filter(set => set.id !== setId) };
      }
      return ex;
    }));
  };

  // Сохранение тренировки
  const handleSaveWorkout = () => {
    if (!workoutName.trim()) {
      alert('Введите название тренировки');
      return;
    }

    const workout: Workout = {
      id: generateId(),
      name: workoutName,
      date: new Date(workoutDate),
      exercises,
      status: 'planned',
      notes: workoutNotes,
      dayOfWeek: dayOfWeek || undefined,
    };

    storageService.saveWorkout(workout);
    navigate('/workouts');
  };

  // Начать тренировку
  const handleStartWorkout = () => {
    if (!workoutName.trim()) {
      alert('Введите название тренировки');
      return;
    }

    const workout: Workout = {
      id: generateId(),
      name: workoutName,
      date: new Date(workoutDate),
      exercises,
      status: 'in-progress',
      notes: workoutNotes,
      dayOfWeek: dayOfWeek || undefined,
    };

    navigate('/active-workout', { state: { workout } });
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-6 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
              Новая тренировка
            </h1>
            <p className="text-[#7c3aed]">
              Добавьте упражнения и настройте подходы
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#e9d5ff] rounded-lg transition-colors"
            aria-label="Назад"
          >
            <svg className="w-6 h-6 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Форма тренировки */}
        <Card className="mb-4" padding="lg">
          <div className="space-y-4">
            <Input
              label="Название тренировки"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Например: Грудь и трицепс"
              required
              autoFocus
            />

          <Input
            label="Дата"
            type="date"
            value={workoutDate}
            onChange={(e) => setWorkoutDate(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-[#6d28d9] mb-2">
              День недели (опционально)
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek | '')}
              className="w-full px-4 py-2 border-2 border-[#9333ea] rounded-lg focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] bg-white text-gray-900"
            >
              <option value="">Не выбрано</option>
              <option value="monday">Понедельник</option>
              <option value="tuesday">Вторник</option>
              <option value="wednesday">Среда</option>
              <option value="thursday">Четверг</option>
              <option value="friday">Пятница</option>
              <option value="saturday">Суббота</option>
              <option value="sunday">Воскресенье</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6d28d9] mb-2">
              Заметки (опционально)
            </label>
            <textarea
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              placeholder="Дополнительная информация о тренировке..."
              rows={3}
              className="w-full px-4 py-2 border-2 border-[#9333ea] rounded-lg focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] bg-white text-gray-900 placeholder-[#9333ea] resize-none"
            />
            </div>
          </div>
        </Card>

        {/* Список упражнений */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Упражнения ({exercises.length})
          </h2>
        </div>

        {exercises.length === 0 ? (
          <Card className="text-center py-8">
            <div className="text-[#9333ea] mb-4">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="font-medium">Упражнений пока нет</p>
              <p className="text-sm mt-1">Нажмите кнопку ниже, чтобы добавить</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <Card key={exercise.id} className="relative">
                {/* Шапка упражнения */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e9d5ff] text-[#6d28d9] font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {exercise.name}
                      </h3>
                      {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                        <span className="text-xs text-[#9333ea]">
                          {exercise.targetMuscles[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveExercise(exercise.id)}
                    className="p-2 text-[#c4b5fd] hover:text-error-600 transition-colors"
                    aria-label="Удалить упражнение"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Подходы */}
                {exercise.sets.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-[#7c3aed] px-1">
                      <div className="col-span-1">№</div>
                      <div className="col-span-4">Вес (кг)</div>
                      <div className="col-span-3">Повт.</div>
                      <div className="col-span-3">Отдых (с)</div>
                      <div className="col-span-1"></div>
                    </div>
                    {exercise.sets.map((set, setIndex) => (
                      <div key={set.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-1 text-sm font-medium text-[#7c3aed]">
                          {setIndex + 1}
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={set.weight || ''}
                            onChange={(e) => handleUpdateSet(exercise.id, set.id, 'weight', Number(e.target.value))}
                            className="w-full px-2 py-1.5 text-sm border-2 border-[#9333ea] rounded bg-white text-gray-900"
                            placeholder="0"
                            min="0"
                            step="2.5"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={set.reps || ''}
                            onChange={(e) => handleUpdateSet(exercise.id, set.id, 'reps', Number(e.target.value))}
                            className="w-full px-2 py-1.5 text-sm border-2 border-[#9333ea] rounded bg-white text-gray-900"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={set.restTime || ''}
                            onChange={(e) => handleUpdateSet(exercise.id, set.id, 'restTime', Number(e.target.value))}
                            className="w-full px-2 py-1.5 text-sm border-2 border-[#9333ea] rounded bg-white text-gray-900"
                            placeholder="90"
                            min="0"
                            step="15"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveSet(exercise.id, set.id)}
                          className="col-span-1 text-[#7c3aed] hover:text-error-600"
                          aria-label="Удалить подход"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Кнопка добавления подхода */}
                <button
                  onClick={() => handleAddSet(exercise.id)}
                  className="w-full py-2 border-2 border-dashed border-[#9333ea] rounded-lg text-[#7c3aed] hover:border-[#7c3aed] hover:text-[#6d28d9] hover:bg-[#e9d5ff] transition-colors text-sm font-medium"
                >
                  + Добавить подход
                </button>
              </Card>
            ))}
          </div>
        )}

        {/* Кнопка добавления упражнения */}
        <button
          onClick={() => setIsAddExerciseOpen(true)}
          className="w-full mt-3 py-3 bg-[#9333ea] hover:bg-[#7c3aed] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Добавить упражнение
        </button>
      </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-[#9333ea] p-4 shadow-lg z-40">
          <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSaveWorkout}
              disabled={!workoutName.trim()}
              className="w-full"
            >
              💾 Сохранить
            </Button>
          </div>
          {exercises.length > 0 && (
            <button
              onClick={handleStartWorkout}
              disabled={!workoutName.trim()}
              className="w-full mt-2 py-3 bg-gradient-to-r from-[#16a34a] to-[#15803d] hover:from-[#15803d] hover:to-[#166534] disabled:from-[#ddd6fe] disabled:to-[#ddd6fe] disabled:text-[#c4b5fd] text-white rounded-lg font-semibold transition-all shadow-lg"
            >
              🚀 Начать тренировку
            </button>
          )}
        </div>
      </div>

      {/* Модальное окно добавления упражнения */}
      <Modal
        isOpen={isAddExerciseOpen}
        onClose={() => {
          setIsAddExerciseOpen(false);
          setSearchQuery('');
        }}
        title="Добавить упражнение"
      >
        {/* Поиск */}
        <div className="mb-4">
          <Input
            placeholder="Поиск упражнения..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>

        {/* Категории (табы) */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {Object.entries(FILTER_CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as FilterCategory)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === key
                  ? 'bg-[#9333ea] text-white'
                  : 'bg-[#e9d5ff] text-[#6d28d9] hover:bg-[#ddd6fe]'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Список упражнений */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-[#9333ea]">
              Упражнения не найдены
            </div>
          ) : (
            filteredExercises.map((exercise) => {
              const muscleGroup = MUSCLE_GROUPS[exercise.muscleGroup as MuscleGroupKey];
              return (
                <button
                  key={exercise.id}
                  onClick={() => handleAddExercise(exercise.name, exercise.muscleGroup as MuscleGroupKey)}
                  className="w-full p-3 text-left rounded-lg border-2 border-[#9333ea] hover:border-[#7c3aed] hover:bg-[#e9d5ff] transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{muscleGroup.emoji}</span>
                        <div className="font-medium text-gray-900 group-hover:text-[#6d28d9]">
                          {exercise.name}
                        </div>
                      </div>
                      <div className="text-xs text-[#9333ea] mt-0.5 ml-7">
                        {muscleGroup.name} • {exercise.equipment}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-[#c4b5fd] group-hover:text-[#7c3aed] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
              );
            })
          )}
          </div>
        </Modal>
      </div>
    </div>
  );
};
