# 🎨 Руководство по Assets и визуальным ресурсам

## 📁 Структура папок для ресурсов

```
public/
├── icons/              # Иконки приложения (PWA)
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
├── images/
│   ├── exercises/      # Изображения упражнений
│   │   ├── chest/
│   │   │   ├── bench-press.gif
│   │   │   ├── push-ups.gif
│   │   │   └── ...
│   │   ├── back/
│   │   ├── legs/
│   │   └── ...
│   ├── avatars/        # Аватары по умолчанию
│   ├── badges/         # Иконки достижений
│   └── misc/           # Разное
└── sounds/             # Звуковые эффекты (опционально)
    ├── rest-complete.mp3
    ├── set-complete.mp3
    └── workout-complete.mp3
```

## 🔤 Использование эмодзи

### Импорт констант эмодзи

```tsx
import { 
  MUSCLE_GROUP_EMOJIS, 
  EQUIPMENT_EMOJIS,
  STATUS_EMOJIS,
  getMuscleGroupEmoji,
  getRandomMotivationEmoji 
} from '@/constants/emojis';

// Использование
const chestEmoji = MUSCLE_GROUP_EMOJIS.chest; // 💪
const barbellEmoji = EQUIPMENT_EMOJIS.barbell; // 🏋️
const completedEmoji = STATUS_EMOJIS.completed; // ✅

// С функцией
const muscleEmoji = getMuscleGroupEmoji('chest'); // 💪
const motivationEmoji = getRandomMotivationEmoji(); // случайный эмодзи
```

### Примеры использования в компонентах

#### 1. В карточке упражнения

```tsx
import { ExerciseIcon, CategoryBadge } from '@/components/ExerciseIcon';

function ExerciseCard({ exercise }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <ExerciseIcon 
          muscleGroup={exercise.muscleGroup}
          size="lg"
        />
        <div>
          <h3>{exercise.name}</h3>
          <CategoryBadge category={exercise.category} />
        </div>
      </div>
    </div>
  );
}
```

#### 2. С кастомным эмодзи

```tsx
<ExerciseIcon 
  emoji="🏋️"
  size="md"
  alt="Bench Press"
/>
```

#### 3. С изображением

```tsx
<ExerciseIcon 
  imageUrl="/images/exercises/chest/bench-press.gif"
  size="lg"
  alt="Bench Press demonstration"
/>
```

#### 4. Статус бейджи

```tsx
import { StatusBadge } from '@/components/ExerciseIcon';

<StatusBadge status="completed" />
<StatusBadge status="inProgress" />
<StatusBadge status="planned" />
```

#### 5. Достижения

```tsx
import { AchievementBadge } from '@/components/ExerciseIcon';

<AchievementBadge 
  achievement="100 тренировок"
  emoji="🏆"
  unlocked={true}
/>
```

## 🖼️ Добавление изображений упражнений

### Рекомендуемые источники изображений

1. **Бесплатные ресурсы:**
   - [Unsplash](https://unsplash.com/) - качественные фото
   - [Pexels](https://pexels.com/) - фото и видео
   - [Giphy](https://giphy.com/) - GIF анимации

2. **Специализированные базы упражнений:**
   - [ExRx.net](https://exrx.net/) - база упражнений с изображениями
   - [Muscle Wiki](https://musclewiki.com/) - интерактивная база
   - [Jefit](https://www.jefit.com/exercises/) - упражнения с демонстрацией

3. **API для упражнений:**
   ```bash
   # API с базой упражнений
   https://wger.de/api/v2/
   https://exercisedb.p.rapidapi.com/
   ```

### Формат изображений

- **Формат:** WebP (лучшее сжатие) или PNG/JPG
- **Размер:** 400x400px для иконок, 800x600px для детальных изображений
- **GIF:** для демонстрации техники выполнения
- **Оптимизация:** используйте TinyPNG или Squoosh для сжатия

### Пример добавления изображения

1. Сохраните файл в правильную папку:
   ```
   public/images/exercises/chest/bench-press.gif
   ```

2. Используйте в компоненте:
   ```tsx
   <ExerciseIcon 
     imageUrl="/images/exercises/chest/bench-press.gif"
     alt="Bench Press"
   />
   ```

## 🎯 Создание собственной базы изображений

### Структура JSON для упражнений

Создайте файл `src/data/exercises.json`:

```json
{
  "exercises": [
    {
      "id": "bench-press",
      "name": "Жим штанги лежа",
      "nameEn": "Bench Press",
      "category": "chest",
      "equipment": "barbell",
      "emoji": "💪",
      "image": "/images/exercises/chest/bench-press.gif",
      "thumbnail": "/images/exercises/chest/bench-press-thumb.jpg",
      "difficulty": "intermediate",
      "primaryMuscles": ["chest", "triceps"],
      "secondaryMuscles": ["shoulders"],
      "instructions": [
        "Лягте на скамью",
        "Возьмите штангу хватом чуть шире плеч",
        "Опустите штангу к груди",
        "Выжмите штангу вверх"
      ]
    }
  ]
}
```

## 🎨 Создание кастомных иконок (SVG)

### Создайте компонент иконки

```tsx
// src/components/icons/BarbellIcon.tsx
export function BarbellIcon({ className = '' }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor"
    >
      <path 
        d="M2 12h4M18 12h4M6 8v8M18 8v8M8 10h8M8 14h8" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
}
```

### Использование

```tsx
import { BarbellIcon } from '@/components/icons/BarbellIcon';

<BarbellIcon className="w-6 h-6 text-primary-600" />
```

## 🔊 Добавление звуковых эффектов

### Создайте хук для звуков

```tsx
// src/hooks/useSounds.ts
import { useCallback } from 'react';

export function useSounds() {
  const playSound = useCallback((soundName: string) => {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(console.error);
  }, []);

  return {
    playSetComplete: () => playSound('set-complete'),
    playRestComplete: () => playSound('rest-complete'),
    playWorkoutComplete: () => playSound('workout-complete'),
  };
}
```

### Использование

```tsx
import { useSounds } from '@/hooks/useSounds';

function WorkoutPage() {
  const { playSetComplete, playWorkoutComplete } = useSounds();

  const handleSetComplete = () => {
    playSetComplete();
    // остальная логика
  };

  return <button onClick={handleSetComplete}>Complete Set ✅</button>;
}
```

## 📦 Рекомендуемые библиотеки иконок

### 1. React Icons (универсальная)

```bash
npm install react-icons
```

```tsx
import { FaDumbbell, FaRunning, FaFire } from 'react-icons/fa';
import { IoMdFitness } from 'react-icons/io';
import { GiWeightLiftingUp } from 'react-icons/gi';

<FaDumbbell className="w-6 h-6" />
```

### 2. Lucide React (современная)

```bash
npm install lucide-react
```

```tsx
import { Dumbbell, Activity, TrendingUp } from 'lucide-react';

<Dumbbell size={24} className="text-primary-600" />
```

### 3. Heroicons (от Tailwind)

```bash
npm install @heroicons/react
```

```tsx
import { FireIcon } from '@heroicons/react/24/solid';

<FireIcon className="w-6 h-6" />
```

## 🎭 Примеры использования в реальных компонентах

### Карточка тренировки

```tsx
import { EMOJIS } from '@/constants/emojis';
import { ExerciseIcon } from '@/components/ExerciseIcon';

function WorkoutCard({ workout }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ExerciseIcon 
            emoji={EMOJIS.workoutCategories.strength}
            size="md"
          />
          <div>
            <h3>{workout.name}</h3>
            <p className="text-sm text-gray-500">
              {workout.exercises.length} упражнений {EMOJIS.stats.checkmark}
            </p>
          </div>
        </div>
        {workout.completed && (
          <span className="text-2xl">{EMOJIS.status.completed}</span>
        )}
      </div>
    </div>
  );
}
```

### Экран статистики

```tsx
import { EMOJIS } from '@/constants/emojis';
import { StatCard } from '@/components/StatCard';

function StatsPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        icon={EMOJIS.stats.trending_up}
        label="Тренировок"
        value={42}
        trend="up"
      />
      <StatCard
        icon={EMOJIS.achievements.fire}
        label="Streak"
        value={7}
        unit="дней"
      />
      <StatCard
        icon={EMOJIS.muscleGroups.chest}
        label="Тоннаж"
        value={5420}
        unit="кг"
      />
    </div>
  );
}
```

## 📝 Чек-лист добавления новых ресурсов

- [ ] Создать папку для категории (если нужно)
- [ ] Оптимизировать изображения (WebP, сжатие)
- [ ] Добавить файлы в `public/images/`
- [ ] Обновить `exercises.json` с путями к изображениям
- [ ] Добавить новые эмодзи в `constants/emojis.ts` (если нужно)
- [ ] Протестировать отображение на разных экранах
- [ ] Убедиться что работает в темной теме

## 🚀 Следующие шаги

1. **Создайте иконку приложения** для PWA
2. **Соберите коллекцию GIF** для популярных упражнений
3. **Добавьте звуки** для улучшения UX
4. **Создайте собственные SVG иконки** для уникального дизайна

---

**Теперь у вас есть полная система для работы с визуальными ресурсами! 🎉**

Используйте эмодзи константы, компоненты иконок и следуйте структуре папок для организованного проекта.
