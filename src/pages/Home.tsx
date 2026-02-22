import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { scheduleService } from '@/services/schedule';
import type { ScheduledWorkout } from '@/types/workout';

export const Home = () => {
  const navigate = useNavigate();
  const [todayWorkouts, setTodayWorkouts] = useState<ScheduledWorkout[]>([]);

  useEffect(() => {
    // Загружаем запланированные тренировки
    const workouts = scheduleService.getTodayWorkouts();
    
    // Если тренировок нет, создаем примеры для демонстрации
    if (workouts.length === 0) {
      scheduleService.createSampleWorkouts();
      setTodayWorkouts(scheduleService.getTodayWorkouts());
    } else {
      setTodayWorkouts(workouts);
    }
  }, []);

  // Получаем текущее время
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  // Получаем текущую неделю с датами
  const getWeekDays = () => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    
    return days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + index);
      return {
        day,
        date: date.getDate(),
        isToday: date.toDateString() === today.toDateString()
      };
    });
  };

  const weekDays = getWeekDays();

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-[480px] mx-auto px-5">
        {/* Статус бар - время слева вверху */}
        <div className="pt-3 pb-2 flex items-center justify-between text-sm text-gray-500">
          <span className="font-light">{getCurrentTime()}</span>
          <div className="flex items-center gap-1">
            <span className="text-xs">LTE</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
        </div>

        {/* Заголовок "Сегодня" */}
        <header className="pt-4 pb-6">
          <h1 className="text-4xl font-bold text-black">Сегодня</h1>
        </header>

        {/* Календарь недели */}
        <div className="mb-8">
          {/* Дни недели */}
          <div className="flex justify-between items-center mb-2">
            {weekDays.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-sm text-gray-500 font-normal">{item.day}</span>
              </div>
            ))}
          </div>
          
          {/* Даты */}
          <div className="flex justify-between items-center">
            {weekDays.map((item, index) => (
              <div key={index} className="flex items-center justify-center">
                <div 
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg ${
                    item.isToday 
                      ? 'bg-[#9333ea] text-white' 
                      : 'text-black'
                  }`}
                >
                  {item.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Список запланированных тренировок */}
        <div className="space-y-4">
          {todayWorkouts.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-24">
              <p className="text-center text-gray-400 text-base px-10 leading-relaxed">
                На сегодня нет запланированных тренировок
              </p>
            </div>
          ) : (
            todayWorkouts.map((workout) => (
              <div
                key={workout.id}
                className={`rounded-2xl p-4 border-2 transition-all ${
                  workout.completed
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-white border-[#9333ea]'
                }`}
              >
                {/* Заголовок тренировки */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-black">{workout.name}</h3>
                  {workout.completed && (
                    <span className="text-green-600 text-xl">✓</span>
                  )}
                </div>

                {/* Список упражнений */}
                <div className="space-y-2">
                  {workout.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {exercise.category === 'chest' && '💪'}
                          {exercise.category === 'back' && '🦾'}
                          {exercise.category === 'legs' && '🦵'}
                          {exercise.category === 'arms' && '💪'}
                          {exercise.category === 'shoulders' && '🏋️'}
                          {exercise.category === 'cardio' && '🏃'}
                          {exercise.category === 'core' && '🔥'}
                          {exercise.category === 'other' && '⚡'}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {exercise.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {exercise.sets} × {exercise.reps}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Кнопка начать тренировку */}
                {!workout.completed && (
                  <button
                    onClick={() => {
                      scheduleService.markAsCompleted(workout.id);
                      setTodayWorkouts(scheduleService.getTodayWorkouts());
                    }}
                    className="mt-4 w-full py-3 bg-[#9333ea] text-white rounded-xl font-semibold hover:bg-[#7c3aed] transition-colors"
                  >
                    Начать тренировку
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Большая круглая кнопка + внизу по центру */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center z-50">
        <button
          onClick={() => navigate('/exercises')}
          className="w-16 h-16 bg-[#9333ea] rounded-full flex items-center justify-center shadow-lg hover:bg-[#7c3aed] transition-colors"
          aria-label="Добавить тренировку"
        >
          <svg className="w-8 h-8 text-white font-bold" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};
