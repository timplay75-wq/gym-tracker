import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Button, Card } from '../components';

export const Home = () => {
  const { isDark, toggleTheme } = useTheme();

  // Mock data - в будущем будет из API/localStorage
  const todayWorkout = {
    name: 'Грудь и трицепс',
    exercises: 6,
    estimatedTime: 60,
  };

  const stats = {
    weekWorkouts: 4,
    monthTonnage: 12500,
    currentProgram: 'Push/Pull/Legs',
    streak: 7,
  };

  const recentWorkouts = [
    { id: 1, name: 'Спина и бицепс', date: '2026-02-02', duration: 55 },
    { id: 2, name: 'Ноги', date: '2026-02-01', duration: 70 },
    { id: 3, name: 'Грудь и трицепс', date: '2026-01-31', duration: 60 },
    { id: 4, name: 'Плечи и пресс', date: '2026-01-30', duration: 45 },
    { id: 5, name: 'Спина', date: '2026-01-29', duration: 50 },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Сегодня';
    if (date.toDateString() === yesterday.toDateString()) return 'Вчера';

    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-gray-900 pb-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-6 pb-4 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-bold text-text-light-primary dark:text-white mb-1">
              Главная
            </h1>
            <p className="text-sm text-text-light-secondary dark:text-gray-400 capitalize">
              {getCurrentDate()}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Переключить тему"
          >
            {isDark ? (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </header>

        <div className="space-y-6 mt-6">
          {/* Today's Workout Card */}
          <Card variant="default" padding="lg" className="animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-medium text-text-light-secondary dark:text-gray-400 uppercase tracking-wider mb-1">
                  Тренировка на сегодня
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-light-primary dark:text-white">
                  {todayWorkout.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm text-text-light-secondary dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span>{todayWorkout.exercises} упражнений</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>~{todayWorkout.estimatedTime} мин</span>
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full">
              Начать тренировку
            </Button>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Card variant="default" padding="md" className="animate-fade-in">
              <p className="text-xs text-text-light-secondary dark:text-gray-400 mb-1">
                За неделю
              </p>
              <p className="text-3xl font-bold text-text-light-primary dark:text-white">
                {stats.weekWorkouts}
              </p>
              <p className="text-xs text-success-600 dark:text-success-400 mt-1">+2 от прошлой</p>
            </Card>

            <Card variant="default" padding="md" className="animate-fade-in">
              <p className="text-xs text-text-light-secondary dark:text-gray-400 mb-1">
                Тоннаж/месяц
              </p>
              <p className="text-3xl font-bold text-text-light-primary dark:text-white">
                {(stats.monthTonnage / 1000).toFixed(1)}т
              </p>
              <p className="text-xs text-success-600 dark:text-success-400 mt-1">+15%</p>
            </Card>

            <Card variant="default" padding="md" className="animate-fade-in">
              <p className="text-xs text-text-light-secondary dark:text-gray-400 mb-1">
                Программа
              </p>
              <p className="text-lg font-semibold text-text-light-primary dark:text-white">
                {stats.currentProgram}
              </p>
            </Card>

            <Card variant="default" padding="md" className="animate-fade-in">
              <p className="text-xs text-text-light-secondary dark:text-gray-400 mb-1">
                Streak
              </p>
              <p className="text-3xl font-bold text-text-light-primary dark:text-white">
                {stats.streak} 🔥
              </p>
            </Card>
          </div>

          {/* Recent Workouts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-text-light-primary dark:text-white">
                Последние тренировки
              </h2>
              <Link
                to="/workouts"
                className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Все
              </Link>
            </div>

            <div className="space-y-2">
              {recentWorkouts.map((workout) => (
                <Card
                  key={workout.id}
                  variant="interactive"
                  padding="md"
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-light-primary dark:text-white">
                        {workout.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-sm text-text-light-secondary dark:text-gray-400">
                        <span>{formatDate(workout.date)}</span>
                        <span>•</span>
                        <span>{workout.duration} мин</span>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-300 dark:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Link
        to="/add"
        className="fixed bottom-20 right-4 sm:right-6 p-4 rounded-full bg-primary-500 text-white shadow-lg hover:shadow-xl hover:bg-primary-600 active:scale-95 transition-all duration-200 z-40"
        aria-label="Добавить тренировку"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </Link>
    </div>
  );
};
