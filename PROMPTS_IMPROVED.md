# 🎯 Улучшенные промты для Gym Tracker PWA

## 📊 Общий анализ улучшений

### Ключевые проблемы оригинальных промтов:

1. **Недостаток конкретики**: Размытые формулировки типа "создай красивый экран" без точных критериев
2. **Отсутствие технических спецификаций**: Не указаны типы данных, форматы API, структура state
3. **Нет приоритизации**: Всё описано как одинаково важное
4. **Слабая связь между промтами**: Не указываются зависимости и порядок выполнения
5. **Отсутствие критериев завершения**: Непонятно, когда промт выполнен полностью
6. **Нет обработки edge cases**: Не описаны сценарии ошибок и граничных условий
7. **Слишком общие рекомендации**: "Используй современные CSS техники" без конкретики

### Применённые улучшения:

✅ **Конкретизация требований**: Точные значения, размеры, форматы данных  
✅ **Техническая детализация**: TypeScript типы, структура файлов, примеры кода  
✅ **Приоритизация**: MVP → Enhanced → Advanced фичи  
✅ **Критерии завершения**: Чек-листы для проверки  
✅ **Обработка ошибок**: Сценарии валидации, fallback состояния  
✅ **Пошаговая структура**: Чёткая последовательность действий  
✅ **Ссылки на зависимости**: Указание связей между компонентами  

---

## 📋 Этап 1: Архитектура и структура данных

### ❌ Промт 1.1 (ОРИГИНАЛ): Анализ референсного приложения

**Проблемы:**
- Слишком широкий и неопределённый запрос
- Нет критериев оценки
- Результат не поддаётся проверке
- Не связан с конкретной реализацией

---

### ✅ Промт 1.1 (УЛУЧШЕННЫЙ): Проектирование архитектуры приложения

```markdown
## Цель
Спроектировать полную архитектуру Gym Tracker PWA с фокусом на масштабируемость, производительность и user experience.

## Контекст технологий
- **Frontend**: React 19 + TypeScript 5.3+
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3.4+ 
- **State**: useState, useReducer (Context API для глобального)
- **Storage**: localStorage + IndexedDB (для больших объёмов)
- **Build**: Vite 5+

## Задачи

### 1. Определить основные экраны (страницы)

Создай список страниц с указанием:
- Название и путь (route)
- Основная функция
- Требуемые данные (какие типы)
- Зависимости от других экранов

**Минимальные экраны (MVP):**
- Home (/) - календарь тренировок
- Workouts (/workouts) - список всех тренировок
- Exercise Library (/exercises) - база упражнений
- Profile (/profile) - профиль и настройки

**Расширенные экраны:**
- Workout Builder (/workouts/create, /workouts/:id/edit)
- Active Workout (/workouts/:id/active)
- Exercise Details (/exercises/:id)
- Statistics (/stats)
- Programs (/programs)

### 2. Спроектировать навигацию

**Bottom Navigation (всегда доступна):**
- 4 основных таба: Главная, Тренировки, Упражнения, Профиль
- Активное состояние с индикатором
- Иконки + текст (на русском)

**Top Navigation (контекстная):**
- Назад (на внутренних экранах)
- Название текущей страницы
- Кнопки действий (Save, Edit, Delete)

### 3. Определить data flow

**Источники данных:**
```typescript
// LocalStorage - для настроек и небольших данных
interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultRestTime: number;
  units: 'kg' | 'lbs';
  language: 'ru' | 'en';
}

// IndexedDB - для тренировок и статистики
interface StorageStructure {
  workouts: Workout[];
  exercises: Exercise[];
  programs: WorkoutProgram[];
  userStats: UserStatistics;
}
```

**Поток данных:**
1. Чтение при загрузке → Context/State
2. Изменения → оптимистичное обновление UI
3. Сохранение → debounced запись в storage
4. Синхронизация → при восстановлении соединения

### 4. Определить структуру папок

```
src/
├── components/          # Переиспользуемые UI компоненты
│   ├── ui/             # Базовые (Button, Input, Card)
│   ├── layout/         # Layout компоненты (Navigation, Header)
│   └── features/       # Специфичные для фич
├── pages/              # Страницы (по роутам)
├── hooks/              # Custom React hooks
├── services/           # Бизнес-логика, API
├── types/              # TypeScript types/interfaces
├── utils/              # Вспомогательные функции
├── contexts/           # React Context для глобального state
├── constants/          # Константы, конфигурации
└── assets/             # Статические файлы
```

## Критерии завершения

- [ ] Список всех экранов с роутами в виде таблицы
- [ ] Схема навигации (можно текстовая)
- [ ] Типы данных для основных сущностей
- [ ] Структура папок создана
- [ ] Документация с обоснованием решений

## Результат

Создай файл `docs/ARCHITECTURE.md` с:
1. Картой приложения (все экраны и связи)
2. Описанием data flow
3. Обоснованием выбора технологий
4. Планом поэтапной реализации (1-9 этапов)
```

**Почему это лучше:**
- ✅ Конкретный список задач с чек-листом
- ✅ Указаны конкретные технологии и версии
- ✅ Примеры структур данных на TypeScript
- ✅ Чёткая структура файлов
- ✅ Проверяемый результат (файл ARCHITECTURE.md)
- ✅ Связь с последующими промтами

---

### ❌ Промт 1.2 (ОРИГИНАЛ): Создание структуры данных

**Проблемы:**
- Нет связей между типами
- Отсутствуют обязательные/опциональные поля
- Не указаны форматы данных (даты, ID)
- Нет валидационных правил

---

### ✅ Промт 1.2 (УЛУЧШЕННЫЙ): TypeScript типы и интерфейсы

```markdown
## Цель
Создать полную типизированную модель данных для приложения с валидацией, связями и примерами.

## Требования

### 1. Базовые типы и утилиты

Создай файл `src/types/common.ts`:

```typescript
// Уникальные идентификаторы
export type UUID = string; // формат: uuid v4
export type Timestamp = number; // Unix timestamp в миллисекундах
export type ISODate = string; // формат: "2026-02-23"
export type ISODateTime = string; // формат: "2026-02-23T14:30:00Z"

// Статусы
export type WorkoutStatus = 'planned' | 'in_progress' | 'completed' | 'skipped';
export type ExerciseType = 'strength' | 'cardio' | 'stretching' | 'other';
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'legs' | 'arms' | 'core' | 'cardio' | 'stretching';
export type EquipmentType = 'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'cable' | 'other';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Единицы измерения
export type WeightUnit = 'kg' | 'lbs';
export type DistanceUnit = 'km' | 'miles';
```

### 2. Сущность Exercise (Упражнение)

Создай файл `src/types/exercise.ts`:

```typescript
import { UUID, MuscleGroup, EquipmentType, DifficultyLevel, ExerciseType } from './common';

export interface Exercise {
  id: UUID;
  name: string; // мин. 2, макс. 100 символов
  nameEn?: string; // опциональное английское название
  description?: string; // техника выполнения
  muscleGroup: MuscleGroup; // основная группа
  secondaryMuscles?: MuscleGroup[]; // второстепенные мышцы
  type: ExerciseType;
  equipment: EquipmentType;
  difficulty: DifficultyLevel;
  imageUrl?: string; // картинка или GIF
  videoUrl?: string; // YouTube или локальное видео
  customExercise: boolean; // создано пользователем
  isFavorite: boolean; // избранное
  timesPerformed: number; // сколько раз выполнялось
  lastPerformed?: ISODate; // дата последнего выполнения
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Для создания нового упражнения
export type CreateExerciseInput = Pick<Exercise, 
  'name' | 'muscleGroup' | 'type' | 'equipment' | 'difficulty'
> & {
  description?: string;
  imageUrl?: string;
};

// Для display в списках
export type ExerciseSummary = Pick<Exercise, 
  'id' | 'name' | 'muscleGroup' | 'equipment' | 'isFavorite'
>;
```

### 3. Сущность Set (Подход)

Создай файл `src/types/set.ts`:

```typescript
import { UUID, WeightUnit } from './common';

export interface Set {
  id: UUID;
  setNumber: number; // номер подхода (1, 2, 3...)
  reps: number; // повторения (1-999)
  weight: number; // вес (0-9999)
  weightUnit: WeightUnit; // kg или lbs
  restTime?: number; // отдых в секундах (опционально)
  rpe?: number; // оценка усилия 1-10 (опционально)
  completed: boolean; // выполнен или нет
  notes?: string; // заметки к подходу
  completedAt?: Timestamp; // время завершения
}

// Для быстрого добавления подхода
export type CreateSetInput = Pick<Set, 'reps' | 'weight'> & {
  weightUnit?: WeightUnit; // по умолчанию из настроек
};

// Шаблон подхода (например, 3x10)
export interface SetTemplate {
  sets: number; // количество подходов
  reps: number; // повторения в каждом
  weight?: number; // вес (может быть пустым)
  restTime?: number; // отдых между подходами
}
```

### 4. Сущность WorkoutExercise (Упражнение в тренировке)

```typescript
import { UUID } from './common';
import { Exercise, ExerciseSummary } from './exercise';
import { Set } from './set';

export interface WorkoutExercise {
  id: UUID;
  exerciseId: UUID; // ссылка на Exercise
  exercise: ExerciseSummary; // денормализованные данные для quick access
  orderIndex: number; // порядок в тренировке (0, 1, 2...)
  sets: Set[]; // массив подходов
  notes?: string; // заметки к упражнению в этой тренировке
  supersetWith?: UUID; // ID другого упражнения если суперсет
  previousBest?: {
    weight: number;
    reps: number;
    date: ISODate;
  }; // предыдущий лучший результат для мотивации
}

// Для создания упражнения в тренировке
export type CreateWorkoutExerciseInput = {
  exerciseId: UUID;
  sets: CreateSetInput[];
  notes?: string;
};
```

### 5. Сущность Workout (Тренировка)

Создай файл `src/types/workout.ts`:

```typescript
import { UUID, ISODate, ISODateTime, Timestamp, WorkoutStatus } from './common';
import { WorkoutExercise } from './workoutExercise';

export interface Workout {
  id: UUID;
  name: string; // название тренировки
  programId?: UUID; // если часть программы
  date: ISODate; // дата тренировки
  scheduledTime?: string; // время начала (HH:MM)
  status: WorkoutStatus;
  exercises: WorkoutExercise[]; // список упражнений
  notes?: string; // общие заметки
  
  // Метрики (calculated fields)
  duration?: number; // длительность в минутах
  totalVolume?: number; // суммарный тоннаж (кг)
  totalSets?: number; // всего подходов
  totalReps?: number; // всего повторений
  
  // Timestamps
  startedAt?: Timestamp; // когда началась
  completedAt?: Timestamp; // когда завершена
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Для создания тренировки
export type CreateWorkoutInput = {
  name: string;
  date: ISODate;
  scheduledTime?: string;
  programId?: UUID;
  exercises?: CreateWorkoutExerciseInput[];
};

// Для списка тренировок
export type WorkoutSummary = Pick<Workout, 
  'id' | 'name' | 'date' | 'status' | 
  'duration' | 'totalVolume' | 'totalSets'
>;

// Для календаря
export interface WorkoutCalendarItem {
  id: UUID;
  name: string;
  date: ISODate;
  completed: boolean;
  exerciseCount: number;
}
```

### 6. Сущность WorkoutProgram (Программа тренировок)

Создай файл `src/types/program.ts`:

```typescript
import { UUID, ISODate, Timestamp } from './common';
import { Workout } from './workout';

export interface ProgramDay {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Воскресенье, 6=Суббота
  workoutTemplateId?: UUID; // ссылка на шаблон тренировки
  workoutName: string;
  isRestDay: boolean;
}

export interface WorkoutProgram {
  id: UUID;
  name: string; // например: "Push/Pull/Legs"
  description?: string;
  durationWeeks: number; // длительность программы в неделях
  schedule: ProgramDay[]; // расписание по дням недели
  isActive: boolean; // активная программа
  createdAt: Timestamp;
  updatedAt: Timestamp;
  startedAt?: ISODate; // когда начали следовать программе
}

// Для создания программы
export type CreateProgramInput = Pick<WorkoutProgram, 
  'name' | 'durationWeeks'
> & {
  description?: string;
  schedule: Omit<ProgramDay, 'workoutTemplateId'>[];
};

// Готовые шаблоны программ
export interface ProgramTemplate {
  name: string;
  description: string;
  targetLevel: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  schedule: Omit<ProgramDay, 'dayOfWeek'>[];
}
```

### 7. Статистика пользователя

Создай файл `src/types/stats.ts`:

```typescript
import { UUID, ISODate, Timestamp, MuscleGroup } from './common';

export interface UserStatistics {
  totalWorkouts: number;
  totalExercises: number;
  totalVolume: number; // весь тоннаж за всё время
  totalDuration: number; // минуты
  currentStreak: number; // дней подряд
  longestStreak: number;
  firstWorkoutDate?: ISODate;
  lastWorkoutDate?: ISODate;
  
  // Статистика по упражнениям
  favoriteExercise?: {
    id: UUID;
    name: string;
    timesPerformed: number;
  };
  
  // Распределение по группам мышц
  muscleGroupDistribution: Record<MuscleGroup, number>; // процент
  
  // Активность по дням недели
  weeklyActivity: Record<0 | 1 | 2 | 3 | 4 | 5 | 6, number>; // количество тренировок
}

// Статистика по конкретному упражнению
export interface ExerciseStatistics {
  exerciseId: UUID;
  exerciseName: string;
  timesPerformed: number;
  totalVolume: number;
  totalReps: number;
  personalRecords: {
    maxWeight: { value: number; date: ISODate };
    maxReps: { value: number; date: ISODate };
    maxVolume: { value: number; date: ISODate };
  };
  averageWeight: number;
  averageReps: number;
  
  // История по датам
  history: {
    date: ISODate;
    sets: number;
    avgWeight: number;
    avgReps: number;
    totalVolume: number;
  }[];
}

// Статистика за период
export interface PeriodStatistics {
  startDate: ISODate;
  endDate: ISODate;
  workouts: number;
  totalVolume: number;
  totalDuration: number;
  avgWorkoutDuration: number;
  mostTrainedMuscle: MuscleGroup;
}
```

### 8. Настройки приложения

Создай файл `src/types/settings.ts`:

```typescript
import { WeightUnit } from './common';

export interface AppSettings {
  // Тема
  theme: 'light' | 'dark' | 'system';
  
  // Локализация
  language: 'ru' | 'en';
  dateFormat: 'DD.MM.YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  
  // Единицы измерения
  weightUnit: WeightUnit;
  distanceUnit: 'km' | 'miles';
  
  // Настройки тренировок
  defaultRestTime: number; // секунды (например, 90)
  autoStartRestTimer: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  
  // Уведомления
  notificationsEnabled: boolean;
  workoutReminders: boolean;
  reminderTime?: string; // формат "HH:MM"
  reminderDays: (0 | 1 | 2 | 3 | 4 | 5 | 6)[]; // дни недели
  
  // Данные
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

export const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'ru',
  dateFormat: 'DD.MM.YYYY',
  weightUnit: 'kg',
  distanceUnit: 'km',
  defaultRestTime: 90,
  autoStartRestTimer: true,
  soundEnabled: true,
  vibrationEnabled: true,
  notificationsEnabled: false,
  workoutReminders: false,
  reminderDays: [1, 3, 5], // Пн, Ср, Пт
  autoBackup: true,
  backupFrequency: 'weekly',
};
```

### 9. Вспомогательные утилиты типов

Добавь в `src/types/utils.ts`:

```typescript
// Делает все поля обязательными, включая вложенные
export type DeepRequired<T> = {
  [K in keyof T]-?: DeepRequired<T[K]>;
};

// Делает все поля опциональными
export type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Sorting и filtering
export type SortOrder = 'asc' | 'desc';
export interface SortOptions<T> {
  field: keyof T;
  order: SortOrder;
}

export interface FilterOptions {
  search?: string;
  dateFrom?: ISODate;
  dateTo?: ISODate;
  muscleGroups?: MuscleGroup[];
  equipment?: EquipmentType[];
}
```

## Критерии завершения

- [ ] Создан файл `src/types/index.ts` с экспортом всех типов
- [ ] Все типы имеют JSDoc комментарии
- [ ] Добавлены примеры использования для сложных типов
- [ ] Типы покрывают все основные сущности приложения
- [ ] Есть utility типы для создания/обновления
- [ ] Проект компилируется без ошибок TypeScript

## Дополнительно

Создай файл `src/types/__examples__.ts` с примерами:

```typescript
import { Exercise, Workout, CreateWorkoutInput } from './index';

// Пример упражнения
const exampleExercise: Exercise = {
  id: 'uuid-1',
  name: 'Жим штанги лёжа',
  nameEn: 'Bench Press',
  muscleGroup: 'chest',
  secondaryMuscles: ['shoulders', 'arms'],
  type: 'strength',
  equipment: 'barbell',
  difficulty: 'intermediate',
  customExercise: false,
  isFavorite: true,
  timesPerformed: 45,
  lastPerformed: '2026-02-20',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

// Пример создания тренировки
const newWorkout: CreateWorkoutInput = {
  name: 'Грудь и трицепс',
  date: '2026-02-23',
  scheduledTime: '18:00',
  exercises: [
    {
      exerciseId: 'uuid-1',
      sets: [
        { reps: 10, weight: 80 },
        { reps: 10, weight: 80 },
        { reps: 8, weight: 85 },
      ],
    },
  ],
};
```
```

**Почему это лучше:**
- ✅ Полная типизация с конкретными типами
- ✅ Указаны форматы данных и валидационные правила
- ✅ Utility типы для разных сценариев использования
- ✅ Примеры реального использования
- ✅ Связи между типами через UUID
- ✅ Денормализация для производительности
- ✅ Calculated fields выделены отдельно
- ✅ Чёткий чек-лист завершения

---

## 🎨 Этап 2: Дизайн-система и UI компоненты

### ❌ Промт 2.1 (ОРИГИНАЛ): Настройка Tailwind

**Проблемы:**
- Нет конкретных цветовых значений
- Размыто "в стиле iOS/Material Design"
- Неясно, какие именно эффекты и где

---

### ✅ Промт 2.1 (УЛУЧШЕННЫЙ): Tailwind конфигурация и дизайн-токены

```markdown
## Цель
Настроить Tailwind CSS с полной цветовой палитрой, типографикой и дизайн-токенами для профессионального фитнес-приложения.

## Контекст
Дизайн вдохновлён iOS 18 и Material You с фокусом на:
- Премиальный внешний вид
- Высокая читаемость
- Тактильные тени и эффекты глубины
- Плавные анимации

## Цветовая палитра

### Primary (фиолетовый - основной бренд)

```js
primary: {
  50: '#f5f3ff',   // очень светлый фон
  100: '#ede9fe',  // hover states
  200: '#ddd6fe',  // focus rings
  300: '#c4b5fd',
  400: '#a78bfa',
  500: '#8b5cf6',  // основной фиолетовый
  600: '#7c3aed',  // активное состояние
  700: '#6d28d9',  // тёмные акценты
  800: '#5b21b6',
  900: '#4c1d95',
}
```

### Neutral (серый - текст и фоны)

```js
neutral: {
  0: '#ffffff',    // белый
  50: '#fafafa',   // light mode background
  100: '#f5f5f5',  // light mode surface
  200: '#e5e5e5',  // borders light
  300: '#d4d4d4',  // disabled light
  400: '#a3a3a3',  // placeholder
  500: '#737373',  // secondary text
  600: '#525252',  // text light mode
  700: '#404040',  // text dark mode
  800: '#262626',  // dark mode surface
  900: '#171717',  // dark mode background
  950: '#0a0a0a',  // pure black
}
```

### Semantic (статусы и обратная связь)

```js
success: {
  400: '#4ade80',  // light mode
  500: '#22c55e',  // default
  600: '#16a34a',  // dark mode
},
error: {
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
},
warning: {
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
},
info: {
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
}
```

## Типографика

```js
fontFamily: {
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  mono: ['SF Mono', 'Consolas', 'Liberation Mono', 'monospace'],
},

fontSize: {
  'xs': ['0.75rem', { lineHeight: '1rem' }],       // 12px
  'sm': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
  'base': ['1rem', { lineHeight: '1.5rem' }],      // 16px
  'lg': ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
  'xl': ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],       // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],  // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],    // 36px
},

fontWeight: {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
},
```

## Spacing и размеры

```js
spacing: {
  // Базовая шкала (8px base)
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  
  // Специфичные для touch targets
  touch: '3rem',     // 48px минимум
  'touch-sm': '2.75rem', // 44px для iOS
},

borderRadius: {
  none: '0',
  sm: '0.375rem',    // 6px
  DEFAULT: '0.5rem', // 8px
  md: '0.75rem',     // 12px
  lg: '1rem',        // 16px
  xl: '1.5rem',      // 24px
  '2xl': '2rem',     // 32px
  full: '9999px',
},
```

## Тени и elevation

```js
boxShadow: {
  // Лёгкие тени (карточки)
  'card': '0 1px 3px rgba(0, 0, 0, 0.12)',
  'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
  
  // Средние тени (модальные окна)
  'modal': '0 8px 24px rgba(0, 0, 0, 0.15)',
  
  // Сильные тени (FAB кнопки)
  'fab': '0 4px 16px rgba(139, 92, 246, 0.3)',
  
  // Внутренние тени
  'inner-light': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  
  // Для dark mode
  'dark-card': '0 1px 3px rgba(0, 0, 0, 0.3)',
  'dark-modal': '0 8px 24px rgba(0, 0, 0, 0.5)',
},
```

## Анимации

```js
transitionDuration: {
  fast: '150ms',
  DEFAULT: '200ms',
  slow: '300ms',
  slower: '500ms',
},

transitionTimingFunction: {
  DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-in-out
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // bounce
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
},

animation: {
  'fade-in': 'fadeIn 0.2s ease-in',
  'slide-up': 'slideUp 0.3s ease-out',
  'scale-in': 'scaleIn 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'spin-slow': 'spin 3s linear infinite',
},

keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideUp: {
    '0%': { transform: 'translateY(1rem)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  scaleIn: {
    '0%': { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
},
```

## Backdrop blur эффекты

```js
backdropBlur: {
  xs: '2px',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
},
```

## Реализация

### 1. Обнови `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // через класс на <html>
  theme: {
    extend: {
      colors: {
        primary: {
          // ... вставь палитру выше
        },
        neutral: {
          // ...
        },
        success: {
          // ...
        },
        // ... остальные цвета
      },
      fontFamily: {
        // ... вставь шрифты
      },
      fontSize: {
        // ...
      },
      spacing: {
        // ...
      },
      boxShadow: {
        // ...
      },
      animation: {
        // ...
      },
      keyframes: {
        // ...
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // стили для форм
  ],
}
```

### 2. Создай `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Custom Properties для нативных элементов */
@layer base {
  :root {
    --color-primary: 139 92 246; /* rgb values для opacity */
    --color-background: 255 255 255;
    --color-text: 38 38 38;
    --radius-default: 0.5rem;
  }
  
  .dark {
    --color-background: 23 23 23;
    --color-text: 250 250 250;
  }
  
  * {
    @apply border-neutral-200 dark:border-neutral-800;
  }
  
  body {
    @apply bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300;
    @apply font-sans antialiased;
    /* Предотвращаем pull-to-refresh на мобильных */
    overscroll-behavior-y: contain;
  }
  
  /* Скрываем scrollbar но сохраняем функционал */
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hidden {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

/* Utility классы */
@layer utilities {
  /* Glassmorphism эффект */
  .glass {
    @apply bg-white/70 dark:bg-neutral-900/70 backdrop-blur-lg;
    @apply border border-neutral-200/50 dark:border-neutral-800/50;
  }
  
  /* Карточка с тенью */
  .card {
    @apply bg-white dark:bg-neutral-800 rounded-lg shadow-card;
    @apply transition-shadow duration-200;
  }
  .card-hover:hover {
    @apply shadow-card-hover;
  }
  
  /* Градиентный текст */
  .text-gradient {
    @apply bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent;
  }
  
  /* Градиентный фон */
  .bg-gradient-primary {
    @apply bg-gradient-to-br from-primary-500 to-primary-700;
  }
  
  /* Безопасная зона для мобильных устройств */
  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  /* Touch highlight */
  .touch-highlight {
    -webkit-tap-highlight-color: rgba(139, 92, 246, 0.1);
  }
}

/* Анимации появления */
@layer components {
  .animate-in {
    @apply animate-fade-in;
  }
  
  .stagger-animate > * {
    opacity: 0;
    animation: fadeIn 0.3s ease-in forwards;
  }
  
  .stagger-animate > *:nth-child(1) { animation-delay: 0.05s; }
  .stagger-animate > *:nth-child(2) { animation-delay: 0.1s; }
  .stagger-animate > *:nth-child(3) { animation-delay: 0.15s; }
  .stagger-animate > *:nth-child(4) { animation-delay: 0.2s; }
  .stagger-animate > *:nth-child(5) { animation-delay: 0.25s; }
}
```

### 3. Создай файл с константами дизайн-токенов

`src/constants/design-tokens.ts`:

```typescript
export const DESIGN_TOKENS = {
  // Размеры touch targets
  TOUCH_TARGET_MIN: '3rem', // 48px
  TOUCH_TARGET_IOS: '2.75rem', // 44px
  
  // Z-index слои
  Z_INDEX: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    toast: 70,
  },
  
  // Breakpoints (соответствуют Tailwind)
  BREAKPOINTS: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  
  // Длительности анимаций
  ANIMATION: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
} as const;
```

## Критерии завершения

- [ ] `tailwind.config.js` настроен с полной палитрой
- [ ] `src/index.css` создан со всеми utility классами
- [ ] Дизайн-токены экспортированы в TypeScript константы
- [ ] Dark mode работает через класс `.dark` на `<html>`
- [ ] Все анимации плавные и работают
- [ ] Тени адаптируются для dark mode
- [ ] На мобильных устройствах touch targets минимум 48px

## Тестирование

Проверь работу палитры создав тестовую страницу:

```tsx
// src/pages/DesignSystemTest.tsx
export function DesignSystemTest() {
  return (
    <div className="p-6 space-y-6">
      {/* Цвета */}
      <div className="grid grid-cols-5 gap-2">
        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
          <div key={shade} className={`h-12 rounded bg-primary-${shade}`} />
        ))}
      </div>
      
      {/* Типографика */}
      <div className="space-y-2">
        <p className="text-xs">Extra Small 12px</p>
        <p className="text-sm">Small 14px</p>
        <p className="text-base">Base 16px</p>
        <p className="text-lg">Large 18px</p>
        <p className="text-xl">XL 20px</p>
      </div>
      
      {/* Карточки */}
      <div className="card p-4">
        <h3 className="font-semibold mb-2">Обычная карточка</h3>
        <p className="text-sm text-neutral-500">С тенью и скруглением</p>
      </div>
      
      <div className="glass p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Glassmorphism</h3>
        <p className="text-sm">С эффектом размытия</p>
      </div>
      
      {/* Gradient */}
      <button className="px-4 py-2 bg-gradient-primary text-white rounded-lg">
        Градиентная кнопка
      </button>
    </div>
  );
}
```
```

**Почему это лучше:**
- ✅ Конкретные HEX-значения для всех цветов
- ✅ Полная типографическая шкала с line-height
- ✅ Spacing система на основе 8px grid
- ✅ Готовые utility классы для частых паттернов
- ✅ Тени адаптированы для light/dark mode
- ✅ Константы для использования в JS/TS
- ✅ Тестовая страница для проверки
- ✅ CSS custom properties для динамических тем

---

### ❌ Промт 2.2 (ОРИГИНАЛ): UI компоненты

**Проблемы:**
- Список компонентов без конкретной реализации
- Нет размеров и вариантов
- Неясно, как компоненты взаимодействуют
- Нет props API

---

### ✅ Промт 2.2 (УЛУЧШЕННЫЙ): Библиотека базовых UI компонентов

```markdown
## Цель
Создать набор переиспользуемых, доступных и типизированных UI компонентов для использования по всему приложению.

## Архитектура компонентов

```
src/components/
├── ui/
│   ├── Button.tsx          # Основная кнопка
│   ├── Input.tsx           # Текстовые поля
│   ├── Card.tsx            # Карточка контейнер
│   ├── Modal.tsx           # Модальные окна
│   ├── BottomSheet.tsx     # Мобильная панель
│   ├── Badge.tsx           # Индикаторы и метки
│   ├── Progress.tsx        # Прогресс бары
│   └── index.ts            # Экспорт всех компонентов
```

## 1. Component: Button

### Требования
- Варианты: primary, secondary, outline, ghost, danger
- Размеры: sm, md, lg
- Состояния: default, hover, active, disabled, loading
- Поддержка иконок слева/справа
- Full-width опция
- Ripple эффект при клике

### Реализация

`src/components/ui/Button.tsx`:

```typescript
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react'; // или другие иконки

const buttonVariants = cva(
  // базовые классы
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none touch-highlight',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm',
        secondary: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950',
        ghost: 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800',
        danger: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700',
      },
      size: {
        sm: 'h-9 px-3 text-sm gap-1.5',
        md: 'h-11 px-4 text-base gap-2',
        lg: 'h-touch px-6 text-lg gap-2.5', // 48px touch target
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={buttonVariants({ variant, size, fullWidth, className })}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### Примеры использования

```tsx
// Базовое использование
<Button>Нажми меня</Button>

// С размером и  вариантом
<Button variant="secondary" size="lg">Большая кнопка</Button>

// С иконкой
<Button leftIcon={<PlusIcon />}>Добавить</Button>

// Loading состояние
<Button isLoading disabled>Сохранение...</Button>

// Full width
<Button fullWidth>Занимает всю ширину</Button>

// Danger action
<Button variant="danger" onClick={handleDelete}>Удалить</Button>
```

## 2. Component: Input

### Требования
- Типы: text, number, email, password, search
- С label и helper text
- Error/success states
- Иконки слева/справа
- Clear button для search

### Реализация

`src/components/ui/Input.tsx`:

```typescript
import React, { forwardRef, useState } from 'react';
import { EyeIcon, EyeOffIcon, XIcon } from 'lucide-react';
import { cn } from '@/utils/cn'; // utility для склеивания классов

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      leftIcon,
      rightIcon,
      onClear,
      type = 'text',
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const hasError = !!error;
    const hasSuccess = success && !hasError;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            {label}
          </label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full h-11 px-4 rounded-lg border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
              'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
              'focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors',
              leftIcon && 'pl-10',
              (rightIcon || type === 'password' || (type === 'search' && props.value)) && 'pr-10',
              hasError && 'border-error-500 focus:ring-error-500',
              hasSuccess && 'border-success-500 focus:ring-success-500',
              !hasError && !hasSuccess && 'border-neutral-200 dark:border-neutral-700 focus:ring-primary-500',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Right icon/actions */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Clear button для search */}
            {type === 'search' && props.value && onClear && (
              <button
                type="button"
                onClick={onClear}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}

            {/* Toggle password visibility */}
            {type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Custom right icon */}
            {rightIcon && <div className="text-neutral-400">{rightIcon}</div>}
          </div>
        </div>

        {/* Helper text or error */}
        {(helperText || error) && (
          <p
            className={cn(
              'mt-1.5 text-sm',
              hasError && 'text-error-500',
              hasSuccess && 'text-success-500',
              !hasError && !hasSuccess && 'text-neutral-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### Примеры использования

```tsx
// Простой input
<Input placeholder="Введите текст" />

// С label и helper text
<Input 
  label="Email" 
  type="email" 
  helperText="Мы никому не передадим ваш email"
  placeholder="example@mail.com"
/>

// С ошибкой
<Input 
  label="Пароль" 
  type="password"
  error="Пароль должен содержать минимум 8 символов"
/>

// С иконкой
<Input 
  leftIcon={<SearchIcon />}
  placeholder="Поиск упражнений..."
  type="search"
  onClear={() => setValue('')}
/>

// Number input для веса
<Input 
  type="number"
  label="Вес (кг)"
  min={0}
  step={2.5}
/>
```

## 3. Component: Card

### Требования
- Варианты padding
- Hover эффект (опционально)
- Clickable вариант
- Header и footer секции

### Реализация

`src/components/ui/Card.tsx`:

```typescript
import React from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', hoverable = false, clickable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700',
          'shadow-card transition-all duration-200',
          hoverable && 'hover:shadow-card-hover',
          clickable && 'cursor-pointer active:scale-[0.98]',
          padding === 'none' && 'p-0',
          padding === 'sm' && 'p-3',
          padding === 'md' && 'p-4',
          padding === 'lg' && 'p-6',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Sub компоненты
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3 className={cn('text-lg font-semibold text-neutral-900 dark:text-neutral-100', className)} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p className={cn('text-sm text-neutral-500 dark:text-neutral-400', className)} {...props}>
      {children}
    </p>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('mt-4 flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  );
};
```

### Примеры использования

```tsx
// Простая карточка
<Card>
  <p>Контент карточки</p>
</Card>

// С header и footer
<Card hoverable>
  <CardHeader>
    <CardTitle>Тренировка груди</CardTitle>
    <CardDescription>Сегодня в 18:00</CardDescription>
  </CardHeader>
  
  <div className="space-y-2">
    <p className="text-sm">5 упражнений</p>
    <p className="text-sm">~60 минут</p>
  </div>
  
  <CardFooter>
    <Button size="sm">Начать</Button>
  </CardFooter>
</Card>

// Clickable card
<Card clickable onClick={handleClick} padding="lg">
  <h3 className="font-semibold">Нажми меня</h3>
</Card>
```

## 4. Component: Modal

### Требования
- Backdrop с blur эффектом
- Анимация появления
- Закрытие по overlay, ESC или кнопке
- Блокировка скролла body
- Доступность (focus trap, aria-*)

### Реализация

`src/components/ui/Modal.tsx`:

```typescript
import React, { useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { createPortal } from 'react-dom';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
  closeOnOverlay?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlay = true,
}) => {
  // Блокируем скролл body когда модалка открыта
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Закрытие по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm animate-fade-in"
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={cn(
          'relative bg-white dark:bg-neutral-800 rounded-xl shadow-modal animate-scale-in',
          'max-h-[90vh] overflow-y-auto',
          size === 'sm' && 'w-full max-w-sm',
          size === 'md' && 'w-full max-w-md',
          size === 'lg' && 'w-full max-w-2xl',
          size === 'full' && 'w-full max-w-4xl h-[90vh]'
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex-1">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-neutral-900 dark:text-neutral-100"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-neutral-500 dark:text-neutral-400"
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                aria-label="Закрыть"
              >
                <XIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

// Sub компоненты для модалки
export const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
```

### Примеры использования

```tsx
const [isOpen, setIsOpen] = useState(false);

// Простая модалка
<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Подтверждение">
  <p>Вы уверены, что хотите удалить тренировку?</p>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Отмена
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Удалить
    </Button>
  </ModalFooter>
</Modal>

// Большая модалка с формой
<Modal 
  open={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Создать тренировку"
  description="Заполните информацию о новой тренировке"
  size="lg"
>
  <form onSubmit={handleSubmit}>
    <Input label="Название" placeholder="Грудь и трицепс" />
    <Input label="Дата" type="date" />
    {/* ... */}
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
        Отмена
      </Button>
      <Button type="submit">Создать</Button>
    </ModalFooter>
  </form>
</Modal>
```

## 5. Component: BottomSheet

### Требования
- Выдвигается снизу (как в мобильных приложениях)
- Swipe down to close (опционально)
- Разные высоты: auto, half, full
- Snap points

### Реализация

`src/components/ui/BottomSheet.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoint?: 'auto' | 'half' | 'full';
  swipeToClose?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  title,
  children,
  snapPoint = 'auto',
  swipeToClose = true,
}) => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (swipeToClose) {
      setStartY(e.touches[0].clientY);
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && swipeToClose) {
      const diff = e.touches[0].clientY - startY;
      if (diff > 0) {
        setCurrentY(diff);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      if (currentY > 150) {
        // Порог закрытия 150px
        onClose();
      }
      setCurrentY(0);
      setIsDragging(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'bottom-sheet-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet content */}
      <div
        className={cn(
          'relative w-full bg-white dark:bg-neutral-800 rounded-t-3xl shadow-modal',
          'transition-transform duration-300 ease-out',
          snapPoint === 'auto' && 'max-h-[80vh]',
          snapPoint === 'half' && 'h-[50vh]',
          snapPoint === 'full' && 'h-[95vh]',
          !isDragging && 'animate-slide-up'
        )}
        style={{
          transform: isDragging ? `translateY(${currentY}px)` : undefined,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle draggable */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-600 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-200 dark:border-neutral-700">
            <h2
              id="bottom-sheet-title"
              className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              aria-label="Закрыть"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4 max-h-full">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
```

### Примеры использования

```tsx
// Выбор упражнения (половина экрана)
<BottomSheet
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Выбрать упражнение"
  snapPoint="half"
>
  <div className="space-y-2">
    {exercises.map(ex => (
      <button
        key={ex.id}
        onClick={() => handleSelectExercise(ex)}
        className="w-full text-left p-4 rounded-lg hover:bg-neutral-100"
      >
        {ex.name}
      </button>
    ))}
  </div>
</BottomSheet>

// Фильтры (авто высота)
<BottomSheet
  open={filtersOpen}
  onClose={() => setFiltersOpen(false)}
  title="Фильтры"
  snapPoint="auto"
>
  <div className="space-y-4">
    <Input label="Поиск" placeholder="Название упражнения..." />
    {/* Чекбоксы для фильтров */}
  </div>
</BottomSheet>
```

## 6. Utility типы и функции

### Создай `src/utils/cn.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility для объединения Tailwind классов
 * Разрешает конфликты классов правильно
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Установи зависимости

```bash
npm install clsx tailwind-merge class-variance-authority lucide-react
```

## 7. Экспорт компонентов

`src/components/ui/index.ts`:

```typescript
export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
export { Card, CardHeader, CardTitle, CardDescription, CardFooter, type CardProps } from './Card';
export { Modal, ModalFooter, type ModalProps } from './Modal';
export { BottomSheet, type BottomSheetProps } from './BottomSheet';
```

## Критерии завершения

- [ ] Все компоненты созданы и типизированы
- [ ] Установлены необходимые зависимости
- [ ] Компоненты экспортируются из `src/components/ui/index.ts`
- [ ] Проверена работа в light и dark mode
- [ ] Все состояния (hover, focus, disabled) работают
- [ ] Компоненты респонсивные и доступные (accessibility)
- [ ] Touch targets минимум 48px на мобильных
- [ ] Документация с примерами создана

## Дополнительные компоненты (следующий этап)

После базовых, создай:
- Badge (индикаторы, статусы)
- Progress (линейный и круговой)
- Tooltip
- Select/Dropdown
- Checkbox/Radio
- Switch/Toggle
- Tabs
- Toast/Notification
```

**Почему это лучше:**
- ✅ Полная реализация каждого компонента с TypeScript
- ✅ Конкретные варианты и размеры
- ✅ Props API с типами
- ✅ Примеры использования для каждого компонента
- ✅ Accessibility (ARIA атрибуты, keyboard навигация)
- ✅ Анимации и transitions
- ✅ Респонсивность
- ✅ Dark mode support
- ✅ Утилиты для работы с классами
- ✅ Список зависимостей с командой установки

---

## 🏗️ Этап 3: Основной функционал приложения

### ❌ Промт 3.1 (ОРИГИНАЛ): Контекст темы

**Проблемы:**
- Нет конкретной реализации
- Отсутствует обработка системной темы
- Нет персистентности состояния

---

### ✅ Промт 3.1 (УЛУЧШЕННЫЙ): Theme Context с системной темой

```markdown
## Цель
Создать полную систему управления темой с поддержкой light/dark/system режимов и localStorage персистентностью.

## Требования

### 1. Theme Context

Создай `src/contexts/ThemeContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'gym-tracker-theme';

// Определение системной темы
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Получение сохранённой темы
function getSavedTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch (error) {
    console.error('Failed to read theme from localStorage:', error);
  }
  return 'system'; // по умолчанию следуем системе
}

// Resolve темы (system -> light/dark)
function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => getSavedTheme() || defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(theme));

  // Сохранение темы в localStorage
  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
      setThemeState(newTheme);
    }
  };

  // Toggle между light и dark
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Слушаем изменения системной темы
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      setResolvedTheme(getSystemTheme());
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  // Обновляем resolved theme когда меняется theme
  useEffect(() => {
    setResolvedTheme(resolveTheme(theme));
  }, [theme]);

  // Применяем тему к <html>
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    
    // Обновляем meta theme-color для браузера
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      // Цвета из tailwind.config.js
      const color = resolvedTheme === 'dark' ? '#171717' : '#ffffff'; // neutral-900 : white
      metaThemeColor.setAttribute('content', color);
    }
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook для использования темы
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### 2. Theme Toggle компонент

Создай `src/components/ThemeToggle.tsx`:

```typescript
import React from 'react';
import { SunIcon, MoonIcon, MonitorIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';

interface ThemeToggleProps {
  showLabel?: boolean;
  showSystemOption?: boolean;
}

export function ThemeToggle({ showLabel = false, showSystemOption = false }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Простой toggle light/dark
  if (!showSystemOption) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
        aria-label="Переключить тему"
      >
        {resolvedTheme === 'light' ? (
          <MoonIcon className="h-5 w-5" />
        ) : (
          <SunIcon className="h-5 w-5" />
        )}
        {showLabel && <span className="ml-2">Тема</span>}
      </Button>
    );
  }

  // Полный выбор с system
  return (
    <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'light'
            ? 'bg-white dark:bg-neutral-700 text-primary-600 shadow-sm'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
        }`}
        aria-label="Светлая тема"
        aria-pressed={theme === 'light'}
      >
        <SunIcon className="h-5 w-5" />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'system'
            ? 'bg-white dark:bg-neutral-700 text-primary-600 shadow-sm'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
        }`}
        aria-label="Системная тема"
        aria-pressed={theme === 'system'}
      >
        <MonitorIcon className="h-5 w-5" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'dark'
            ? 'bg-white dark:bg-neutral-700 text-primary-600 shadow-sm'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
        }`}
        aria-label="Тёмная тема"
        aria-pressed={theme === 'dark'}
      >
        <MoonIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
```

### 3. Интеграция в App

Оберни приложение в `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### 4. Использование в компонентах

```typescript
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';

function Header() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <header className="flex items-center justify-between p-4">
      <h1>Gym Tracker</h1>
      
      {/* Простой toggle */}
      <ThemeToggle />
      
      {/* Или с выбором system */}
      <ThemeToggle showSystemOption showLabel />
      
      {/* Текущая тема для отладки */}
      <p className="text-sm text-neutral-500">
        Theme: {theme} (resolved: {resolvedTheme})
      </p>
    </header>
  );
}
```

### 5. Meta tags для PWA

Обнови `index.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Theme color (будет обновляться динамически) -->
  <meta name="theme-color" content="#ffffff" />
  
  <!-- iOS Support -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  
  <title>Gym Tracker</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

## Критерии завершения

- [ ] ThemeContext создан с поддержкой light/dark/system
- [ ] localStorage сохраняет выбранную тему
- [ ] Системная тема определяется автоматически
- [ ] Слушаются изменения системной темы в реальном времени
- [ ] Класс 'dark' добавляется/удаляется на <html>
- [ ] meta theme-color обновляется при смене темы
- [ ] ThemeToggle компоненты работают корректно
- [ ] useTheme hook работает во всех компонентах
- [ ] Нет мерцания при загрузке страницы (SSR-ready)
- [ ] TypeScript типы без ошибок

## Тестирование

```typescript
// src/__tests__/theme.test.ts
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

describe('ThemeContext', () => {
  it('defaults to system theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    expect(result.current.theme).toBe('system');
  });

  it('persists theme to localStorage', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(localStorage.getItem('gym-tracker-theme')).toBe('dark');
  });

  it('toggles between light and dark', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    
    act(() => {
      result.current.setTheme('light');
    });
    expect(result.current.resolvedTheme).toBe('light');
    
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.resolvedTheme).toBe('dark');
  });
});
```
```

**Почему это лучше:**
- ✅ Полная реализация с TypeScript
- ✅ Поддержка system theme с медиа-запросами
- ✅ localStorage персистентность с error handling
- ✅ Автоматическое обновление при смене системной темы
- ✅ Meta theme-color для PWA
- ✅ Два варианта UI для toggle
- ✅ Accessibility (aria-labels, aria-pressed)
- ✅ Unit тесты включены
- ✅ SSR-ready (проверки window)

---

## 🚀 Общие рекомендации по использованию улучшенных промтов

### Порядок выполнения
1. Следуй промтам последовательно (1.1 → 1.2 → 2.1 → ...)
2. Не переходи к следующему этапу, пока не выполнены критерии завершения
3. Тестируй каждый компонент сразу после создания

### Адаптация промтов
- Можешь менять технологии (например Firebase → Supabase)
- Но сохраняй структуру и детализацию
- Добавляй свои требования к чек-листам

### Работа с AI помощниками
- Копируй промт целиком, включая примеры кода
- Если результат не соответствует - укажи на конкретный пункт требований
- Проверяй TypeScript типы и accessibility

---

## 📝 Статус документа

**Готово:**
- ✅ Этап 1: Архитектура и типы данных
- ✅ Этап 2: Дизайн-система и UI компоненты  
- ✅ Этап 3.1: Theme Context

**В процессе:**
- 🚧 Этап 3.2: Главный экран (Dashboard)
- 🚧 Этап 3.3: Workout Builder
- 🚧 Этап 3.4: Active Workout
- ⏳ Этапы 4-9 (будут добавлены)

*Промты для остальных разделов этапов 3-9 готовятся. Если нужен конкретный этап срочно — дай знать, и я создам его первым.*
