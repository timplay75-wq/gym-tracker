/**
 * 💪 Пути к анатомическим иконкам мышц
 * 
 * После скачивания иконок с Flaticon/Freepik, 
 * добавь их в public/icons/muscles/ и обнови пути здесь
 */

export const MUSCLE_ICONS = {
  // 🫀 Грудь
  chest: {
    pectoralisMajor: '/icons/muscles/chest/pectoralis-major.svg',
    pectoralisMinor: '/icons/muscles/chest/pectoralis-minor.svg',
    upperChest: '/icons/muscles/chest/upper-chest.svg',
    lowerChest: '/icons/muscles/chest/lower-chest.svg',
    innerChest: '/icons/muscles/chest/inner-chest.svg',
  },

  // 🦾 Спина
  back: {
    latissimusDorsi: '/icons/muscles/back/latissimus-dorsi.svg',
    trapeziusUpper: '/icons/muscles/back/trapezius-upper.svg',
    trapeziusMiddle: '/icons/muscles/back/trapezius-middle.svg',
    trapeziusLower: '/icons/muscles/back/trapezius-lower.svg',
    rhomboids: '/icons/muscles/back/rhomboids.svg',
    erectorSpinae: '/icons/muscles/back/erector-spinae.svg',
    teresMajor: '/icons/muscles/back/teres-major.svg',
    teresMinor: '/icons/muscles/back/teres-minor.svg',
    infraspinatus: '/icons/muscles/back/infraspinatus.svg',
  },

  // 🤸 Плечи
  shoulders: {
    deltoidAnterior: '/icons/muscles/shoulders/deltoid-anterior.svg',
    deltoidLateral: '/icons/muscles/shoulders/deltoid-lateral.svg',
    deltoidPosterior: '/icons/muscles/shoulders/deltoid-posterior.svg',
    rotatorCuff: '/icons/muscles/shoulders/rotator-cuff.svg',
    supraspinatus: '/icons/muscles/shoulders/supraspinatus.svg',
  },

  // 💪 Руки
  arms: {
    bicepsBrachii: '/icons/muscles/arms/biceps-brachii.svg',
    tricepsBrachii: '/icons/muscles/arms/triceps-brachii.svg',
    brachialis: '/icons/muscles/arms/brachialis.svg',
    brachioradialis: '/icons/muscles/arms/brachioradialis.svg',
    forearmFlexors: '/icons/muscles/arms/forearm-flexors.svg',
    forearmExtensors: '/icons/muscles/arms/forearm-extensors.svg',
  },

  // 🦵 Ноги
  legs: {
    quadriceps: '/icons/muscles/legs/quadriceps.svg',
    rectusFemoris: '/icons/muscles/legs/rectus-femoris.svg',
    vastusLateralis: '/icons/muscles/legs/vastus-lateralis.svg',
    vastusMedialis: '/icons/muscles/legs/vastus-medialis.svg',
    vastusIntermedius: '/icons/muscles/legs/vastus-intermedius.svg',
    hamstrings: '/icons/muscles/legs/hamstrings.svg',
    bicepsFemoris: '/icons/muscles/legs/biceps-femoris.svg',
    semitendinosus: '/icons/muscles/legs/semitendinosus.svg',
    semimembranosus: '/icons/muscles/legs/semimembranosus.svg',
    gluteusMaximus: '/icons/muscles/legs/gluteus-maximus.svg',
    gluteusMedius: '/icons/muscles/legs/gluteus-medius.svg',
    gluteusMinimus: '/icons/muscles/legs/gluteus-minimus.svg',
    gastrocnemius: '/icons/muscles/legs/gastrocnemius.svg',
    soleus: '/icons/muscles/legs/soleus.svg',
    tibialis: '/icons/muscles/legs/tibialis.svg',
    adductors: '/icons/muscles/legs/adductors.svg',
  },

  // ⚡ Кор и пресс
  core: {
    rectusAbdominis: '/icons/muscles/core/rectus-abdominis.svg',
    obliquesExternal: '/icons/muscles/core/obliques-external.svg',
    obliquesInternal: '/icons/muscles/core/obliques-internal.svg',
    transverseAbdominis: '/icons/muscles/core/transverse-abdominis.svg',
    serratusAnterior: '/icons/muscles/core/serratus-anterior.svg',
  },

  // 🏃 Тело целиком
  fullBody: {
    frontView: '/icons/muscles/full-body/front-view.svg',
    backView: '/icons/muscles/full-body/back-view.svg',
    sideView: '/icons/muscles/full-body/side-view.svg',
  },
} as const;

/**
 * Получить иконку мышцы по категории и подкатегории
 */
export function getMuscleIcon(category: keyof typeof MUSCLE_ICONS, muscle: string): string {
  const categoryIcons = MUSCLE_ICONS[category];
  if (!categoryIcons) return '';
  
  return (categoryIcons as Record<string, string>)[muscle] || '';
}

/**
 * Проверить, существует ли иконка для мышцы
 */
export function hasMuscleIcon(category: keyof typeof MUSCLE_ICONS, muscle: string): boolean {
  return getMuscleIcon(category, muscle) !== '';
}

/**
 * Получить все иконки для категории
 */
export function getCategoryIcons(category: keyof typeof MUSCLE_ICONS): Record<string, string> {
  return MUSCLE_ICONS[category] as Record<string, string>;
}

/**
 * Список всех доступных мышц
 */
export const ALL_MUSCLES = {
  chest: ['pectoralisMajor', 'pectoralisMinor', 'upperChest', 'lowerChest', 'innerChest'],
  back: ['latissimusDorsi', 'trapeziusUpper', 'trapeziusMiddle', 'trapeziusLower', 'rhomboids', 'erectorSpinae', 'teresMajor', 'teresMinor', 'infraspinatus'],
  shoulders: ['deltoidAnterior', 'deltoidLateral', 'deltoidPosterior', 'rotatorCuff', 'supraspinatus'],
  arms: ['bicepsBrachii', 'tricepsBrachii', 'brachialis', 'brachioradialis', 'forearmFlexors', 'forearmExtensors'],
  legs: [
    'quadriceps', 'rectusFemoris', 'vastusLateralis', 'vastusMedialis', 'vastusIntermedius',
    'hamstrings', 'bicepsFemoris', 'semitendinosus', 'semimembranosus',
    'gluteusMaximus', 'gluteusMedius', 'gluteusMinimus',
    'gastrocnemius', 'soleus', 'tibialis', 'adductors'
  ],
  core: ['rectusAbdominis', 'obliquesExternal', 'obliquesInternal', 'transverseAbdominis', 'serratusAnterior'],
} as const;

/**
 * Готовые комбинации мышц для популярных упражнений
 * Используй в MuscleGroup компоненте
 */
export const EXERCISE_MUSCLE_GROUPS = {
  // Жимовые упражнения
  benchPress: [
    { category: 'chest' as const, muscle: 'pectoralisMajor', name: 'Грудь', isPrimary: true },
    { category: 'arms' as const, muscle: 'tricepsBrachii', name: 'Трицепс', isPrimary: false },
    { category: 'shoulders' as const, muscle: 'deltoidAnterior', name: 'Передние дельты', isPrimary: false },
  ],
  inclineBenchPress: [
    { category: 'chest' as const, muscle: 'upperChest', name: 'Верх груди', isPrimary: true },
    { category: 'shoulders' as const, muscle: 'deltoidAnterior', name: 'Передние дельты', isPrimary: false },
    { category: 'arms' as const, muscle: 'tricepsBrachii', name: 'Трицепс', isPrimary: false },
  ],
  declineBenchPress: [
    { category: 'chest' as const, muscle: 'lowerChest', name: 'Низ груди', isPrimary: true },
    { category: 'arms' as const, muscle: 'tricepsBrachii', name: 'Трицепс', isPrimary: false },
  ],
  overheadPress: [
    { category: 'shoulders' as const, muscle: 'deltoidAnterior', name: 'Передние дельты', isPrimary: true },
    { category: 'shoulders' as const, muscle: 'deltoidLateral', name: 'Средние дельты', isPrimary: true },
    { category: 'arms' as const, muscle: 'tricepsBrachii', name: 'Трицепс', isPrimary: false },
    { category: 'chest' as const, muscle: 'upperChest', name: 'Верх груди', isPrimary: false },
  ],

  // Тяговые упражнения
  deadlift: [
    { category: 'back' as const, muscle: 'erectorSpinae', name: 'Разгибатели спины', isPrimary: true },
    { category: 'legs' as const, muscle: 'hamstrings', name: 'Бицепсы бедра', isPrimary: true },
    { category: 'legs' as const, muscle: 'gluteusMaximus', name: 'Ягодицы', isPrimary: true },
    { category: 'back' as const, muscle: 'trapeziusUpper', name: 'Трапеции', isPrimary: false },
    { category: 'back' as const, muscle: 'latissimusDorsi', name: 'Широчайшие', isPrimary: false },
  ],
  pullUp: [
    { category: 'back' as const, muscle: 'latissimusDorsi', name: 'Широчайшие', isPrimary: true },
    { category: 'arms' as const, muscle: 'bicepsBrachii', name: 'Бицепс', isPrimary: false },
    { category: 'back' as const, muscle: 'rhomboids', name: 'Ромбовидные', isPrimary: false },
    { category: 'back' as const, muscle: 'teresMajor', name: 'Большая круглая', isPrimary: false },
  ],
  bentOverRow: [
    { category: 'back' as const, muscle: 'latissimusDorsi', name: 'Широчайшие', isPrimary: true },
    { category: 'back' as const, muscle: 'rhomboids', name: 'Ромбовидные', isPrimary: true },
    { category: 'back' as const, muscle: 'trapeziusMiddle', name: 'Средняя трапеция', isPrimary: false },
    { category: 'arms' as const, muscle: 'bicepsBrachii', name: 'Бицепс', isPrimary: false },
    { category: 'back' as const, muscle: 'erectorSpinae', name: 'Разгибатели спины', isPrimary: false },
  ],
  shrugs: [
    { category: 'back' as const, muscle: 'trapeziusUpper', name: 'Верхняя трапеция', isPrimary: true },
    { category: 'back' as const, muscle: 'trapeziusMiddle', name: 'Средняя трапеция', isPrimary: false },
  ],

  // Ноги
  squat: [
    { category: 'legs' as const, muscle: 'quadriceps', name: 'Квадрицепсы', isPrimary: true },
    { category: 'legs' as const, muscle: 'gluteusMaximus', name: 'Ягодицы', isPrimary: true },
    { category: 'legs' as const, muscle: 'hamstrings', name: 'Бицепсы бедра', isPrimary: false },
    { category: 'back' as const, muscle: 'erectorSpinae', name: 'Разгибатели спины', isPrimary: false },
  ],
  legPress: [
    { category: 'legs' as const, muscle: 'quadriceps', name: 'Квадрицепсы', isPrimary: true },
    { category: 'legs' as const, muscle: 'gluteusMaximus', name: 'Ягодицы', isPrimary: false },
    { category: 'legs' as const, muscle: 'hamstrings', name: 'Бицепсы бедра', isPrimary: false },
  ],
  legCurl: [
    { category: 'legs' as const, muscle: 'hamstrings', name: 'Бицепсы бедра', isPrimary: true },
    { category: 'legs' as const, muscle: 'bicepsFemoris', name: 'Двуглавая мышца бедра', isPrimary: true },
  ],
  legExtension: [
    { category: 'legs' as const, muscle: 'quadriceps', name: 'Квадрицепсы', isPrimary: true },
    { category: 'legs' as const, muscle: 'rectusFemoris', name: 'Прямая мышца бедра', isPrimary: true },
  ],
  calfRaise: [
    { category: 'legs' as const, muscle: 'gastrocnemius', name: 'Икроножная', isPrimary: true },
    { category: 'legs' as const, muscle: 'soleus', name: 'Камбаловидная', isPrimary: false },
  ],

  // Руки
  bicepCurl: [
    { category: 'arms' as const, muscle: 'bicepsBrachii', name: 'Бицепс', isPrimary: true },
    { category: 'arms' as const, muscle: 'brachialis', name: 'Брахиалис', isPrimary: false },
    { category: 'arms' as const, muscle: 'forearmFlexors', name: 'Предплечья', isPrimary: false },
  ],
  tricepExtension: [
    { category: 'arms' as const, muscle: 'tricepsBrachii', name: 'Трицепс', isPrimary: true },
  ],
  hammerCurl: [
    { category: 'arms' as const, muscle: 'brachialis', name: 'Брахиалис', isPrimary: true },
    { category: 'arms' as const, muscle: 'bicepsBrachii', name: 'Бицепс', isPrimary: false },
    { category: 'arms' as const, muscle: 'brachioradialis', name: 'Плечелучевая', isPrimary: false },
  ],

  // Пресс
  crunch: [
    { category: 'core' as const, muscle: 'rectusAbdominis', name: 'Прямая мышца живота', isPrimary: true },
  ],
  plank: [
    { category: 'core' as const, muscle: 'transverseAbdominis', name: 'Поперечная мышца', isPrimary: true },
    { category: 'core' as const, muscle: 'rectusAbdominis', name: 'Прямая мышца', isPrimary: false },
    { category: 'core' as const, muscle: 'obliquesExternal', name: 'Косые мышцы', isPrimary: false },
  ],
  russianTwist: [
    { category: 'core' as const, muscle: 'obliquesExternal', name: 'Наружные косые', isPrimary: true },
    { category: 'core' as const, muscle: 'obliquesInternal', name: 'Внутренние косые', isPrimary: true },
    { category: 'core' as const, muscle: 'rectusAbdominis', name: 'Прямая мышца', isPrimary: false },
  ],
} as const;
