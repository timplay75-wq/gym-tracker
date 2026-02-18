/**
 * Emoji константы для приложения Gym Tracker
 * Используйте эти эмодзи для визуального отображения категорий, статусов и действий
 */

// 🏋️ Категории мышечных групп
export const MUSCLE_GROUP_EMOJIS = {
  // Грудь
  chest: '💪',
  upperChest: '⬆️',
  lowerChest: '⬇️',
  innerChest: '🎯',
  outerChest: '↔️',
  
  // Спина
  back: '🦾',
  lats: '🦅',
  upperBack: '🔼',
  lowerBack: '🔽',
  traps: '⛰️',
  rhomboids: '◆',
  
  // Плечи
  shoulders: '🤸',
  frontDelts: '▶️',
  sideDelts: '↕️',
  rearDelts: '◀️',
  rotatorCuff: '🔄',
  
  // Ноги
  legs: '🦵',
  quads: '🦿',
  hamstrings: '🦴',
  glutes: '🍑',
  calves: '👟',
  hipFlexors: '🔗',
  adductors: '↔️',
  abductors: '↕️',
  
  // Руки
  arms: '💪',
  biceps: '💪',
  triceps: '🔱',
  forearms: '✊',
  brachialis: '🦾',
  
  // Пресс и кор
  core: '🎯',
  abs: '⚡',
  obliques: '⚡',
  lowerAbs: '🔻',
  upperAbs: '🔺',
  transverseAbs: '⭕',
  serratus: '💎',
  
  // Кардио и общее
  cardio: '❤️',
  fullBody: '🏃',
  
  // Дополнительные группы
  neck: '🦒',
  chest_shoulders: '🦸',
  back_biceps: '🦍',
  legs_glutes: '🦘',
} as const;

// 🎯 Типы упражнений
export const EXERCISE_TYPE_EMOJIS = {
  strength: '💪',
  cardio: '🏃',
  flexibility: '🧘',
  balance: '⚖️',
  endurance: '🔋',
  power: '⚡',
  hypertrophy: '💎',
  warmup: '🔥',
  cooldown: '❄️',
  plyometric: '🦘',
  isometric: '🧱',
  calisthenics: '🤸',
  olympic: '🏋️',
  powerlifting: '⚡',
  bodybuilding: '💪',
  functional: '⚙️',
  mobility: '🔄',
  rehabilitation: '💊',
  stretching: '🦵',
  yoga: '🧘',
  pilates: '🤸',
  crossfit: '🔥',
  hiit: '⚡',
  circuit: '🔄',
  tabata: '⏱️',
  emom: '⏲️',
  
  // Дополнительное оборудование
  ez_bar: '〰️',
  trap_bar: '⬡',
  safety_squat_bar: '🔒',
  swiss_bar: '🇨🇭',
  medicine_ball: '🏀',
  stability_ball: '🔵',
  bosu_ball: '🌙',
  slam_ball: '💥',
  wall_ball: '🧱',
  ab_wheel: '⭕',
  trx: '🔺',
  battle_ropes: '➰',
  sled: '🛷',
  tire: '⭕',
  sandbag: '💼',
  parallettes: '⊥',
  dip_station: '⊤',
  box: '📦',
  step: '📶',
  slider: '🛝',
  glute_ham_developer: '🎢',
  hyperextension: '🎪',
  leg_press: '🦵',
  smith_machine: '🏗️',
  power_rack: '🏛️',
  squat_rack: '⛩️',
  rowing_machine: '🚣',
  treadmill: '🏃',
  bike: '🚴',
  elliptical: '🔄',
  stair_climber: '🪜',
  rope: '🪢',
  chains: '⛓️',
  weighted_vest: '🦺',
  ankle_weights: '👟',
  wrist_weights: '⌚',
  grip_trainer: '✊',
  ab_mat: '🟦',
  yoga_mat: '🧘',
  yoga_block: '🧱',
  yoga_strap: '🎗️',
  amrap: '♾️',
} as const;

// 🏋️ Оборудование
export const EQUIPMENT_EMOJIS = {
  barbell: '🏋️',
  dumbbell: '🔩',
  kettlebell: '⚓',
  machine: '⚙️',
  cable: '🔗',
  bodyweight: '🧍',
  resistance_band: '🎗️',
  bench: '🛋️',
  pullup_bar: '📏',
  rings: '💍',
  ball: '⚽',
  foam_roller: '🌀',
  none: '✋',
} as const;

// 📊 Статусы и состояния
export const STATUS_EMOJIS = {
  completed: '✅',
  inProgress: '⏳',
  planned: '📅',
  skipped: '⏭️',
  failed: '❌',
  paused: '⏸️',
  rest: '😴',
  active: '🔥',
  recovery: '💆',
} as const;

// 🎖️ Достижения
export const ACHIEVEMENT_EMOJIS = {
  trophy: '🏆',
  medal: '🥇',
  star: '⭐',
  fire: '🔥',
  rocket: '🚀',
  gem: '💎',
  crown: '👑',
  target: '🎯',
  lightning: '⚡',
  muscle: '💪',
  champion: '🏅',
  record: '📈',
} as const;

// 📈 Статистика и прогресс
export const STATS_EMOJIS = {
  trending_up: '📈',
  trending_down: '📉',
  calendar: '📅',
  clock: '⏰',
  timer: '⏱️',
  weight: '⚖️',
  chart: '📊',
  graph: '📉',
  
  // Дополнительная мотивация
  boom: '💥',
  sparkles: '✨',
  hundred: '💯',
  sunglasses: '😎',
  heartOnFire: '❤️‍🔥',
  crown: '👑',
  brain: '🧠',
  heart: '❤️',
  muscle: '💪',
  flex: '💪',
  strong: '🦾',
  gorilla: '🦍',
  lion: '🦁',
  tiger: '🐯',
  
  // Расширенные категории
  push: '👐',
  pull: '🤲',
  legs_day: '🦵',
  upper: '🔼',
  lower: '🔽',
  full_body: '🏃',
  ppl: '♻️',
  upper_lower: '⬆️⬇️',
  bro_split: '💪',
  
  // Специализированные
  olympic_lifting: '🏋️',
  strongman: '🦍',
  calisthenics: '🤸',
  gymnastics: '🤸‍♀️',
  athletic: '⚡',
  sports_specific: '⚽',
  
  // Виды тренировок
  circuit_training: '🔄',
  tabata: '⏱️',
  emom: '⏲️',
  amrap: '♾️',
  pyramid: '🔺',
  dropset: '⬇️',
  superset: '🔗',
  giant_set: '🏔️',
  cluster_set: '🍇',
  rest_pause: '⏸️',
  
  // Стили тренировок
  volume: '📊',
  intensity: '🔥',
  density: '⚡',
  frequency: '📅',
  
  // Специальные
  deload: '💆',
  active_recovery: '🚶',
  rehabilitation: '💊',
  prehab: '🛡️',
  beast: '👹',
  warrior: '⚔️',
  gladiator: '🗡️',
  viking: '🪓',
  ninja: '🥷',
  samurai: '🥋',
  superhero: '🦸',
  ironMan: '🤖',
  hulk: '💚',
  captain: '🛡️',
  legend: '🌟',
  champion: '🏅',
  goat: '🐐',
  kingKong: '🦍',
  terminator: '🤖',
  percentage: '💯',
  target: '🎯',
  checkmark: '✔️',
} as const;

// 🎨 Действия
export const ACTION_EMOJIS = {
  add: '➕',
  remove: '➖',
  edit: '✏️',
  delete: '🗑️',
  save: '💾',
  share: '📤',
  download: '⬇️',
  upload: '⬆️',
  copy: '📋',
  search: '🔍',
  filter: '🔽',
  settings: '⚙️',
  menu: '☰',
  close: '✖️',
  
  // Дополнительные цели
  mass_gain: '📈',
  cutting: '✂️',
  bulking: '🍔',
  shredding: '🔪',
  toning: '💎',
  definition: '📐',
  symmetry: '⚖️',
  proportion: '📏',
  power: '⚡',
  speed: '💨',
  agility: '🦘',
  balance: '⚖️',
  coordination: '🎯',
  stamina: '🔋',
  mobility: '🔄',
  stability: '🧘',
  posture: '🧍',
  core_strength: '🎯',
  functional_fitness: '⚙️',
  athletic_performance: '🏅',
  injury_prevention: '🛡️',
  longevity: '♾️',
  quality_of_life: '🌟',
  confidence: '😎',
  stress_relief: '😌',
  mental_health: '🧠',
  energy: '⚡',
  sleep_quality: '😴',
  body_recomposition: '🔄',
  back: '⬅️',
  forward: '➡️',
  refresh: '🔄',
  info: 'ℹ️',
  warning: '⚠️',
  error: '❗',
} as const;

// 💬 Мотивация
export const MOTIVATION_EMOJIS = {
  strongArm: '💪',
  fire: '🔥',
  rocket: '🚀',
  lightning: '⚡',
  star: '⭐',
  tada: '🎉',
  clap: '👏',
  thumbsUp: '👍',
  fist: '👊',
  victory: '✌️',
  medal: '🥇',
  trophy: '🏆',
} as const;

// 📱 Категории тренировок
export const WORKOUT_CATEGORY_EMOJIS = {
  strength: '🏋️',
  hypertrophy: '💪',
  endurance: '🏃',
  powerlifting: '⚡',
  bodybuilding: '💎',
  crossfit: '🔥',
  yoga: '🧘',
  pilates: '🤸',
  hiit: '⚡',
  cardio: '❤️',
  stretching: '🦵',
  mobility: '🔄',
} as const;

// 🍎 Питание (опционально)
export const NUTRITION_EMOJIS = {
  apple: '🍎',
  salad: '🥗',
  protein: '🥩',
  carbs: '🍞',
  water: '💧',
  supplement: '💊',
  meal: '🍽️',
  snack: '🍪',
} as const;

// 😊 Настроение/Самочувствие
export const MOOD_EMOJIS = {
  great: '😊',
  good: '🙂',
  neutral: '😐',
  tired: '😴',
  sore: '😣',
  energized: '⚡',
  motivated: '🔥',
  recovering: '💆',
} as const;

// 🎯 Цели
export const GOAL_EMOJIS = {
  strength: '💪',
  muscle: '💎',
  weight_loss: '📉',
  endurance: '🏃',
  flexibility: '🧘',
  health: '❤️',
  performance: '🚀',
  aesthetics: '✨',
} as const;

// Вспомогательная функция для получения случайного эмодзи мотивации
export const getRandomMotivationEmoji = (): string => {
  const emojis = Object.values(MOTIVATION_EMOJIS);
  return emojis[Math.floor(Math.random() * emojis.length)];
};

// Функция для получения эмодзи по категории мышц
export const getMuscleGroupEmoji = (muscleGroup: string): string => {
  const key = muscleGroup.toLowerCase() as keyof typeof MUSCLE_GROUP_EMOJIS;
  return MUSCLE_GROUP_EMOJIS[key] || '💪';
};

// Функция для получения эмодзи оборудования
export const getEquipmentEmoji = (equipment: string): string => {
  const key = equipment.toLowerCase().replace(/\s+/g, '_') as keyof typeof EQUIPMENT_EMOJIS;
  return EQUIPMENT_EMOJIS[key] || '🏋️';
};

// Экспорт всех эмодзи в одном объекте
export const EMOJIS = {
  muscleGroups: MUSCLE_GROUP_EMOJIS,
  exerciseTypes: EXERCISE_TYPE_EMOJIS,
  equipment: EQUIPMENT_EMOJIS,
  status: STATUS_EMOJIS,
  achievements: ACHIEVEMENT_EMOJIS,
  stats: STATS_EMOJIS,
  actions: ACTION_EMOJIS,
  motivation: MOTIVATION_EMOJIS,
  workoutCategories: WORKOUT_CATEGORY_EMOJIS,
  nutrition: NUTRITION_EMOJIS,
  mood: MOOD_EMOJIS,
  goals: GOAL_EMOJIS,
} as const;

export type EmojiCategory = keyof typeof EMOJIS;
