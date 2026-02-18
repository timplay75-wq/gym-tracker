import React from 'react';
import { MuscleGroup, SimpleMuscleGroup, MuscleMap } from '../components';
import { EXERCISE_MUSCLE_GROUPS } from '../constants/muscleIcons';

/**
 * Демо-страница для отображения мышечных групп в упражнениях
 * Показывает как использовать компоненты для упражнений с несколькими мышцами
 */
export default function ExerciseMusclesDemo() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-2">🏋️ Мышечные Группы в Упражнениях</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Отображение всех задействованных мышц для каждого упражнения
      </p>

      {/* Объяснение цветов */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-3">💡 Легенда</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-2 border-primary-200 dark:border-primary-700 ring-2 ring-primary-500" />
            <div>
              <p className="font-bold">Основная мышца</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Главная целевая мышечная группа</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-2 border-primary-200 dark:border-primary-700 opacity-75" />
            <div>
              <p className="font-bold">Вспомогательная мышца</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Дополнительно задействованная</p>
            </div>
          </div>
        </div>
      </div>

      {/* ЖИМОВЫЕ УПРАЖНЕНИЯ */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <span>💪</span> Жимовые упражнения
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Жим лёжа */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Жим штанги лёжа</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.benchPress}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Базовое упражнение для грудных мышц
            </p>
          </div>

          {/* Жим на наклонной */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Жим на наклонной скамье</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.inclineBenchPress}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Акцент на верх грудных мышц
            </p>
          </div>

          {/* Жим на скамье с отрицательным наклоном */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Жим на скамье вниз головой</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.declineBenchPress}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Акцент на низ грудных мышц
            </p>
          </div>

          {/* Жим стоя */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Армейский жим</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.overheadPress}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Базовое упражнение для плеч
            </p>
          </div>
        </div>
      </section>

      {/* ТЯГОВЫЕ УПРАЖНЕНИЯ */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <span>🦾</span> Тяговые упражнения (Спина)
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Становая тяга */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Становая тяга</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.deadlift}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Базовое упражнение для всего тела
            </p>
          </div>

          {/* Подтягивания */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Подтягивания</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.pullUp}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Базовое упражнение для широчайших
            </p>
          </div>

          {/* Тяга в наклоне */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Тяга штанги в наклоне</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.bentOverRow}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Для толщины спины и лопаток
            </p>
          </div>

          {/* Шраги */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Шраги со штангой</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.shrugs}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Изолированная работа на трапеции
            </p>
          </div>
        </div>
      </section>

      {/* НОГИ */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <span>🦵</span> Упражнения на ноги
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Приседания */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Приседания со штангой</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.squat}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Базовое упражнение для ног
            </p>
          </div>

          {/* Жим ногами */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Жим ногами</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.legPress}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Альтернатива приседаниям
            </p>
          </div>

          {/* Сгибания ног */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Сгибания ног</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.legCurl}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Изоляция бицепсов бедра
            </p>
          </div>

          {/* Разгибания ног */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Разгибания ног</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.legExtension}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Изоляция квадрицепсов
            </p>
          </div>

          {/* Подъемы на носки */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Подъемы на носки</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.calfRaise}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Тренировка икроножных мышц
            </p>
          </div>
        </div>
      </section>

      {/* РУКИ */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <span>💪</span> Упражнения на руки
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Подъем на бицепс */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Подъем штанги на бицепс</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.bicepCurl}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Базовое упражнение для бицепса
            </p>
          </div>

          {/* Разгибания на трицепс */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Французский жим</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.tricepExtension}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Изоляция трицепса
            </p>
          </div>

          {/* Молотки */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Молотковые сгибания</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.hammerCurl}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Акцент на брахиалис
            </p>
          </div>
        </div>
      </section>

      {/* ПРЕСС */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <span>⚡</span> Упражнения на пресс
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Скручивания */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Скручивания</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.crunch}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Базовое упражнение для пресса
            </p>
          </div>

          {/* Планка */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Планка</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.plank}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Статическое упражнение для кора
            </p>
          </div>

          {/* Русские скручивания */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Русские скручивания</h3>
            <MuscleGroup
              muscles={EXERCISE_MUSCLE_GROUPS.russianTwist}
              size="lg"
              layout="vertical"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Акцент на косые мышцы живота
            </p>
          </div>
        </div>
      </section>

      {/* КОД ПРИМЕРЫ */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">💻 Примеры кода</h2>

        <div className="space-y-6">
          {/* Пример 1: Готовые комбинации */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Использование готовых комбинаций</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto text-sm">
              {`import { MuscleGroup } from '@/components';
import { EXERCISE_MUSCLE_GROUPS } from '@/constants/muscleIcons';

// Жим лёжа
<MuscleGroup 
  muscles={EXERCISE_MUSCLE_GROUPS.benchPress}
  size="lg"
  layout="vertical"
/>

// Становая тяга
<MuscleGroup 
  muscles={EXERCISE_MUSCLE_GROUPS.deadlift}
  size="md"
  layout="horizontal"
/>`}
            </pre>
          </div>

          {/* Пример 2: Кастомные комбинации */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Создание кастомной комбинации</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto text-sm">
              {`<MuscleGroup 
  muscles={[
    { 
      category: 'chest', 
      muscle: 'pectoralisMajor', 
      name: 'Грудь', 
      isPrimary: true 
    },
    { 
      category: 'arms', 
      muscle: 'tricepsBrachii', 
      name: 'Трицепс', 
      isPrimary: false 
    },
  ]}
  size="lg"
  showLabels={true}
  layout="vertical"
/>`}
            </pre>
          </div>

          {/* Пример 3: Упрощенный вариант */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Упрощенный вариант (SimpleMuscleGroup)</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto text-sm">
              {`import { SimpleMuscleGroup } from '@/components';

<SimpleMuscleGroup 
  primary={{ 
    category: 'chest', 
    muscle: 'pectoralisMajor', 
    name: 'Грудь' 
  }}
  secondary={[
    { category: 'arms', muscle: 'tricepsBrachii', name: 'Трицепс' },
    { category: 'shoulders', muscle: 'deltoidAnterior', name: 'Дельты' }
  ]}
  size="lg"
/>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Анатомическая карта */}
      <section>
        <h2 className="text-3xl font-bold mb-6">🗺️ Анатомическая карта мышц</h2>
        <div className="card p-6">
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Компонент MuscleMap показывает визуальную схему всех задействованных мышц:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold mb-3">Жим лёжа</h4>
              <MuscleMap
                activeMuscles={EXERCISE_MUSCLE_GROUPS.benchPress}
                size="md"
              />
            </div>
            <div>
              <h4 className="font-bold mb-3">Становая тяга</h4>
              <MuscleMap
                activeMuscles={EXERCISE_MUSCLE_GROUPS.deadlift}
                size="md"
              />
            </div>
            <div>
              <h4 className="font-bold mb-3">Приседания</h4>
              <MuscleMap
                activeMuscles={EXERCISE_MUSCLE_GROUPS.squat}
                size="md"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
