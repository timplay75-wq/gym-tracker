import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { BottomSheet } from '../components/BottomSheet';
import { ProgressRing } from '../components/ProgressRing';
import { StatCard } from '../components/StatCard';
import { useTheme } from '../hooks/useTheme';

export default function DesignDemo() {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const replayAnimations = () => {
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div className={`min-h-screen p-8 ${isDark ? 'dark' : ''}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-4xl font-bold text-gradient">🎨 Дизайн Система</h1>
          <div className="flex gap-2 items-center">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-800 
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
                transition-all duration-200 cursor-pointer
                text-sm font-medium"
            >
              <option value="light" className="bg-white text-gray-900">☀️ Светлая</option>
              <option value="dark" className="bg-gray-800 text-gray-100">🌙 Темная</option>
              <option value="system" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">💻 Системная</option>
            </select>
            <button
              onClick={toggleTheme}
              className="btn-primary whitespace-nowrap px-4 py-2.5"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Цветовая палитра */}
        <section className="card dark:card-dark">
          <h2 className="text-2xl font-bold mb-4">Цветовая палитра</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="h-20 bg-primary-500 rounded-lg mb-2"></div>
              <p className="text-sm">Primary</p>
            </div>
            <div>
              <div className="h-20 bg-success-500 rounded-lg mb-2"></div>
              <p className="text-sm">Success</p>
            </div>
            <div>
              <div className="h-20 bg-error-500 rounded-lg mb-2"></div>
              <p className="text-sm">Error</p>
            </div>
            <div>
              <div className="h-20 bg-warning-500 rounded-lg mb-2"></div>
              <p className="text-sm">Warning</p>
            </div>
          </div>
        </section>

        {/* Кнопки */}
        <section className="card dark:card-dark">
          <h2 className="text-2xl font-bold mb-4">Кнопки</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-gradient">Gradient Button</button>
            <button className="btn-gradient-success">Success Button</button>
            <button className="btn-gradient-error">Error Button</button>
            <button className="btn-primary">Primary Button</button>
          </div>
        </section>

        {/* Карточки */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Карточки</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card dark:card-dark">
              <h3 className="font-semibold mb-2">Обычная карточка</h3>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                Базовая карточка с elevation-1
              </p>
            </div>
            <div className="card-elevated dark:card-elevated-dark">
              <h3 className="font-semibold mb-2">Elevated карточка</h3>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                С более высокой тенью
              </p>
            </div>
            <div className="card-interactive dark:card-interactive-dark">
              <h3 className="font-semibold mb-2">Интерактивная</h3>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                С hover эффектами
              </p>
            </div>
          </div>
        </section>

        {/* Glassmorphism */}
        <section className="relative h-64 bg-gradient-primary rounded-2xl overflow-hidden p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Glassmorphism</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card">
              <h3 className="font-semibold text-white mb-2">Glass Card</h3>
              <p className="text-sm text-white/80">Полупрозрачная карточка с blur эффектом</p>
            </div>
            <div className="glass-card-dark">
              <h3 className="font-semibold text-white mb-2">Glass Card Dark</h3>
              <p className="text-sm text-white/80">Темный вариант с blur</p>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="card dark:card-dark">
          <h2 className="text-2xl font-bold mb-4">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <span className="badge-success">✅ Success</span>
            <span className="badge-error">❌ Error</span>
            <span className="badge-warning">⚠️ Warning</span>
            <span className="badge-info">ℹ️ Info</span>
          </div>
        </section>

        {/* Input Fields */}
        <section className="card dark:card-dark">
          <h2 className="text-2xl font-bold mb-4">Input поля</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Введите текст..."
              className="input dark:input-dark"
            />
            <input
              type="number"
              placeholder="Введите число..."
              className="input dark:input-dark"
            />
          </div>
        </section>

        {/* Анимации */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">✨ Анимации (Живые примеры)</h2>
            <Button onClick={replayAnimations} variant="secondary" size="sm" icon={<span>🔄</span>}>
              Перезапустить
            </Button>
          </div>
          <div key={animationKey} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card dark:card-dark animate-fade-in">
              <div className="flex items-center justify-center h-32">
                <div className="text-6xl animate-fade-in">👋</div>
              </div>
              <h3 className="font-semibold text-center">Fade In</h3>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary text-center">
                Плавное появление
              </p>
            </div>
            <div className="card dark:card-dark">
              <div className="flex items-center justify-center h-32">
                <div className="text-6xl animate-scale-in">💪</div>
              </div>
              <h3 className="font-semibold text-center">Scale In</h3>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary text-center">
                Масштабирование
              </p>
            </div>
            <div className="card dark:card-dark">
              <div className="flex items-center justify-center h-32">
                <div className="text-6xl animate-slide-in-bottom">🎯</div>
              </div>
              <h3 className="font-semibold text-center">Slide In Bottom</h3>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary text-center">
                Выезд снизу
              </p>
            </div>
          </div>

          {/* Continuous Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card padding="lg">
              <div className="flex items-center justify-center h-32">
                <div className="text-6xl animate-shimmer">✨</div>
              </div>
              <h3 className="font-semibold text-center">Shimmer</h3>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary text-center">
                Бесконечный shimmer эффект
              </p>
            </Card>
            <Card padding="lg">
              <div className="flex items-center justify-center h-32">
                <div className="text-6xl animate-pulse-glow">🔥</div>
              </div>
              <h3 className="font-semibold text-center">Pulse Glow</h3>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary text-center">
                Пульсирующее свечение
              </p>
            </Card>
          </div>
        </section>

        {/* Skeleton Loaders */}
        <section className="card dark:card-dark">
          <h2 className="text-2xl font-bold mb-4">💀 Skeleton Loaders (Анимированные)</h2>
          <div className="space-y-3">
            <div className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 h-8 w-3/4 rounded-lg"></div>
            <div className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 h-6 w-1/2 rounded-lg"></div>
            <div className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 h-6 w-2/3 rounded-lg"></div>
            <div className="flex gap-3 mt-4">
              <div className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 h-12 w-12 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 h-4 w-full rounded"></div>
                <div className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 h-4 w-2/3 rounded"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Градиентный текст */}
        <section className="card dark:card-dark text-center">
          <h2 className="text-5xl font-bold text-gradient mb-2">
            Градиентный текст
          </h2>
          <p className="text-text-light-secondary dark:text-text-dark-secondary">
            Красивые заголовки с градиентом
          </p>
        </section>

        {/* Shadows & Elevation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Elevation (Material Design)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-elevation-1 dark:shadow-elevation-dark-1">
              <p className="text-sm font-semibold">Elevation 1</p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-elevation-2 dark:shadow-elevation-dark-2">
              <p className="text-sm font-semibold">Elevation 2</p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-elevation-3 dark:shadow-elevation-dark-3">
              <p className="text-sm font-semibold">Elevation 3</p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-elevation-4 dark:shadow-elevation-dark-4">
              <p className="text-sm font-semibold">Elevation 4</p>
            </div>
          </div>
        </section>

        {/* Glow Effects */}
        <section className="card dark:card-dark">
          <h2 className="text-2xl font-bold mb-4">Glow Effects</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary hover-glow">Hover для Glow</button>
            <button className="btn-gradient hover-glow-lg">Large Glow</button>
            <div className="bg-primary-500 text-white px-6 py-3 rounded-xl animate-pulse-glow">
              Пульсирующий Glow
            </div>
          </div>
        </section>

        {/* NEW UI Components */}
        
        {/* Buttons Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">🔘 Button Component</h2>
          <Card padding="lg">
            <h3 className="text-lg font-semibold mb-4">Варианты</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>

            <h3 className="text-lg font-semibold mb-4">Размеры</h3>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>

            <h3 className="text-lg font-semibold mb-4">С иконками</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              <Button icon={<span>🏋️</span>} iconPosition="left">Тренировка</Button>
              <Button icon={<span>📊</span>} iconPosition="right" variant="secondary">Статистика</Button>
            </div>

            <h3 className="text-lg font-semibold mb-4">Loading State</h3>
            <div className="flex flex-wrap gap-3">
              <Button loading={loading} onClick={handleButtonClick}>
                {loading ? 'Загрузка...' : 'Нажми меня'}
              </Button>
              <Button disabled>Disabled</Button>
            </div>
          </Card>
        </section>

        {/* Input Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">⌨️ Input Component</h2>
          <Card padding="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Название тренировки"
                placeholder="Грудь и трицепс"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="Вес (kg)"
                type="number"
                placeholder="80"
                icon={<span>⚖️</span>}
              />
              <Input
                label="Email"
                type="email"
                placeholder="user@example.com"
                success="Email корректный"
              />
              <Input
                label="Password"
                type="password"
                error="Пароль слишком короткий"
              />
            </div>
          </Card>
        </section>

        {/* Card Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">🃏 Card Component</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default" padding="lg">
              <h3 className="font-semibold mb-2">Default Card</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Обычная карточка с тенью</p>
            </Card>
            <Card variant="elevated" padding="lg">
              <h3 className="font-semibold mb-2">Elevated Card</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">С более высокой тенью</p>
            </Card>
            <Card variant="glass" padding="lg">
              <h3 className="font-semibold mb-2">Glass Card</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Glassmorphism эффект</p>
            </Card>
          </div>
        </section>

        {/* StatCard Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">📊 StatCard Component</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Всего тренировок"
              value="42"
              icon={<span className="text-2xl">🏋️</span>}
              trend={{ direction: 'up', value: '+12%' }}
              subtitle="За этот месяц"
            />
            <StatCard
              title="Тоннаж"
              value="12,540 kg"
              icon={<span className="text-2xl">💪</span>}
              trend={{ direction: 'up', value: '+8%' }}
              subtitle="Общий объём"
            />
            <StatCard
              title="Streak"
              value="7 дней"
              icon={<span className="text-2xl">🔥</span>}
              trend={{ direction: 'neutral', value: '0%' }}
              subtitle="Подряд"
            />
          </div>
        </section>

        {/* ProgressRing Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">⭕ ProgressRing Component</h2>
          <Card padding="lg">
            <div className="flex flex-wrap justify-around gap-8">
              <ProgressRing progress={75} label="Завершено" />
              <ProgressRing progress={50} size={100} strokeWidth={6} />
              <ProgressRing progress={33} size={80} label="Упражнений" />
              <ProgressRing progress={100} showPercentage={false} label="Готово!" />
            </div>
          </Card>
        </section>

        {/* Modal & BottomSheet */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">📱 Modal & BottomSheet</h2>
          <Card padding="lg">
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setIsModalOpen(true)}>Открыть Modal</Button>
              <Button variant="secondary" onClick={() => setIsBottomSheetOpen(true)}>
                Открыть Bottom Sheet
              </Button>
            </div>
          </Card>
        </section>
      </div>

      {/* Modal Example */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Пример Modal" size="md">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Это модальное окно с backdrop blur эффектом. Можно закрыть кликнув вне окна или нажав ESC.
          </p>
          <Input label="Введите данные" placeholder="Пример инпута в модалке" />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Сохранить</Button>
          </div>
        </div>
      </Modal>

      {/* BottomSheet Example */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title="Пример Bottom Sheet"
        size="auto"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Выдвигающаяся панель снизу с поддержкой свайпа. Потяните вниз чтобы закрыть.
          </p>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                onClick={() => setIsBottomSheetOpen(false)}
              >
                <p className="font-medium">Опция {i}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Нажмите чтобы выбрать</p>
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

