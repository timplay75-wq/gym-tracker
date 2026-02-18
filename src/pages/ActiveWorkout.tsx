import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Modal } from '@/components';
import { storageService } from '@/services/storage';
import type { Workout } from '@/types';

// Форматирование времени
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const ActiveWorkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Завершение подхода (только сохраняет, НЕ переключает)
  const handleCompleteSet = () => {
    if (!workout || !currentExercise) return;

    // Обновляем подход
    const updatedWorkout = { ...workout };
    const exercise = updatedWorkout.exercises[currentExerciseIndex];
    const set = exercise.sets[currentSetIndex];
    
    set.weight = tempWeight;
    set.reps = tempReps;
    set.completed = true;
    set.timestamp = new Date();

    setWorkout(updatedWorkout);
    
    // Сохраняем прогресс
    storageService.saveWorkout(updatedWorkout);

    // Вибрация
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Останавливаем таймер тренировки
    setIsWorkoutPaused(true);
  };

  // Переключение на следующее упражнение
  const handleNextExercise = () => {
    if (!workout) return;
    
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
      setIsWorkoutPaused(false);
    }
  };

  // Закрытие тренировки (сохранение прогресса и выход)
  // Закрытие тренировки (сохранение прогресса и выход)
  const handleCloseWorkout = () => {
    if (!workout) return;
    
    const completedWorkout: Workout = {
      ...workout,
      status: 'completed',
      duration: Math.floor(workoutTime / 60),
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
          <p className="text-[#7c3aed] mb-4">Тренировка не найдена</p>
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-white">
        <div className="text-center max-w-md w-full animate-scale-in">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Отличная работа!
          </h1>
          <p className="text-lg text-[#7c3aed] mb-8">
            Тренировка завершена
          </p>

          {/* Статистика */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
            <Card padding="md" className="text-center border-2 border-[#9333ea]">
              <div className="text-2xl sm:text-3xl font-bold text-[#7c3aed]">
                {formatTime(workoutTime)}
              </div>
              <div className="text-xs sm:text-sm text-[#7c3aed]/70 mt-1">
                Длительность
              </div>
            </Card>

            <Card padding="md" className="text-center border-2 border-[#9333ea]">
              <div className="text-2xl sm:text-3xl font-bold text-[#7c3aed]">
                {totalVolume}
              </div>
              <div className="text-xs sm:text-sm text-[#7c3aed]/70 mt-1">
                Тоннаж (кг)
              </div>
            </Card>

            <Card padding="md" className="text-center border-2 border-[#9333ea]">
              <div className="text-2xl sm:text-3xl font-bold text-[#7c3aed]">
                {totalSets}
              </div>
              <div className="text-xs sm:text-sm text-[#7c3aed]/70 mt-1">
                Подходов
              </div>
            </Card>

            <Card padding="md" className="text-center border-2 border-[#9333ea]">
              <div className="text-2xl sm:text-3xl font-bold text-[#7c3aed]">
                ~{estimatedCalories}
              </div>
              <div className="text-xs sm:text-sm text-[#7c3aed]/70 mt-1">
                ккал
              </div>
            </Card>
          </div>

          <Button
            onClick={() => navigate('/')}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Завершить
          </Button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-8">
      {/* Header с таймером и прогрессом */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-[#9333ea] shadow-sm">
        <div className="max-w-[480px] mx-auto px-5">
          {/* Прогресс */}
          <div className="pt-4 pb-3">
            <div className="flex items-center justify-between text-sm text-[#7c3aed] mb-2">
              <span className="font-medium">{Math.round(progress)}%</span>
              <span className="font-mono">{formatTime(workoutTime)}</span>
            </div>
            <div className="relative h-2.5 bg-[#ddd6fe] rounded-full overflow-hidden border-2 border-[#9333ea]">
              <div
                className="absolute h-full bg-gradient-to-r from-[#7c3aed] to-[#9333ea] transition-all duration-500 shadow-lg"
                style={{ 
                  width: `${progress}%`,
                  boxShadow: '0 0 20px rgba(124, 58, 237, 0.6)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Current Exercise */}
      <div className="max-w-[480px] mx-auto px-5 pt-8">
        {/* Название упражнения */}
        <div className="text-center mb-8">
          <div className="text-base text-[#7c3aed] mb-2 font-medium">
            Упражнение {currentExerciseIndex + 1} из {workout.exercises.length}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {currentExercise?.name}
          </h2>
          <div className="text-sm text-[#9333ea]">
            Подход {currentSetIndex + 1} / {currentExercise?.sets.length}
          </div>
        </div>

        {/* Инпуты для веса и повторений */}
        <div className="bg-white border-2 border-[#9333ea] rounded-2xl p-6 mb-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#7c3aed] mb-2">
              Вес (кг)
            </label>
            <input
              type="number"
              value={tempWeight}
              onChange={(e) => setTempWeight(Number(e.target.value))}
              className="w-full h-20 text-center text-4xl font-bold bg-white border-2 border-[#9333ea] rounded-xl text-gray-900 focus:border-[#7c3aed] focus:outline-none transition-all"
              step="2.5"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#7c3aed] mb-2">
              Повторения
            </label>
            <input
              type="number"
              value={tempReps}
              onChange={(e) => setTempReps(Number(e.target.value))}
              className="w-full h-20 text-center text-4xl font-bold bg-white border-2 border-[#9333ea] rounded-xl text-gray-900 focus:border-[#7c3aed] focus:outline-none transition-all"
              min="0"
            />
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="space-y-3 mb-8">
          <button
            onClick={handleCompleteSet}
            disabled={tempWeight === 0 || tempReps === 0}
            className="w-full h-16 bg-gradient-to-r from-[#7c3aed] to-[#9333ea] hover:from-[#6d28d9] hover:to-[#7c3aed] disabled:bg-[#ddd6fe] disabled:from-[#ddd6fe] disabled:to-[#ddd6fe] disabled:text-[#c4b5fd] text-white text-lg font-bold rounded-xl transition-all shadow-lg shadow-[#7c3aed]/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:shadow-none"
          >
            ✔ Завершить подход
          </button>

          <button
            onClick={handleCloseWorkout}
            className="w-full h-14 text-[#7c3aed] hover:text-[#6d28d9] hover:bg-[#f3e8ff] text-base font-medium transition-all rounded-xl"
          >
            Завершить тренировку
          </button>
        </div>

        {/* Навигация - упрощенная */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => {
              if (currentExerciseIndex > 0) {
                setCurrentExerciseIndex(currentExerciseIndex - 1);
                setCurrentSetIndex(0);
              }
            }}
            disabled={currentExerciseIndex === 0}
            className="flex-1 h-12 bg-[#e9d5ff] hover:bg-[#ddd6fe] rounded-lg font-medium text-[#6d28d9] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNextExercise}
            disabled={currentExerciseIndex === workout.exercises.length - 1}
            className="flex-1 h-12 bg-[#e9d5ff] hover:bg-[#ddd6fe] rounded-lg font-medium text-[#6d28d9] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* История подходов - минимализм */}
        <div className="bg-white border-2 border-[#9333ea] rounded-xl p-4">
          <h3 className="text-xs font-medium text-[#7c3aed] uppercase tracking-wider mb-3">
            Подходы
          </h3>
          <div className="space-y-2">
            {currentExercise?.sets.map((set, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-lg transition-all ${
                  set.completed 
                    ? 'bg-[#7c3aed] text-white border-2 border-[#7c3aed]' 
                    : idx === currentSetIndex 
                    ? 'bg-[#e9d5ff] border-2 border-[#9333ea]'
                    : 'bg-white border-2 border-[#9333ea]'
                }`}
              >
                <span className="text-sm font-medium">{idx + 1}</span>
                {set.completed ? (
                  <span className="text-sm font-medium">
                    {set.weight}×{set.reps}
                  </span>
                ) : (
                  <span className="text-sm text-[#c4b5fd]">—</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rest Timer Modal */}
      <Modal
        isOpen={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        title="Отдых"
      >
        <div className="text-center py-8">
          <div className="text-7xl font-bold text-[#9333ea] mb-6 tabular-nums">
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
              variant="primary"
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
