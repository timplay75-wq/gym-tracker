import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/hooks/useDashboard';
import { Play, Plus, Dumbbell, TrendingUp, Calendar, Flame } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const { todayWorkout, recentWorkouts, stats, isLoading, startWorkout } = useDashboard();

  // Получаем текущую дату
  const getFormattedDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('ru-RU', options);
  };

  // Скелетон для загрузки
  const StatCardSkeleton = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
      <div className="h-7 bg-gray-200 rounded w-14"></div>
    </div>
  );

  const WorkoutCardSkeleton = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 pb-24">
      <div className="max-w-[480px] mx-auto px-5">
        {/* Заголовок */}
        <header className="pt-8 pb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Главная</h1>
          <p className="text-gray-500 text-sm capitalize">{getFormattedDate()}</p>
        </header>

        {/* Статистика */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Статистика
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-3 gap-3">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {/* Тренировки за неделю */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <p className="text-xs text-gray-600 font-medium">Неделя</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.weekWorkouts}</p>
              </div>

              {/* Объем за месяц */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell className="w-4 h-4 text-purple-600" />
                  <p className="text-xs text-gray-600 font-medium">Объем</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.monthVolume > 0 ? `${Math.round(stats.monthVolume / 1000)}т` : '0'}
                </p>
              </div>

              {/* Streak */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <p className="text-xs text-gray-600 font-medium">Streak</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
              </div>
            </div>
          )}
        </section>

        {/* Тренировка на сегодня */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Сегодня
          </h2>

          {isLoading ? (
            <WorkoutCardSkeleton />
          ) : todayWorkout ? (
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{todayWorkout.name}</h3>
                  <p className="text-purple-200 text-sm">
                    {todayWorkout.exercises?.length || 0} упражнений
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Dumbbell className="w-6 h-6" />
                </div>
              </div>

              {todayWorkout.status === 'planned' && (
                <button
                  onClick={() => startWorkout(todayWorkout.id)}
                  className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Play className="w-5 h-5" fill="currentColor" />
                  Начать тренировку
                </button>
              )}

              {todayWorkout.status === 'in-progress' && (
                <button
                  onClick={() => navigate(`/workout/${todayWorkout.id}`)}
                  className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Play className="w-5 h-5" fill="currentColor" />
                  Продолжить тренировку
                </button>
              )}

              {todayWorkout.status === 'completed' && (
                <div className="w-full py-3 bg-green-500/20 border-2 border-green-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                  <span className="text-xl">✓</span>
                  Тренировка завершена
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-gray-600 mb-4">На сегодня нет тренировок</p>
              <button
                onClick={() => navigate('/workouts/new')}
                className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Создать тренировку
              </button>
            </div>
          )}
        </section>

        {/* Последние тренировки */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-purple-600" />
              Последние тренировки
            </h2>
            <button
              onClick={() => navigate('/workouts')}
              className="text-purple-600 text-sm font-medium hover:text-purple-700"
            >
              Все →
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : recentWorkouts.length > 0 ? (
            <div className="space-y-3">
              {recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  onClick={() => navigate(`/workout/${workout.id}`)}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-purple-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{workout.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{new Date(workout.date).toLocaleDateString('ru-RU')}</span>
                        {workout.duration && <span>• {workout.duration} мин</span>}
                        {workout.totalVolume && <span>• {Math.round(workout.totalVolume / 1000)}т</span>}
                      </div>
                    </div>
                    <div className="text-green-500 text-xl">✓</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Dumbbell className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">Нет завершенных тренировок</p>
            </div>
          )}
        </section>
      </div>

      {/* Кнопка добавить тренировку */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center z-50">
        <button
          onClick={() => navigate('/workouts/new')}
          className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          aria-label="Добавить тренировку"
        >
          <Plus className="w-8 h-8 text-white font-bold" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
