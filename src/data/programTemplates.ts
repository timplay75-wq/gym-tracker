import type { useLanguage } from '@/i18n';

export interface ProgramExercise {
  name: string;
  category: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
}

export interface ProgramDay {
  _id?: string;
  dayOfWeek: string;
  name: string;
  exercises: ProgramExercise[];
}

export interface Program {
  _id: string;
  name: string;
  description?: string;
  days: ProgramDay[];
  isActive: boolean;
  durationWeeks?: number;
  createdAt: string;
}

export function getTemplates(t: ReturnType<typeof useLanguage>['t']) {
  return [
    {
      id: 'ppl',
      name: t.programs.tpl.ppl,
      description: t.programs.tpl.pplDesc,
      color: '#9333ea',
      durationWeeks: 8,
      days: [
        { dayOfWeek: 'monday', name: 'Push', exercises: [
          { name: 'Жим штанги лежа', category: 'chest', sets: 4, reps: 8, weight: 0, restTime: 120 },
          { name: 'Армейский жим стоя', category: 'shoulders', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Жим гантелей на наклонной скамье', category: 'chest', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Разведение гантелей в стороны', category: 'shoulders', sets: 3, reps: 15, weight: 0, restTime: 60 },
          { name: 'Разгибания на трицепс на блоке', category: 'arms', sets: 3, reps: 12, weight: 0, restTime: 60 },
        ]},
        { dayOfWeek: 'tuesday', name: 'Pull', exercises: [
          { name: 'Становая тяга', category: 'back', sets: 4, reps: 6, weight: 0, restTime: 180 },
          { name: 'Подтягивания широким хватом', category: 'back', sets: 3, reps: 8, weight: 0, restTime: 90 },
          { name: 'Тяга штанги в наклоне', category: 'back', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Тяга к лицу', category: 'shoulders', sets: 3, reps: 15, weight: 0, restTime: 60 },
          { name: 'Подъем штанги на бицепс', category: 'arms', sets: 3, reps: 12, weight: 0, restTime: 60 },
        ]},
        { dayOfWeek: 'wednesday', name: 'Ноги', exercises: [
          { name: 'Приседания со штангой', category: 'legs', sets: 4, reps: 8, weight: 0, restTime: 180 },
          { name: 'Румынская тяга', category: 'legs', sets: 3, reps: 10, weight: 0, restTime: 120 },
          { name: 'Жим ногами в тренажере', category: 'legs', sets: 3, reps: 12, weight: 0, restTime: 90 },
          { name: 'Сгибания ног в тренажере', category: 'legs', sets: 3, reps: 12, weight: 0, restTime: 60 },
          { name: 'Подъем на носки', category: 'legs', sets: 4, reps: 15, weight: 0, restTime: 60 },
        ]},
        { dayOfWeek: 'thursday', name: 'Push B', exercises: [
          { name: 'Армейский жим стоя', category: 'shoulders', sets: 4, reps: 8, weight: 0, restTime: 120 },
          { name: 'Жим гантелей лежа', category: 'chest', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Сведение рук в тренажере', category: 'chest', sets: 3, reps: 12, weight: 0, restTime: 60 },
          { name: 'Разведение гантелей в стороны', category: 'shoulders', sets: 3, reps: 15, weight: 0, restTime: 60 },
          { name: 'Французский жим лежа со штангой', category: 'arms', sets: 3, reps: 12, weight: 0, restTime: 60 },
        ]},
        { dayOfWeek: 'friday', name: 'Pull B', exercises: [
          { name: 'Тяга штанги в наклоне', category: 'back', sets: 4, reps: 8, weight: 0, restTime: 120 },
          { name: 'Тяга верхнего блока', category: 'back', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Тяга нижнего блока', category: 'back', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Обратные разведения', category: 'shoulders', sets: 3, reps: 15, weight: 0, restTime: 60 },
          { name: 'Молотки на бицепс', category: 'arms', sets: 3, reps: 12, weight: 0, restTime: 60 },
        ]},
        { dayOfWeek: 'saturday', name: 'Ноги B', exercises: [
          { name: 'Фронтальные приседания', category: 'legs', sets: 4, reps: 8, weight: 0, restTime: 180 },
          { name: 'Ягодичный мост', category: 'legs', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Выпады со штангой', category: 'legs', sets: 3, reps: 12, weight: 0, restTime: 90 },
          { name: 'Разгибания ног в тренажере', category: 'legs', sets: 3, reps: 12, weight: 0, restTime: 60 },
          { name: 'Подъем на носки', category: 'legs', sets: 4, reps: 15, weight: 0, restTime: 60 },
        ]},
      ],
    },
    {
      id: 'upper-lower',
      name: t.programs.tpl.upperLower,
      description: t.programs.tpl.upperLowerDesc,
      color: '#3b82f6',
      durationWeeks: 8,
      days: [
        { dayOfWeek: 'monday', name: 'Верх A', exercises: [
          { name: 'Жим штанги лежа', category: 'chest', sets: 4, reps: 8, weight: 0, restTime: 120 },
          { name: 'Тяга штанги в наклоне', category: 'back', sets: 4, reps: 8, weight: 0, restTime: 120 },
          { name: 'Армейский жим стоя', category: 'shoulders', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Подтягивания широким хватом', category: 'back', sets: 3, reps: 8, weight: 0, restTime: 90 },
          { name: 'Подъем штанги на бицепс', category: 'arms', sets: 2, reps: 12, weight: 0, restTime: 60 },
          { name: 'Разгибания на трицепс на блоке', category: 'arms', sets: 2, reps: 12, weight: 0, restTime: 60 },
        ]},
        { dayOfWeek: 'tuesday', name: 'Низ A', exercises: [
          { name: 'Приседания со штангой', category: 'legs', sets: 4, reps: 8, weight: 0, restTime: 180 },
          { name: 'Румынская тяга', category: 'legs', sets: 3, reps: 10, weight: 0, restTime: 120 },
          { name: 'Жим ногами в тренажере', category: 'legs', sets: 3, reps: 12, weight: 0, restTime: 90 },
          { name: 'Сгибания ног в тренажере', category: 'legs', sets: 3, reps: 12, weight: 0, restTime: 60 },
          { name: 'Подъем на носки', category: 'legs', sets: 4, reps: 15, weight: 0, restTime: 60 },
        ]},
        { dayOfWeek: 'thursday', name: 'Верх B', exercises: [
          { name: 'Жим гантелей лежа', category: 'chest', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Тяга нижнего блока', category: 'back', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Разведение гантелей в стороны', category: 'shoulders', sets: 3, reps: 15, weight: 0, restTime: 60 },
          { name: 'Тяга верхнего блока', category: 'back', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Молотки на бицепс', category: 'arms', sets: 2, reps: 12, weight: 0, restTime: 60 },
          { name: 'Французский жим лежа со штангой', category: 'arms', sets: 2, reps: 12, weight: 0, restTime: 60 },
        ]},
        { dayOfWeek: 'friday', name: 'Низ B', exercises: [
          { name: 'Становая тяга', category: 'legs', sets: 4, reps: 6, weight: 0, restTime: 180 },
          { name: 'Фронтальные приседания', category: 'legs', sets: 3, reps: 8, weight: 0, restTime: 120 },
          { name: 'Ягодичный мост', category: 'legs', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Разгибания ног в тренажере', category: 'legs', sets: 3, reps: 12, weight: 0, restTime: 60 },
          { name: 'Подъем на носки', category: 'legs', sets: 4, reps: 15, weight: 0, restTime: 60 },
        ]},
      ],
    },
    {
      id: 'full-body',
      name: t.programs.tpl.fullBody,
      description: t.programs.tpl.fullBodyDesc,
      color: '#22c55e',
      durationWeeks: 8,
      days: [
        { dayOfWeek: 'monday', name: 'Всё тело A', exercises: [
          { name: 'Приседания со штангой', category: 'legs', sets: 4, reps: 8, weight: 0, restTime: 180 },
          { name: 'Жим штанги лежа', category: 'chest', sets: 4, reps: 8, weight: 0, restTime: 120 },
          { name: 'Тяга штанги в наклоне', category: 'back', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Армейский жим стоя', category: 'shoulders', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Подъем штанги на бицепс', category: 'arms', sets: 2, reps: 12, weight: 0, restTime: 60 },
        ]},
        { dayOfWeek: 'wednesday', name: 'Всё тело B', exercises: [
          { name: 'Становая тяга', category: 'back', sets: 4, reps: 6, weight: 0, restTime: 180 },
          { name: 'Жим гантелей лежа', category: 'chest', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Тяга верхнего блока', category: 'back', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Разведение гантелей в стороны', category: 'shoulders', sets: 3, reps: 15, weight: 0, restTime: 60 },
          { name: 'Жим ногами в тренажере', category: 'legs', sets: 3, reps: 12, weight: 0, restTime: 90 },
        ]},
        { dayOfWeek: 'friday', name: 'Всё тело C', exercises: [
          { name: 'Фронтальные приседания', category: 'legs', sets: 3, reps: 8, weight: 0, restTime: 120 },
          { name: 'Жим гантелей на наклонной скамье', category: 'chest', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Тяга нижнего блока', category: 'back', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Тяга к лицу', category: 'shoulders', sets: 3, reps: 15, weight: 0, restTime: 60 },
          { name: 'Выпады со штангой', category: 'legs', sets: 3, reps: 12, weight: 0, restTime: 90 },
        ]},
      ],
    },
    {
      id: 'bro-split',
      name: t.programs.tpl.broSplit,
      description: t.programs.tpl.broSplitDesc,
      color: '#f59e0b',
      durationWeeks: 8,
      days: [
        { dayOfWeek: 'monday', name: 'Грудь', exercises: [
          { name: 'Жим штанги лежа', category: 'chest', sets: 4, reps: 8, weight: 0, restTime: 120 },
          { name: 'Жим гантелей на наклонной скамье', category: 'chest', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Сведение рук в тренажере', category: 'chest', sets: 3, reps: 12, weight: 0, restTime: 60 },
          { name: 'Отжимания на брусьях', category: 'chest', sets: 3, reps: 10, weight: 0, restTime: 90 },
        ]},
        { dayOfWeek: 'tuesday', name: 'Спина', exercises: [
          { name: 'Становая тяга', category: 'back', sets: 4, reps: 6, weight: 0, restTime: 180 },
          { name: 'Подтягивания широким хватом', category: 'back', sets: 3, reps: 8, weight: 0, restTime: 90 },
          { name: 'Тяга штанги в наклоне', category: 'back', sets: 3, reps: 10, weight: 0, restTime: 90 },
          { name: 'Тяга верхнего блока', category: 'back', sets: 3, reps: 10, weight: 0, restTime: 90 },
        ]},
        { dayOfWeek: 'wednesday', name: 'Плечи', exercises: [
          { name: 'Армейский жим стоя', category: 'shoulders', sets: 4, reps: 8, weight: 0, restTime: 120 },
          { name: 'Разведение гантелей в стороны', category: 'shoulders', sets: 3, reps: 15, weight: 0, restTime: 60 },
          { name: 'Тяга к лицу', category: 'shoulders', sets: 3, reps: 15, weight: 0, restTime: 60 },
          { name: 'Обратные разведения', category: 'shoulders', sets: 3, reps: 15, weight: 0, restTime: 60 },
        ]},
        { dayOfWeek: 'thursday', name: 'Ноги', exercises: [
          { name: 'Приседания со штангой', category: 'legs', sets: 4, reps: 8, weight: 0, restTime: 180 },
          { name: 'Румынская тяга', category: 'legs', sets: 3, reps: 10, weight: 0, restTime: 120 },
          { name: 'Жим ногами в тренажере', category: 'legs', sets: 3, reps: 12, weight: 0, restTime: 90 },
          { name: 'Сгибания ног в тренажере', category: 'legs', sets: 3, reps: 12, weight: 0, restTime: 60 },
          { name: 'Подъем на носки', category: 'legs', sets: 4, reps: 15, weight: 0, restTime: 60 },
        ]},
        { dayOfWeek: 'friday', name: 'Руки', exercises: [
          { name: 'Подъем штанги на бицепс', category: 'arms', sets: 3, reps: 10, weight: 0, restTime: 60 },
          { name: 'Французский жим лежа со штангой', category: 'arms', sets: 3, reps: 10, weight: 0, restTime: 60 },
          { name: 'Молотки на бицепс', category: 'arms', sets: 3, reps: 12, weight: 0, restTime: 60 },
          { name: 'Разгибания на трицепс на блоке', category: 'arms', sets: 3, reps: 12, weight: 0, restTime: 60 },
          { name: 'Концентрированные подъемы на бицепс', category: 'arms', sets: 2, reps: 15, weight: 0, restTime: 60 },
        ]},
      ],
    },
  ];
}
