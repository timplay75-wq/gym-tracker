// Эмодзи для мышечных групп
export const MUSCLE_EMOJIS = {
  // СПИНА
  back: '🔙',
  trapezius: '🔺',
  lats: '🦅',
  lowerBack: '⬇️',
  
  // ГРУДЬ
  chest: '🫀',
  pecs: '❤️',
  
  // ПЛЕЧИ
  shoulders: '🏔️',
  deltoids: '🔶',
  frontDelts: '▶️',
  sideDelts: '↔️',
  rearDelts: '◀️',
  
  // РУКИ
  arms: '💪',
  biceps: '💪',
  triceps: '🦾',
  forearms: '🤜',
  
  // НОГИ
  legs: '🦵',
  quads: '⚡',
  hamstrings: '🦴',
  glutes: '🍑',
  calves: '🥾',
  
  // ПРЕСС
  abs: '⬜',
  core: '🎯',
  obliques: '〰️',
  
  // ДРУГОЕ
  fullBody: '🏋️',
  cardio: '❤️‍🔥',
  hiit: '🔥',
  stretching: '🧘',
} as const;

export type MuscleGroup = keyof typeof MUSCLE_EMOJIS;

// Названия на русском
export const MUSCLE_NAMES: Record<MuscleGroup, string> = {
  back: 'Спина',
  trapezius: 'Трапеция',
  lats: 'Широчайшие',
  lowerBack: 'Низ спины',
  
  chest: 'Грудь',
  pecs: 'Грудные',
  
  shoulders: 'Плечи',
  deltoids: 'Дельты',
  frontDelts: 'Передние дельты',
  sideDelts: 'Средние дельты',
  rearDelts: 'Задние дельты',
  
  arms: 'Руки',
  biceps: 'Бицепс',
  triceps: 'Трицепс',
  forearms: 'Предплечья',
  
  legs: 'Ноги',
  quads: 'Квадрицепсы',
  hamstrings: 'Бицепс бедра',
  glutes: 'Ягодицы',
  calves: 'Икры',
  
  abs: 'Пресс',
  core: 'Кор',
  obliques: 'Косые',
  
  fullBody: 'Всё тело',
  cardio: 'Кардио',
  hiit: 'HIIT',
  stretching: 'Растяжка',
};
