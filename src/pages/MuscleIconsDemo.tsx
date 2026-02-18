import React from 'react';
import { ExerciseIcon } from '../components';

/**
 * Демо-страница анатомических иконок мышц
 */
export default function MuscleIconsDemo() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-2">💪 Анатомические Иконки Мышц</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Детализированные SVG иконки отдельных мышечных групп
      </p>

      {/* Инструкция */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          📥 Как добавить иконки
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>
            Открой{' '}
            <a
              href="https://www.flaticon.com/search?word=muscle+anatomy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 underline"
            >
              Flaticon - Muscle Anatomy
            </a>
          </li>
          <li>Скачай иконки для: трапеции, широчайшие, ромбовидные, дельты и др.</li>
          <li>
            Переименуй файлы: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">trapezius-upper.svg</code>,{' '}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">latissimus-dorsi.svg</code>
          </li>
          <li>
            Помести в <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">public/icons/muscles/back/</code>
          </li>
          <li>Готово! Используй в коде ниже</li>
        </ol>
        <a
          href="https://www.flaticon.com/search?word=trapezius+muscle"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          🔍 Найти иконки на Flaticon
        </a>
      </div>

      {/* Примеры использования */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">🎯 Примеры использования</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Пример 1: Трапеция */}
          <div className="card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span>🔼</span> Трапециевидная мышца
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <ExerciseIcon
                anatomyIcon={{
                  category: 'back',
                  muscle: 'trapeziusUpper',
                }}
                size="xl"
              />
              <div>
                <p className="font-medium">Шраги со штангой</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Целевая мышца: Верхняя трапеция
                </p>
              </div>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
              {`<ExerciseIcon 
  anatomyIcon={{
    category: 'back',
    muscle: 'trapeziusUpper'
  }}
  size="xl"
/>`}
            </pre>
          </div>

          {/* Пример 2: Широчайшие */}
          <div className="card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span>🦅</span> Широчайшие мышцы спины
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <ExerciseIcon
                anatomyIcon={{
                  category: 'back',
                  muscle: 'latissimusDorsi',
                }}
                size="xl"
              />
              <div>
                <p className="font-medium">Подтягивания широким хватом</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Целевая мышца: Latissimus dorsi
                </p>
              </div>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
              {`<ExerciseIcon 
  anatomyIcon={{
    category: 'back',
    muscle: 'latissimusDorsi'
  }}
  size="xl"
/>`}
            </pre>
          </div>

          {/* Пример 3: Ромбовидные (лопатки) */}
          <div className="card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span>◆</span> Ромбовидные мышцы (Лопатки)
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <ExerciseIcon
                anatomyIcon={{
                  category: 'back',
                  muscle: 'rhomboids',
                }}
                size="xl"
              />
              <div>
                <p className="font-medium">Тяга штанги в наклоне</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Целевая мышца: Ромбовидные + сведение лопаток
                </p>
              </div>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
              {`<ExerciseIcon 
  anatomyIcon={{
    category: 'back',
    muscle: 'rhomboids'
  }}
  size="xl"
/>`}
            </pre>
          </div>

          {/* Пример 4: Дельты */}
          <div className="card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span>🤸</span> Дельтовидные мышцы
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <ExerciseIcon
                anatomyIcon={{
                  category: 'shoulders',
                  muscle: 'deltoidLateral',
                }}
                size="xl"
              />
              <div>
                <p className="font-medium">Махи гантелями в стороны</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Целевая мышца: Средние дельты
                </p>
              </div>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
              {`<ExerciseIcon 
  anatomyIcon={{
    category: 'shoulders',
    muscle: 'deltoidLateral'
  }}
  size="xl"
/>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Таблица всех мышц */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">📋 Полный список мышц</h2>

        {/* Спина */}
        <div className="card p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">🦾 Спина</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'latissimusDorsi', name: 'Широчайшие' },
              { key: 'trapeziusUpper', name: 'Трапеция (верх)' },
              { key: 'trapeziusMiddle', name: 'Трапеция (середина)' },
              { key: 'trapeziusLower', name: 'Трапеция (низ)' },
              { key: 'rhomboids', name: 'Ромбовидные' },
              { key: 'erectorSpinae', name: 'Разгибатели спины' },
              { key: 'teresMajor', name: 'Большая круглая' },
            ].map((muscle) => (
              <div key={muscle.key} className="flex items-center gap-3">
                <ExerciseIcon
                  anatomyIcon={{
                    category: 'back',
                    muscle: muscle.key,
                  }}
                  size="md"
                />
                <span className="text-sm">{muscle.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Грудь */}
        <div className="card p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">💪 Грудь</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'pectoralisMajor', name: 'Большая грудная' },
              { key: 'pectoralisMinor', name: 'Малая грудная' },
              { key: 'upperChest', name: 'Верх груди' },
              { key: 'lowerChest', name: 'Низ груди' },
            ].map((muscle) => (
              <div key={muscle.key} className="flex items-center gap-3">
                <ExerciseIcon
                  anatomyIcon={{
                    category: 'chest',
                    muscle: muscle.key,
                  }}
                  size="md"
                />
                <span className="text-sm">{muscle.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Плечи */}
        <div className="card p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">🤸 Плечи</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'deltoidAnterior', name: 'Передние дельты' },
              { key: 'deltoidLateral', name: 'Средние дельты' },
              { key: 'deltoidPosterior', name: 'Задние дельты' },
              { key: 'rotatorCuff', name: 'Ротаторная манжета' },
            ].map((muscle) => (
              <div key={muscle.key} className="flex items-center gap-3">
                <ExerciseIcon
                  anatomyIcon={{
                    category: 'shoulders',
                    muscle: muscle.key,
                  }}
                  size="md"
                />
                <span className="text-sm">{muscle.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Руки */}
        <div className="card p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">💪 Руки</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'bicepsBrachii', name: 'Бицепс' },
              { key: 'tricepsBrachii', name: 'Трицепс' },
              { key: 'brachialis', name: 'Брахиалис' },
              { key: 'forearmFlexors', name: 'Сгибатели предплечья' },
              { key: 'forearmExtensors', name: 'Разгибатели предплечья' },
            ].map((muscle) => (
              <div key={muscle.key} className="flex items-center gap-3">
                <ExerciseIcon
                  anatomyIcon={{
                    category: 'arms',
                    muscle: muscle.key,
                  }}
                  size="md"
                />
                <span className="text-sm">{muscle.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ноги */}
        <div className="card p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">🦵 Ноги</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'quadriceps', name: 'Квадрицепсы' },
              { key: 'hamstrings', name: 'Бицепсы бедра' },
              { key: 'gluteusMaximus', name: 'Большая ягодичная' },
              { key: 'gluteusMedius', name: 'Средняя ягодичная' },
              { key: 'gastrocnemius', name: 'Икры (икроножная)' },
              { key: 'soleus', name: 'Камбаловидная' },
            ].map((muscle) => (
              <div key={muscle.key} className="flex items-center gap-3">
                <ExerciseIcon
                  anatomyIcon={{
                    category: 'legs',
                    muscle: muscle.key,
                  }}
                  size="md"
                />
                <span className="text-sm">{muscle.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Кор */}
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4">⚡ Кор и пресс</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'rectusAbdominis', name: 'Прямая мышца живота' },
              { key: 'obliquesExternal', name: 'Наружные косые' },
              { key: 'obliquesInternal', name: 'Внутренние косые' },
              { key: 'transverseAbdominis', name: 'Поперечная' },
              { key: 'serratusAnterior', name: 'Зубчатые' },
            ].map((muscle) => (
              <div key={muscle.key} className="flex items-center gap-3">
                <ExerciseIcon
                  anatomyIcon={{
                    category: 'core',
                    muscle: muscle.key,
                  }}
                  size="md"
                />
                <span className="text-sm">{muscle.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Альтернатива: Прямой путь */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">🔧 Альтернативный способ</h2>
        <div className="card p-6">
          <p className="mb-4">Можно использовать прямой путь к файлу:</p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto mb-4">
            {`<ExerciseIcon 
  imageUrl="/icons/muscles/back/trapezius-upper.svg"
  alt="Верхняя трапеция"
  size="lg"
/>

// Или напрямую img tag:
<img 
  src="/icons/muscles/back/trapezius-upper.svg"
  alt="Трапеция"
  className="w-16 h-16"
/>`}
          </pre>
        </div>
      </section>

      {/* Полезные ссылки */}
      <section>
        <h2 className="text-2xl font-bold mb-6">🔗 Полезные ресурсы</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://www.flaticon.com/search?word=muscle+anatomy"
            target="_blank"
            rel="noopener noreferrer"
            className="card p-6 hover:shadow-lg transition"
          >
            <h3 className="font-bold mb-2">🎨 Flaticon</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Бесплатные SVG иконки мышц
            </p>
          </a>
          <a
            href="https://www.freepik.com/search?format=search&query=muscle+anatomy+icon"
            target="_blank"
            rel="noopener noreferrer"
            className="card p-6 hover:shadow-lg transition"
          >
            <h3 className="font-bold mb-2">🎯 Freepik</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Векторные иллюстрации анатомии
            </p>
          </a>
          <a
            href="https://thenounproject.com/search/icons/?q=trapezius"
            target="_blank"
            rel="noopener noreferrer"
            className="card p-6 hover:shadow-lg transition"
          >
            <h3 className="font-bold mb-2">🏋️ Noun Project</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Иконки конкретных мышц
            </p>
          </a>
        </div>
      </section>
    </div>
  );
}
