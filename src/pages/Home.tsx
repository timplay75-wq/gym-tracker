import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components';
import { storageService } from '../services/storage';
import type { Workout } from '../types';

export const Home = () => {
  const navigate = useNavigate();
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState({
    weekWorkouts: 0,
    monthTonnage: 0,
    program: 'PPL',
    points: 7
  });

  useEffect(() => {
    const workouts = storageService.getWorkouts();
    // Сортируем по дате и берем 5 последних
    const sorted = workouts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    setRecentWorkouts(sorted);

    // Подсчитываем статистику
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const weekWorkouts = workouts.filter(w => new Date(w.date) >= weekAgo).length;
    
    const monthTonnage = workouts
      .filter(w => new Date(w.date) >= monthAgo)
      .reduce((total, workout) => {
        return total + workout.exercises.reduce((exTotal, exercise) => {
          return exTotal + exercise.sets.reduce((setTotal, set) => {
            return set.completed ? setTotal + (set.weight || 0) * (set.reps || 0) : setTotal;
          }, 0);
        }, 0);
      }, 0) / 1000; // в тоннах

    setStats({
      weekWorkouts,
      monthTonnage: Math.round(monthTonnage * 10) / 10,
      program: 'PPL',
      points: weekWorkouts * 2 + 1
    });
  }, []);

  // Получаем текущую дату
  const formatGreeting = () => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    const now = new Date();
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
  };

  // Быстрый старт тренировки
  const handleQuickStartWorkout = () => {
    navigate('/add-workout');
  };

  // Данные следующей тренировки
  const todayWorkout = {
    name: 'Грудь и трицепс',
    exercises: 6,
    estimatedTime: 60,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Сегодня';
    if (date.toDateString() === yesterday.toDateString()) return 'Вчера';

    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-[480px] mx-auto px-5">
        {/* Приветствие */}
        <header className="pt-6 pb-4">
          <p className="text-lg font-medium text-[#6d28d9]">
            {formatGreeting()}
          </p>
        </header>

        <div className="space-y-5">
          {/* Карточка текущей тренировки */}
          <div className="bg-gradient-to-br from-[#7c3aed] to-[#9333ea] rounded-2xl p-6 shadow-lg shadow-[#9333ea]/20">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white mb-2">
                {recentWorkouts.length > 0 ? recentWorkouts[0].name : todayWorkout.name}
              </h2>
              <p className="text-sm text-white/80">
                {todayWorkout.exercises} упражнений • {todayWorkout.estimatedTime} минут
              </p>
            </div>
            <Button variant="primary" size="lg" className="w-full h-14 text-base font-semibold !bg-white !text-[#7c3aed] hover:!bg-white/90" onClick={handleQuickStartWorkout}>
              Начать тренировку
            </Button>
          </div>

          {/* Метрики - только 3 самые важные */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 shadow-md text-center border-2 border-[#9333ea]">
              <p className="text-xs text-[#7c3aed]/70 mb-1 font-medium">За неделю</p>
              <p className="text-2xl font-bold text-[#7c3aed]">{stats.weekWorkouts}</p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-md text-center border-2 border-[#9333ea]">
              <p className="text-xs text-[#7c3aed]/70 mb-1 font-medium whitespace-nowrap">Тоннаж</p>
              <p className="text-2xl font-bold text-[#7c3aed]">{stats.monthTonnage}т</p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-md text-center border-2 border-[#9333ea]">
              <p className="text-xs text-[#7c3aed]/70 mb-1 font-medium">Очки</p>
              <p className="text-2xl font-bold text-[#7c3aed]">{stats.points}</p>
            </div>
          </div>

          {/* Последние тренировки */}
          <div>
            <h3 className="text-lg font-bold text-[#6d28d9] mb-3">
              Последние
            </h3>
            {recentWorkouts.length === 0 ? (
              <Card padding="lg" className="text-center shadow-sm">
                <div className="py-6">
                  <p className="text-[#9333ea]">
                    Нет тренировок
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-2">
                {recentWorkouts.slice(0, 3).map((workout) => (
                  <Card
                    key={workout.id}
                    variant="interactive"
                    padding="md"
                    onClick={() => navigate('/workouts')}
                    className="cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {workout.name}
                        </h4>
                        <p className="text-sm text-[#9333ea] mt-0.5">
                          {formatDate(workout.date as unknown as string)}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
