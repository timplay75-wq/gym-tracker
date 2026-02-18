import { 
  ExerciseIcon, 
  CategoryBadge, 
  StatusBadge, 
  AchievementBadge 
} from '../components/ExerciseIcon';
import { 
  MUSCLE_GROUP_EMOJIS, 
  EQUIPMENT_EMOJIS, 
  ACHIEVEMENT_EMOJIS,
  EMOJIS,
  getRandomMotivationEmoji 
} from '../constants/emojis';
import { Card } from '../components/Card';

/**
 * Демонстрация использования эмодзи и иконок
 * Добавьте эту страницу в роутер для просмотра примеров
 */
export default function IconsDemo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Заголовок */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎨 Иконки и Эмодзи
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Демонстрация визуальных элементов приложения
          </p>
        </div>

        {/* ExerciseIcon - Размеры */}
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            📏 Размеры ExerciseIcon
          </h2>
          <div className="flex items-end gap-6">
            <div className="text-center">
              <ExerciseIcon emoji="💪" size="sm" />
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Small</p>
            </div>
            <div className="text-center">
              <ExerciseIcon emoji="💪" size="md" />
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Medium</p>
            </div>
            <div className="text-center">
              <ExerciseIcon emoji="💪" size="lg" />
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Large</p>
            </div>
            <div className="text-center">
              <ExerciseIcon emoji="💪" size="xl" />
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Extra Large</p>
            </div>
          </div>
        </Card>

        {/* Категории мышечных групп */}
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            💪 Категории мышечных групп
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(MUSCLE_GROUP_EMOJIS).map(([key, emoji]) => (
              <div key={key} className="flex flex-col items-center gap-2">
                <ExerciseIcon emoji={emoji} size="md" />
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Оборудование */}
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            🏋️ Типы оборудования
          </h2>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(EQUIPMENT_EMOJIS).map(([key, emoji]) => (
              <div key={key} className="flex flex-col items-center gap-2">
                <ExerciseIcon emoji={emoji} size="md" />
                <span className="text-xs text-gray-600 dark:text-gray-400 capitalize text-center">
                  {key.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Badges */}
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            🏷️ Category Badges
          </h2>
          <div className="flex flex-wrap gap-3">
            <CategoryBadge category="chest" />
            <CategoryBadge category="back" />
            <CategoryBadge category="legs" />
            <CategoryBadge category="shoulders" />
            <CategoryBadge category="arms" />
            <CategoryBadge category="core" />
          </div>
        </Card>

        {/* Status Badges */}
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            ✅ Status Badges
          </h2>
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="completed" />
            <StatusBadge status="inProgress" />
            <StatusBadge status="planned" />
            <StatusBadge status="skipped" />
          </div>
        </Card>

        {/* Achievement Badges */}
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            🏆 Achievement Badges
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <AchievementBadge 
              achievement="100 тренировок"
              emoji={ACHIEVEMENT_EMOJIS.trophy}
              unlocked={true}
            />
            <AchievementBadge 
              achievement="Streak 30 дней"
              emoji={ACHIEVEMENT_EMOJIS.fire}
              unlocked={true}
            />
            <AchievementBadge 
              achievement="10,000 кг"
              emoji={ACHIEVEMENT_EMOJIS.champion}
              unlocked={true}
            />
            <AchievementBadge 
              achievement="Новичок"
              emoji={ACHIEVEMENT_EMOJIS.medal}
              unlocked={false}
            />
            <AchievementBadge 
              achievement="Профи"
              emoji={ACHIEVEMENT_EMOJIS.crown}
              unlocked={false}
            />
            <AchievementBadge 
              achievement="Легенда"
              emoji={ACHIEVEMENT_EMOJIS.rocket}
              unlocked={false}
            />
          </div>
        </Card>

        {/* Практический пример: Карточка упражнения */}
        <Card>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            📋 Пример: Карточка упражнения
          </h2>
          <div className="space-y-4">
            {/* Упражнение 1 */}
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <ExerciseIcon 
                    muscleGroup="chest" 
                    size="lg" 
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Жим штанги лежа
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <CategoryBadge category="chest" emoji="💪" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {EQUIPMENT_EMOJIS.barbell} Штанга
                      </span>
                    </div>
                  </div>
                </div>
                <StatusBadge status="completed" />
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                4 подхода × 8-12 повторений | 80-100 кг
              </div>
            </div>

            {/* Упражнение 2 */}
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <ExerciseIcon 
                    emoji={MUSCLE_GROUP_EMOJIS.back}
                    size="lg" 
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Подтягивания
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <CategoryBadge category="back" emoji="🦾" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {EQUIPMENT_EMOJIS.bodyweight} Собственный вес
                      </span>
                    </div>
                  </div>
                </div>
                <StatusBadge status="inProgress" />
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                3 подхода × до отказа
              </div>
            </div>
          </div>
        </Card>

        {/* Все эмодзи категории */}
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            🎯 Все категории эмодзи
          </h2>
          <div className="space-y-6">
            {Object.entries(EMOJIS).map(([category, emojis]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(emojis as Record<string, string>).map(([key, emoji]) => (
                    <div 
                      key={key}
                      className="
                        px-3 py-2 rounded-lg 
                        bg-gray-100 dark:bg-gray-800
                        border border-gray-200 dark:border-gray-700
                        hover:bg-gray-200 dark:hover:bg-gray-700
                        transition-colors cursor-pointer
                      "
                      title={key}
                    >
                      <span className="text-2xl">{emoji}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Мотивационный блок */}
        <Card className="text-center">
          <div className="space-y-4">
            <span className="text-6xl">{getRandomMotivationEmoji()}</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Продолжай в том же духе!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Каждая тренировка приближает тебя к цели {EMOJIS.achievements.target}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
