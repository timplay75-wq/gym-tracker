// Детальные группы мышц с эмодзи
export const MUSCLE_GROUPS = {
  // Грудь
  'chest-upper': { name: 'Верх груди', emoji: '💪', category: 'chest' },
  'chest-middle': { name: 'Середина груди', emoji: '💪', category: 'chest' },
  'chest-lower': { name: 'Низ груди', emoji: '💪', category: 'chest' },
  
  // Спина
  'back-lats': { name: 'Широчайшая', emoji: '🦾', category: 'back' },
  'back-traps': { name: 'Трапеция', emoji: '🦾', category: 'back' },
  'back-lower': { name: 'Поясница', emoji: '🦾', category: 'back' },
  'back-rhomboids': { name: 'Ромбовидная', emoji: '🦾', category: 'back' },
  
  // Руки
  'arms-biceps': { name: 'Бицепс', emoji: '💪', category: 'arms' },
  'arms-triceps': { name: 'Трицепс', emoji: '💪', category: 'arms' },
  'arms-forearms': { name: 'Предплечье', emoji: '💪', category: 'arms' },
  
  // Плечи
  'shoulders-front': { name: 'Передняя дельта', emoji: '🏋️', category: 'shoulders' },
  'shoulders-middle': { name: 'Средняя дельта', emoji: '🏋️', category: 'shoulders' },
  'shoulders-rear': { name: 'Задняя дельта', emoji: '🏋️', category: 'shoulders' },
  
  // Ноги
  'legs-quads': { name: 'Квадрицепс', emoji: '🦵', category: 'legs' },
  'legs-hamstrings': { name: 'Бицепс бедра', emoji: '🦵', category: 'legs' },
  'legs-glutes': { name: 'Ягодицы', emoji: '🦵', category: 'legs' },
  'legs-calves': { name: 'Икры', emoji: '🦵', category: 'legs' },
  
  // Пресс
  'core-upper': { name: 'Верх пресса', emoji: '🔥', category: 'core' },
  'core-lower': { name: 'Низ пресса', emoji: '🔥', category: 'core' },
  'core-obliques': { name: 'Косые мышцы', emoji: '🔥', category: 'core' },
  
  // Кардио
  'cardio': { name: 'Кардио', emoji: '🏃', category: 'cardio' },
} as const;

export type MuscleGroupKey = keyof typeof MUSCLE_GROUPS;

// Упражнения с детальными группами мышц
export const DETAILED_EXERCISES: Array<{
  id: string;
  name: string;
  muscleGroup: MuscleGroupKey;
  equipment: string;
}> = [
  // Грудь
  { id: '1', name: 'Жим штанги лежа', muscleGroup: 'chest-middle', equipment: 'Штанга' },
  { id: '2', name: 'Жим штанги на наклонной скамье', muscleGroup: 'chest-upper', equipment: 'Штанга' },
  { id: '3', name: 'Жим гантелей лежа', muscleGroup: 'chest-middle', equipment: 'Гантели' },
  { id: '4', name: 'Разводка гантелей', muscleGroup: 'chest-middle', equipment: 'Гантели' },
  { id: '5', name: 'Отжимания на брусьях', muscleGroup: 'chest-lower', equipment: 'Свой вес' },
  
  // Спина
  { id: '6', name: 'Становая тяга', muscleGroup: 'back-lower', equipment: 'Штанга' },
  { id: '7', name: 'Подтягивания', muscleGroup: 'back-lats', equipment: 'Свой вес' },
  { id: '8', name: 'Тяга штанги в наклоне', muscleGroup: 'back-lats', equipment: 'Штанга' },
  { id: '9', name: 'Тяга верхнего блока', muscleGroup: 'back-lats', equipment: 'Тренажер' },
  { id: '10', name: 'Тяга гантели в наклоне', muscleGroup: 'back-lats', equipment: 'Гантели' },
  { id: '11', name: 'Шраги со штангой', muscleGroup: 'back-traps', equipment: 'Штанга' },
  
  // Руки - Бицепс
  { id: '12', name: 'Сгибание рук со штангой', muscleGroup: 'arms-biceps', equipment: 'Штанга' },
  { id: '13', name: 'Сгибание рук с гантелями', muscleGroup: 'arms-biceps', equipment: 'Гантели' },
  { id: '14', name: 'Молотки', muscleGroup: 'arms-biceps', equipment: 'Гантели' },
  
  // Руки - Трицепс
  { id: '15', name: 'Французский жим', muscleGroup: 'arms-triceps', equipment: 'Штанга' },
  { id: '16', name: 'Жим узким хватом', muscleGroup: 'arms-triceps', equipment: 'Штанга' },
  { id: '17', name: 'Разгибание рук на блоке', muscleGroup: 'arms-triceps', equipment: 'Тренажер' },
  
  // Плечи
  { id: '18', name: 'Жим штанги стоя', muscleGroup: 'shoulders-front', equipment: 'Штанга' },
  { id: '19', name: 'Жим гантелей сидя', muscleGroup: 'shoulders-middle', equipment: 'Гантели' },
  { id: '20', name: 'Разводка гантелей стоя', muscleGroup: 'shoulders-middle', equipment: 'Гантели' },
  { id: '21', name: 'Разводка гантелей в наклоне', muscleGroup: 'shoulders-rear', equipment: 'Гантели' },
  
  // Ноги
  { id: '22', name: 'Приседания со штангой', muscleGroup: 'legs-quads', equipment: 'Штанга' },
  { id: '23', name: 'Жим ногами', muscleGroup: 'legs-quads', equipment: 'Тренажер' },
  { id: '24', name: 'Румынская тяга', muscleGroup: 'legs-hamstrings', equipment: 'Штанга' },
  { id: '25', name: 'Сгибание ног', muscleGroup: 'legs-hamstrings', equipment: 'Тренажер' },
  { id: '26', name: 'Ягодичный мост', muscleGroup: 'legs-glutes', equipment: 'Штанга' },
  { id: '27', name: 'Подъем на носки стоя', muscleGroup: 'legs-calves', equipment: 'Тренажер' },
  
  // Пресс
  { id: '28', name: 'Скручивания', muscleGroup: 'core-upper', equipment: 'Свой вес' },
  { id: '29', name: 'Подъем ног', muscleGroup: 'core-lower', equipment: 'Свой вес' },
  { id: '30', name: 'Планка', muscleGroup: 'core-upper', equipment: 'Свой вес' },
  { id: '31', name: 'Боковые скручивания', muscleGroup: 'core-obliques', equipment: 'Свой вес' },
  
  // Кардио
  { id: '32', name: 'Бег', muscleGroup: 'cardio', equipment: 'Без оборудования' },
  { id: '33', name: 'Велосипед', muscleGroup: 'cardio', equipment: 'Тренажер' },
  { id: '34', name: 'Эллипс', muscleGroup: 'cardio', equipment: 'Тренажер' },
];
