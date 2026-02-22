import type { ScheduledWorkout } from '@/types/workout';

const STORAGE_KEY = 'gym-tracker-scheduled-workouts';

export const scheduleService = {
  // Получить все запланированные тренировки
  getScheduledWorkouts: (): ScheduledWorkout[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Получить тренировки на конкретную дату
  getWorkoutsByDate: (date: string): ScheduledWorkout[] => {
    const allWorkouts = scheduleService.getScheduledWorkouts();
    return allWorkouts.filter(w => w.date === date);
  },

  // Получить тренировки на сегодня
  getTodayWorkouts: (): ScheduledWorkout[] => {
    const today = new Date().toISOString().split('T')[0];
    return scheduleService.getWorkoutsByDate(today);
  },

  // Добавить запланированную тренировку
  addScheduledWorkout: (workout: ScheduledWorkout): void => {
    const workouts = scheduleService.getScheduledWorkouts();
    workouts.push(workout);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  },

  // Обновить запланированную тренировку
  updateScheduledWorkout: (id: string, updates: Partial<ScheduledWorkout>): void => {
    const workouts = scheduleService.getScheduledWorkouts();
    const index = workouts.findIndex(w => w.id === id);
    if (index >= 0) {
      workouts[index] = { ...workouts[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    }
  },

  // Отметить тренировку как выполненную
  markAsCompleted: (id: string): void => {
    scheduleService.updateScheduledWorkout(id, { completed: true });
  },

  // Удалить запланированную тренировку
  deleteScheduledWorkout: (id: string): void => {
    const workouts = scheduleService.getScheduledWorkouts();
    const filtered = workouts.filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Создать пример тренировок для демонстрации
  createSampleWorkouts: (): void => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const sampleWorkouts: ScheduledWorkout[] = [
      {
        id: '1',
        name: 'Грудь и трицепс',
        date: todayStr,
        completed: false,
        exercises: [
          { id: 'e1', name: 'Жим штанги лежа', category: 'chest', sets: 4, reps: 10 },
          { id: 'e2', name: 'Жим гантелей на наклонной', category: 'chest', sets: 3, reps: 12 },
          { id: 'e3', name: 'Разводка гантелей', category: 'chest', sets: 3, reps: 15 },
          { id: 'e4', name: 'Французский жим', category: 'arms', sets: 3, reps: 12 },
        ],
      },
      {
        id: '2',
        name: 'Кардио',
        date: todayStr,
        completed: false,
        exercises: [
          { id: 'e5', name: 'Бег', category: 'cardio', sets: 1, reps: 30 },
          { id: 'e6', name: 'Растяжка', category: 'other', sets: 1, reps: 10 },
        ],
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleWorkouts));
  },
};
