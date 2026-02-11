import { Card, Button } from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { loadTestWorkouts } from '@/utils/testData';

export const Profile = () => {
  const { isDark, toggleTheme } = useTheme();

  const handleClearData = () => {
    if (window.confirm('Вы уверены? Все данные будут удалены.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleLoadTestData = () => {
    loadTestWorkouts();
    alert('✅ Загружено ~30 тестовых тренировок!\n\n🔄 Обновите страницу или перейдите в раздел "Тренировки"');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-6 pb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-light-primary dark:text-white">
            Профиль
          </h1>
        </header>

        <div className="mt-6 space-y-6">
          {/* User Info */}
          <Card padding="lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                У
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-light-primary dark:text-white">
                  Пользователь
                </h2>
                <p className="text-sm text-light-secondary dark:text-gray-400 mt-1">
                  user@example.com
                </p>
              </div>
            </div>
          </Card>

          {/* Статистика */}
          <div>
            <h3 className="text-xl font-bold text-light-primary dark:text-white mb-3">
              Статистика
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Card padding="md" className="text-center">
                <p className="text-xs sm:text-sm text-light-secondary dark:text-gray-400 mb-1">
                  Всего тренировок
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-light-primary dark:text-white">
                  0
                </p>
              </Card>
              <Card padding="md" className="text-center">
                <p className="text-xs sm:text-sm text-light-secondary dark:text-gray-400 mb-1">
                  Упражнений
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-light-primary dark:text-white">
                  0
                </p>
              </Card>
              <Card padding="md" className="text-center">
                <p className="text-xs sm:text-sm text-light-secondary dark:text-gray-400 mb-1">
                  Общий тоннаж
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-light-primary dark:text-white">
                  0т
                </p>
              </Card>
              <Card padding="md" className="text-center">
                <p className="text-xs sm:text-sm text-light-secondary dark:text-gray-400 mb-1">
                  Streak
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-light-primary dark:text-white">
                  0 🔥
                </p>
              </Card>
            </div>
          </div>

          {/* Настройки */}
          <div>
            <h3 className="text-xl font-bold text-light-primary dark:text-white mb-3">
              Настройки
            </h3>
            <Card padding="none">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-2xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌙</span>
                  <span className="font-medium text-light-primary dark:text-white">
                    Темная тема
                  </span>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  isDark ? 'bg-primary-500' : 'bg-gray-300'
                } relative`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    isDark ? 'translate-x-5' : ''
                  }`} />
                </div>
              </button>
              
              <div className="border-t border-gray-100 dark:border-gray-800" />
              
              <button
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-2xl">⚖️</span>
                <span className="font-medium text-light-primary dark:text-white">
                  Единицы измерения
                </span>
              </button>
              
              <div className="border-t border-gray-100 dark:border-gray-800" />
              
              <button
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-2xl">⏱</span>
                <span className="font-medium text-light-primary dark:text-white">
                  Таймер отдыха
                </span>
              </button>

              <div className="border-t border-gray-100 dark:border-gray-800" />
              
              <button
                onClick={handleLoadTestData}
                className="w-full flex items-center gap-3 p-4 hover:bg-success-50 dark:hover:bg-success-900/20 transition-colors"
              >
                <span className="text-2xl">📊</span>
                <span className="font-medium text-success-600 dark:text-success-400">
                  Загрузить тестовые данные
                </span>
              </button>

              <div className="border-t border-gray-100 dark:border-gray-800" />
              
              <button
                onClick={handleClearData}
                className="w-full flex items-center gap-3 p-4 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors rounded-b-2xl"
              >
                <span className="text-2xl">🗑️</span>
                <span className="font-medium text-error-600 dark:text-error-400">
                  Очистить все данные
                </span>
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
