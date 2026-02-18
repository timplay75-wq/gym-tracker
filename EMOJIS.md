# 🎨 Быстрый старт: Использование эмодзи и иконок

## 📦 Что создано

1. **`src/constants/emojis.ts`** - Все эмодзи константы
2. **`src/components/ExerciseIcon.tsx`** - Компоненты для отображения иконок
3. **`src/pages/IconsDemo.tsx`** - Демо-страница с примерами
4. **`ASSETS_GUIDE.md`** - Полное руководство

## 🚀 Быстрое использование

### 1. Простые эмодзи

```tsx
import { EMOJIS } from '@/constants/emojis';

// В любом компоненте
<p>Давай сделаем это! {EMOJIS.motivation.fire}</p>
// Результат: Давай сделаем это! 🔥

<p>Тренировка завершена {EMOJIS.status.completed}</p>
// Результат: Тренировка завершена ✅
```

### 2. Иконка упражнения

```tsx
import { ExerciseIcon } from '@/components/ExerciseIcon';

// По категории мышц
<ExerciseIcon muscleGroup="chest" size="md" />

// С кастомным эмодзи
<ExerciseIcon emoji="🏋️" size="lg" />
```

### 3. Бейджи категорий

```tsx
import { CategoryBadge } from '@/components/ExerciseIcon';

<CategoryBadge category="chest" />
// Результат: [💪 Chest]
```

### 4. Статус бейджи

```tsx
import { StatusBadge } from '@/components/ExerciseIcon';

<StatusBadge status="completed" />
// Результат: [✅ Выполнено]
```

### 5. Достижения

```tsx
import { AchievementBadge } from '@/components/ExerciseIcon';

<AchievementBadge 
  achievement="100 тренировок"
  emoji="🏆"
  unlocked={true}
/>
```

## 📋 Доступные эмодзи категории

```typescript
EMOJIS.muscleGroups    // 💪 chest, back, legs...
EMOJIS.equipment       // 🏋️ barbell, dumbbell...
EMOJIS.status          // ✅ completed, inProgress...
EMOJIS.achievements    // 🏆 trophy, medal...
EMOJIS.stats           // 📈 trending_up, chart...
EMOJIS.actions         // ➕ add, edit, delete...
EMOJIS.motivation      // 🔥 fire, rocket...
EMOJIS.workoutCategories // 🏋️ strength, cardio...
EMOJIS.nutrition       // 🍎 apple, protein...
EMOJIS.mood            // 😊 great, good...
EMOJIS.goals           // 💪 strength, muscle...
```

## 💡 Примеры использования

### В карточке тренировки

```tsx
import { ExerciseIcon, StatusBadge } from '@/components';
import { EMOJIS } from '@/constants/emojis';

function WorkoutCard({ workout }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <ExerciseIcon 
          emoji={EMOJIS.workoutCategories.strength}
          size="md"
        />
        <div>
          <h3>{workout.name}</h3>
          <p>{workout.exercises.length} упражнений</p>
        </div>
        {workout.completed && <StatusBadge status="completed" />}
      </div>
    </div>
  );
}
```

### В статистике

```tsx
import { EMOJIS } from '@/constants/emojis';

function Stats({ totalWorkouts, streak }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="stat-card">
        <span className="text-4xl">{EMOJIS.stats.trending_up}</span>
        <p>{totalWorkouts} тренировок</p>
      </div>
      <div className="stat-card">
        <span className="text-4xl">{EMOJIS.achievements.fire}</span>
        <p>Streak: {streak} дней</p>
      </div>
    </div>
  );
}
```

### С упражнениями

```tsx
import { ExerciseIcon, CategoryBadge } from '@/components';

function ExerciseList({ exercises }) {
  return (
    <div className="space-y-4">
      {exercises.map(exercise => (
        <div key={exercise.id} className="flex items-center gap-4">
          <ExerciseIcon 
            muscleGroup={exercise.muscleGroup}
            size="lg"
          />
          <div>
            <h3>{exercise.name}</h3>
            <CategoryBadge category={exercise.category} />
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 🎯 Где посмотреть примеры?

1. Откройте файл `src/pages/IconsDemo.tsx`
2. Добавьте роут в App.tsx:
   ```tsx
   <Route path="/icons-demo" element={<IconsDemo />} />
   ```
3. Перейдите на `/icons-demo`

## 📖 Подробная документация

Смотрите [ASSETS_GUIDE.md](./ASSETS_GUIDE.md) для полного руководства по:
- Добавлению изображений
- Организации файлов
- Созданию собственных иконок
- Звуковым эффектам
- И многому другому!

---

**Теперь вы можете использовать эмодзи и иконки во всех компонентах приложения! 🎉**
