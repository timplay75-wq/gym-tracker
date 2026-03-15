import ExercisePack from '../models/ExercisePack.js';
import User from '../models/User.js';
import Exercise from '../models/Exercise.js';

// Дефолтные паки для seed
const defaultPacks = [
  {
    name: 'Кроссфит',
    description: 'Интенсивные функциональные упражнения для всего тела',
    price: 50,
    icon: '🔥',
    category: 'crossfit',
    exercises: [
      { name: 'Бёрпи', category: 'cardio', type: 'cardio' },
      { name: 'Толчок штанги', category: 'shoulders', type: 'strength', equipment: 'штанга' },
      { name: 'Рывок штанги', category: 'back', type: 'strength', equipment: 'штанга' },
      { name: 'Трастеры', category: 'legs', type: 'strength', equipment: 'штанга' },
      { name: 'Махи гирей', category: 'back', type: 'strength', equipment: 'гиря' },
      { name: 'Прыжки на бокс', category: 'legs', type: 'cardio' },
      { name: 'Канат (подъём)', category: 'arms', type: 'strength' },
      { name: 'Двойные прыжки на скакалке', category: 'cardio', type: 'cardio', equipment: 'скакалка' },
      { name: 'Гребной тренажёр', category: 'cardio', type: 'cardio', equipment: 'тренажёр' },
      { name: 'Выходы на кольцах', category: 'chest', type: 'strength', equipment: 'кольца' },
      { name: 'Прогулка фермера', category: 'arms', type: 'strength', equipment: 'гантели' },
      { name: 'Тяга санок', category: 'legs', type: 'strength' },
      { name: 'Уолл-болл', category: 'legs', type: 'cardio', equipment: 'медбол' },
      { name: 'Подъём по канату', category: 'back', type: 'strength' },
      { name: 'Assault байк', category: 'cardio', type: 'cardio', equipment: 'тренажёр' },
    ],
  },
  {
    name: 'Йога',
    description: 'Позы и упражнения для гибкости и баланса',
    price: 40,
    icon: '🧘',
    category: 'yoga',
    exercises: [
      { name: 'Собака мордой вниз', category: 'other', type: 'stretching' },
      { name: 'Собака мордой вверх', category: 'other', type: 'stretching' },
      { name: 'Поза воина I', category: 'legs', type: 'stretching' },
      { name: 'Поза воина II', category: 'legs', type: 'stretching' },
      { name: 'Поза дерева', category: 'legs', type: 'stretching' },
      { name: 'Поза кобры', category: 'other', type: 'stretching' },
      { name: 'Поза моста', category: 'core', type: 'stretching' },
      { name: 'Поза ребёнка', category: 'other', type: 'stretching' },
      { name: 'Поза голубя', category: 'legs', type: 'stretching' },
      { name: 'Поза лотоса', category: 'other', type: 'stretching' },
      { name: 'Стойка на голове', category: 'core', type: 'strength' },
      { name: 'Поза треугольника', category: 'legs', type: 'stretching' },
    ],
  },
  {
    name: 'Пауэрлифтинг',
    description: 'Специализированные упражнения для максимальной силы',
    price: 60,
    icon: '🏋️',
    category: 'powerlifting',
    exercises: [
      { name: 'Жим лёжа с паузой', category: 'chest', type: 'strength', equipment: 'штанга' },
      { name: 'Присед с паузой', category: 'legs', type: 'strength', equipment: 'штанга' },
      { name: 'Становая тяга сумо', category: 'legs', type: 'strength', equipment: 'штанга' },
      { name: 'Жим лёжа узким хватом', category: 'chest', type: 'strength', equipment: 'штанга' },
      { name: 'Присед на коробку', category: 'legs', type: 'strength', equipment: 'штанга' },
      { name: 'Дефицитная тяга', category: 'back', type: 'strength', equipment: 'штанга' },
      { name: 'Жим с цепями', category: 'chest', type: 'strength', equipment: 'штанга' },
      { name: 'Гуд-морнинг', category: 'back', type: 'strength', equipment: 'штанга' },
      { name: 'Тяга блока к лицу', category: 'shoulders', type: 'strength', equipment: 'тренажёр' },
      { name: 'Присед Зерхера', category: 'legs', type: 'strength', equipment: 'штанга' },
    ],
  },
  {
    name: 'Калистеника',
    description: 'Упражнения с собственным весом для силы и контроля',
    price: 45,
    icon: '💪',
    category: 'calisthenics',
    exercises: [
      { name: 'Подтягивание на одной руке', category: 'back', type: 'strength' },
      { name: 'Отжимания в стойке на руках', category: 'shoulders', type: 'strength' },
      { name: 'Передний вис', category: 'back', type: 'strength', equipment: 'турник' },
      { name: 'Задний вис', category: 'back', type: 'strength', equipment: 'турник' },
      { name: 'Планш', category: 'chest', type: 'strength' },
      { name: 'Флаг дракона', category: 'core', type: 'strength' },
      { name: 'Человеческий флаг', category: 'core', type: 'strength' },
      { name: 'Приседания пистолетиком', category: 'legs', type: 'strength' },
      { name: 'L-sit', category: 'core', type: 'strength' },
      { name: 'Muscle-up', category: 'back', type: 'strength', equipment: 'турник' },
      { name: 'Отжимания «Тигр»', category: 'arms', type: 'strength' },
      { name: 'Стойка на руках', category: 'shoulders', type: 'strength' },
    ],
  },
];

// GET /api/shop/packs — список всех паков
export const getPacks = async (req, res) => {
  try {
    let packs = await ExercisePack.find().sort({ price: 1 });

    // Auto-seed if empty
    if (packs.length === 0) {
      packs = await ExercisePack.insertMany(defaultPacks);
    }

    const user = await User.findById(req.user._id).select('coins purchasedPacks');
    const purchasedIds = (user?.purchasedPacks || []).map(id => id.toString());

    const result = packs.map(p => ({
      ...p.toObject(),
      purchased: purchasedIds.includes(p._id.toString()),
    }));

    res.json({
      packs: result,
      coins: user?.coins || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/shop/purchase/:packId — купить пак
export const purchasePack = async (req, res) => {
  try {
    const pack = await ExercisePack.findById(req.params.packId);
    if (!pack) return res.status(404).json({ message: 'Пак не найден' });

    const user = await User.findById(req.user._id).select('coins purchasedPacks');
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    if (user.purchasedPacks.map(id => id.toString()).includes(pack._id.toString())) {
      return res.status(400).json({ message: 'Пак уже куплен' });
    }

    if ((user.coins || 0) < pack.price) {
      return res.status(400).json({ message: 'Недостаточно монет' });
    }

    // Списываем монеты, добавляем пак
    user.coins = (user.coins || 0) - pack.price;
    user.purchasedPacks.push(pack._id);
    await user.save();

    // Создаём упражнения из пака для этого пользователя
    const exercisesToCreate = pack.exercises.map(ex => ({
      name: ex.name,
      category: ex.category,
      type: ex.type || 'strength',
      equipment: ex.equipment || null,
      isCustom: true,
      createdBy: req.user._id,
    }));

    await Exercise.insertMany(exercisesToCreate, { ordered: false }).catch(() => {
      // Ignore duplicates
    });

    res.json({
      message: 'Пак куплен',
      coins: user.coins,
      purchasedPacks: user.purchasedPacks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/shop/my-purchases — купленные паки
export const getMyPurchases = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('coins purchasedPacks')
      .populate('purchasedPacks');

    res.json({
      coins: user?.coins || 0,
      purchasedPacks: user?.purchasedPacks || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/shop/coins — текущий баланс монет
export const getCoins = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('coins');
    res.json({ coins: user?.coins || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
