import type { Workout } from '@/types';

/**
 * Генерация тестовых тренировок для проверки функций фильтрации
 * Запустите в консоли браузера: generateTestWorkouts()
 */

export const generateTestWorkouts = (): Workout[] => {
  const workoutTemplates = [
    {
      name: 'Грудь и трицепс',
      exercises: [
        {
          id: '1',
          name: 'Жим штанги лежа',
          category: 'chest' as const,
          type: 'strength' as const,
          sets: [
            { id: '1', weight: 60, reps: 10, completed: true },
            { id: '2', weight: 60, reps: 10, completed: true },
            { id: '3', weight: 60, reps: 8, completed: true },
          ],
        },
        {
          id: '2',
          name: 'Разводка гантелей',
          category: 'chest' as const,
          type: 'strength' as const,
          sets: [
            { id: '1', weight: 12, reps: 15, completed: true },
            { id: '2', weight: 12, reps: 15, completed: true },
            { id: '3', weight: 12, reps: 12, completed: true },
          ],
        },
        {
          id: '3',
          name: 'Французский жим',
          category: 'arms' as const,
          type: 'strength' as const,
          sets: [
            { id: '1', weight: 20, reps: 12, completed: true },
            { id: '2', weight: 20, reps: 12, completed: true },
          ],
        },
      ],
      duration: 45,
    },
    {
      name: 'Спина и бицепс',
      exercises: [
        {
          id: '4',
          name: 'Становая тяга',
          category: 'back' as const,
          type: 'strength' as const,
          sets: [
            { id: '1', weight: 100, reps: 5, completed: true },
            { id: '2', weight: 100, reps: 5, completed: true },
            { id: '3', weight: 100, reps: 5, completed: true },
          ],
        },
        {
          id: '5',
          name: 'Тяга штанги в наклоне',
          category: 'back' as const,
          type: 'strength' as const,
          sets: [
            { id: '1', weight: 50, reps: 10, completed: true },
            { id: '2', weight: 50, reps: 10, completed: true },
            { id: '3', weight: 50, reps: 8, completed: true },
          ],
        },
        {
          id: '6',
          name: 'Сгибание рук со штангой',
          category: 'arms' as const,
          type: 'strength' as const,
          sets: [
            { id: '1', weight: 25, reps: 12, completed: true },
            { id: '2', weight: 25, reps: 10, completed: true },
          ],
        },
      ],
      duration: 50,
    },
    {
      name: 'Ноги',
      exercises: [
        {
          id: '7',
          name: 'Приседания со штангой',
          category: 'legs' as const,
          type: 'strength' as const,
          sets: [
            { id: '1', weight: 80, reps: 10, completed: true },
            { id: '2', weight: 80, reps: 10, completed: true },
            { id: '3', weight: 80, reps: 10, completed: true },
            { id: '4', weight: 80, reps: 8, completed: true },
          ],
        },
        {
          id: '8',
          name: 'Жим ногами',
          category: 'legs' as const,
          type: 'strength' as const,
          sets: [
            { id: '1', weight: 120, reps: 15, completed: true },
            { id: '2', weight: 120, reps: 15, completed: true },
            { id: '3', weight: 120, reps: 12, completed: true },
          ],
        },
      ],
      duration: 40,
    },
    {
      name: 'Плечи',
      exercises: [
        {
          id: '9',
          name: 'Жим штанги стоя',
          category: 'shoulders' as const,
          type: 'strength' as const,
          sets: [
            { id: '1', weight: 40, reps: 10, completed: true },
            { id: '2', weight: 40, reps: 10, completed: true },
            { id: '3', weight: 40, reps: 8, completed: true },
          ],
        },
        {
          id: '10',
          name: 'Разведение гантелей в стороны',
          category: 'shoulders' as const,
          type: 'strength' as const,
          sets: [
            { id: '1', weight: 8, reps: 15, completed: true },
            { id: '2', weight: 8, reps: 15, completed: true },
            { id: '3', weight: 8, reps: 12, completed: true },
          ],
        },
      ],
      duration: 35,
    },
  ];

  const testWorkouts: Workout[] = [];
  const now = new Date();

  // Генерируем тренировки за последние 3 месяца
  workoutTemplates.forEach((template, templateIndex) => {
    // 2-3 тренировки каждого типа в месяц
    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      for (let i = 0; i < 2; i++) {
        const date = new Date();
        date.setMonth(now.getMonth() - monthOffset);
        date.setDate(Math.floor(Math.random() * 28) + 1);
        
        testWorkouts.push({
          id: `test-${templateIndex}-${monthOffset}-${i}`,
          name: template.name,
          date,
          exercises: template.exercises,
          duration: template.duration,
          status: 'completed',
        });
      }
    }
  });

  // Добавляем несколько тренировок за эту неделю
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i * 2);
    
    const template = workoutTemplates[i % workoutTemplates.length];
    testWorkouts.push({
      id: `test-week-${i}`,
      name: template.name,
      date,
      exercises: template.exercises,
      duration: template.duration,
      status: 'completed',
    });
  }

  return testWorkouts;
};

// Функция для загрузки тестовых данных в localStorage
export const loadTestWorkouts = () => {
  const testWorkouts = generateTestWorkouts();
  localStorage.setItem('gym-tracker-workouts', JSON.stringify(testWorkouts));
  console.log(`✅ Загружено ${testWorkouts.length} тестовых тренировок!`);
  console.log('🔄 Обновите страницу для применения изменений.');
  return testWorkouts;
};

// Экспортируем в window для вызова из консоли
if (typeof window !== 'undefined') {
  (window as any).loadTestWorkouts = loadTestWorkouts;
  (window as any).generateTestWorkouts = generateTestWorkouts;
}
