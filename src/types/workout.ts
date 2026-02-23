// Базовые типы данных
export type UUID = string;
export type ISODate = string; // формат YYYY-MM-DD
export type Timestamp = number; // миллисекунды с эпохи

// Категории мышечных групп
export type ExerciseCategory = 
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'cardio'
  | 'other';

// Тип упражнения
export type ExerciseType = 'strength' | 'cardio' | 'stretching';

// Статус тренировки
export type WorkoutStatus = 'planned' | 'completed' | 'in-progress' | 'skipped';

// Дни недели для расписания
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Set - подход
export interface Set {
  id: string;
  reps: number;
  weight: number; // kg
  restTime?: number; // секунды отдыха
  rpe?: number; // Rate of Perceived Exertion (1-10)
  completed: boolean;
  notes?: string;
  timestamp?: Date; // когда был выполнен
}

// Personal Record - персональный рекорд
export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;
  maxReps: number;
  maxVolume: number; // вес * повторения
  date: Date;
}

// Exercise - упражнение
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  type: ExerciseType;
  sets: Set[];
  equipment?: string; // штанга, гантели, тренажер
  targetMuscles?: string[]; // целевые мышцы
  instructions?: string; // инструкции по выполнению
  videoUrl?: string; // ссылка на видео техники
  personalRecords?: PersonalRecord; // PR для этого упражнения
}

// Workout - отдельная тренировка
export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: Exercise[];
  duration?: number; // длительность в минутах
  status: WorkoutStatus;
  notes?: string;
  totalVolume?: number; // общий тоннаж
  totalSets?: number; // общее количество подходов
  totalReps?: number; // общее количество повторений
  programId?: string; // ID программы, если входит в программу
  dayOfWeek?: DayOfWeek; // день недели для расписания
  scheduledTime?: string; // время начала (формат HH:MM)
  startedAt?: Timestamp; // когда начата тренировка
  completedAt?: Timestamp; // когда завершена тренировка
  updatedAt?: Timestamp; // последнее обновление
}

// WorkoutProgram - программа тренировок (сплит)
export interface WorkoutProgram {
  id: string;
  name: string; // например: "Push/Pull/Legs"
  description?: string;
  workouts: Workout[]; // шаблоны тренировок
  schedule: {
    [key in DayOfWeek]?: string; // ID тренировки для этого дня
  };
  duration?: number; // длительность программы в неделях
  createdAt: Date;
  isActive?: boolean; // активная программа
}

// ExerciseStats - статистика по упражнению
export interface ExerciseStats {
  exerciseId: string;
  exerciseName: string;
  totalVolume: number; // общий тоннаж за все время
  totalSets: number;
  totalReps: number;
  maxWeight: number; // максимальный вес
  averageWeight: number; // средний вес
  volumeByPeriod: {
    date: Date;
    volume: number;
  }[]; // объем по периодам для графиков
  performanceHistory: {
    date: Date;
    sets: Set[];
    totalVolume: number;
  }[]; // история выполнения
  personalRecords: PersonalRecord[];
  lastPerformed?: Date; // когда последний раз выполнялось
  frequency: number; // как часто выполняется (раз в неделю)
}

// WorkoutSummary - краткая статистика тренировки
export interface WorkoutSummary {
  totalWorkouts: number;
  totalVolume: number;
  totalDuration: number; // минуты
  averageDuration: number;
  currentStreak: number; // дней подряд
  longestStreak: number;
  favoriteExercise?: string;
  mostTrainedMuscleGroup?: ExerciseCategory;
}

// Achievement - достижение
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number; // 0-100
  target?: number;
}

// ScheduledWorkout - запланированная тренировка на конкретную дату
export interface ScheduledWorkout {
  id: string;
  name: string;
  date: string; // формат YYYY-MM-DD
  exercises: {
    id: string;
    name: string;
    category: ExerciseCategory;
    sets: number;
    reps: number;
  }[];
  notes?: string;
  completed: boolean;
  programId?: string; // если часть программы
}

// WorkoutListItem - упрощенный элемент списка тренировок
export interface WorkoutListItem {
  id: string;
  name: string;
  date: ISODate;
  status: WorkoutStatus;
  duration?: number;
  totalVolume?: number;
  totalSets?: number;
}

// WorkoutCalendarItem - элемент для календаря
export interface WorkoutCalendarItem {
  date: ISODate;
  workouts: {
    id: string;
    name: string;
    status: WorkoutStatus;
  }[];
  hasWorkout: boolean;
}

// CreateWorkoutInput - данные для создания тренировки
export interface CreateWorkoutInput {
  name: string;
  date?: ISODate;
  exercises?: Exercise[];
  notes?: string;
  scheduledTime?: string;
  programId?: string;
}

// MonthStats - статистика за месяц
export interface MonthStats {
  month: string; // формат YYYY-MM
  totalWorkouts: number;
  completedWorkouts: number;
  totalDuration: number;
  totalVolume: number;
  averageWorkoutsPerWeek: number;
}
