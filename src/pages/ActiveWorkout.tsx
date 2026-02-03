import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { Button, Card, Modal } from '@/components';
import { storageService } from '@/services/storage';
import type { Workout, Exercise, Set } from '@/types';

// Форматирование времени
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const ActiveWorkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  // Состояние тренировки
  const [workout, setWorkout] = useState<Workout | null>(location.state?.workout || null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  
  // Таймеры
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isWorkoutPaused, setIsWorkoutPaused] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  
  // Completion
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Текущее упражнение и подход
  const currentExercise = workout?.exercises[currentExerciseIndex];
  const currentSet = currentExercise?.sets[currentSetIndex];

  // Временные значения для текущего подхода
  const [tempWeight, setTempWeight] = useState(currentSet?.weight || 0);
  const [tempReps, setTempReps] = useState(currentSet?.reps || 0);

  // Таймер тренировки
  useEffect(() => {
    if (!isWorkoutPaused && !isCompleted && !isResting) {
      const timer = setInterval(() => {
        setWorkoutTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isWorkoutPaused, isCompleted, isResting]);

  // Таймер отдыха
  useEffect(() => {
    if (isResting && restTime > 0) {
      const timer = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            setShowRestTimer(false);
            // Вибрация при окончании отдыха
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isResting, restTime]);

  // Обновление temp значений при смене подхода
  useEffect(() => {
    if (currentSet) {
      setTempWeight(currentSet.weight || 0);
      setTempReps(currentSet.reps || 0);
    }
  }, [currentExerciseIndex, currentSetIndex, currentSet]);

  // Завершение подхода
  const handleCompleteSet = () => {
    if (!workout || !currentExercise) return;

    // Обновляем подход
    const updatedWorkout = { ...workout };
    const exercise = updatedWorkout.exercises[currentExerciseIndex];
    const set = exercise.sets[currentSetIndex];
    
    set.weight = tempWeight;
    set.reps = tempReps;
    set.completed = true;

    setWorkout(updatedWorkout);

    // Вибрация
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Проверяем, есть ли еще подходы в этом упражнении
    if (currentSetIndex < exercise.sets.length - 1) {
      // Переход к следующему подходу
      setCurrentSetIndex(currentSetIndex + 1);
      
      // Запускаем таймер отдыха
      const restTimeSeconds = set.restTime || 90;
      setRestTime(restTimeSeconds);
      setIsResting(true);
      setShowRestTimer(true);
    } else {
      // Это был последний подход в упражнении
      if (currentExerciseIndex < workout.exercises.length - 1) {
        // Переход к следующему упражнению
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSetIndex(0);
      } else {
        // Это была последняя тренировка!
        completeWorkout();
      }
    }
  };

  // Завершение тренировки
  const completeWorkout = () => {
    if (!workout) return;
    
    const completedWorkout: Workout = {
      ...workout,
      status: 'completed',
      duration: Math.floor(workoutTime / 60), // в минутах
    };

    storageService.saveWorkout(completedWorkout);
    setIsCompleted(true);
  };

  // Пропустить отдых
  const handleSkipRest = () => {
    setIsResting(false);
    setRestTime(0);
    setShowRestTimer(false);
  };

  // Добавить время к отдыху
  const handleAddRestTime = (seconds: number) => {
    setRestTime((prev) => prev + seconds);
  };

  // Расчет общего прогресса
  const calculateProgress = (): number => {
    if (!workout) return 0;
    
    let completedSets = 0;
    let totalSets = 0;

    workout.exercises.forEach((exercise, exIndex) => {
      exercise.sets.forEach((set, setIndex) => {
        totalSets++;
        if (
          exIndex < currentExerciseIndex ||
          (exIndex === currentExerciseIndex && setIndex < currentSetIndex) ||
          set.completed
        ) {
          completedSets++;
        }
      });
    });

    return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  };

  // Расчет общего тоннажа
  const calculateTotalVolume = (): number => {
    if (!workout) return 0;
    
    return workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((exTotal, set) => {
        return set.completed ? exTotal + (set.weight || 0) * (set.reps || 0) : exTotal;
      }, 0);
    }, 0);
  };

  // Подсчет завершенных подходов
  const countCompletedSets = (): number => {
    if (!workout) return 0;
    return workout.exercises.reduce(
      (total, exercise) => total + exercise.sets.filter((s) => s.completed).length,
      0
    );
  };

  if (!workout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Тренировка не найдена</p>
          <Button onClick={() => navigate('/')}>На главную</Button>
        </div>
      </div>
    );
  }

  // Completion Screen
  if (isCompleted) {
    const totalVolume = calculateTotalVolume();
    const totalSets = countCompletedSets();
    const estimatedCalories = Math.round(totalVolume * 0.5); // Примерная формула

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-success-50 to-primary-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md w-full animate-scale-in">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Поздравляем!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Тренировка завершена
          </p>

          {/* Статистика */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {formatTime(workoutTime)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Длительность
              </div>
            </Card>

            <Card className="text-center">
              <div className="text-3xl font-bold text-success-600 dark:text-success-400">
                {totalVolume}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Тоннаж (кг)
              </div>
            </Card>

            <Card className="text-center">
              <div className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {totalSets}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Подходов
              </div>
            </Card>

            <Card className="text-center">
              <div className="text-3xl font-bold text-error-600 dark:text-error-400">
                ~{estimatedCalories}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                ккал
              </div>
            </Card>
          </div>

          <Button
            onClick={() => navigate('/')}
            className="w-full py-4 text-lg"
          >
            Завершить
          </Button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen pb-32">
      {/* Header с таймером и прогрессом */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => {
                if (window.confirm('Вы уверены? Прогресс будет потерян.')) {
                  navigate(-1);
                }
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                {formatTime(workoutTime)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {workout.name}
              </div>
            </div>

            <button
              onClick={() => setIsWorkoutPaused(!isWorkoutPaused)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isWorkoutPaused ? (
                <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              )}
            </button>
          </div>

          {/* Прогресс бар */}
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-primary-500 to-success-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
            {Math.round(progress)}% завершено
          </div>
        </div>
      </div>

      {/* Current Exercise */}
      <div className="container mx-auto p-4 pt-6">
        <div className="text-center mb-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Упражнение {currentExerciseIndex + 1} из {workout.exercises.length}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {currentExercise?.name}
          </h2>
        </div>

        {/* Set Tracker */}
        <Card className="mb-6">
          <div className="text-center mb-4">
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Подход {currentSetIndex + 1} из {currentExercise?.sets.length}
            </div>
          </div>

          {/* Предыдущие подходы (история) */}
          {currentSetIndex > 0 && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Предыдущий:</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentExercise?.sets[currentSetIndex - 1].weight} кг × {currentExercise?.sets[currentSetIndex - 1].reps} повт.
              </div>
            </div>
          )}

          {/* Инпуты */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Вес (кг)
              </label>
              <input
                type="number"
                value={tempWeight}
                onChange={(e) => setTempWeight(Number(e.target.value))}
                className="w-full text-center text-3xl font-bold py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                step="2.5"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Повторения
              </label>
              <input
                type="number"
                value={tempReps}
                onChange={(e) => setTempReps(Number(e.target.value))}
                className="w-full text-center text-3xl font-bold py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                min="0"
              />
            </div>
          </div>

          {/* Большая кнопка Complete Set */}
          <button
            onClick={handleCompleteSet}
            disabled={tempWeight === 0 || tempReps === 0}
            className="w-full py-5 bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 disabled:from-gray-400 disabled:to-gray-500 text-white text-xl font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:cursor-not-allowed"
          >
            ✓ Завершить подход
          </button>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (currentExerciseIndex > 0) {
                setCurrentExerciseIndex(currentExerciseIndex - 1);
                setCurrentSetIndex(0);
              }
            }}
            disabled={currentExerciseIndex === 0}
            className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Предыдущее
          </button>

          <button
            onClick={() => {
              if (currentExerciseIndex < workout.exercises.length - 1) {
                setCurrentExerciseIndex(currentExerciseIndex + 1);
                setCurrentSetIndex(0);
              }
            }}
            disabled={currentExerciseIndex === workout.exercises.length - 1}
            className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Следующее →
          </button>
        </div>
      </div>

      {/* Rest Timer Modal */}
      <Modal
        isOpen={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        title="Отдых"
      >
        <div className="text-center py-8">
          <div className="text-7xl font-bold text-primary-600 dark:text-primary-400 mb-6 tabular-nums">
            {formatTime(restTime)}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkipRest}
              className="flex-1"
            >
              Пропустить
            </Button>
            <Button
              onClick={() => handleAddRestTime(30)}
              className="flex-1"
            >
              +30 сек
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
