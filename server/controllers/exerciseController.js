import Exercise from '../models/Exercise.js';

// Встроенные упражнения (seed)
const defaultExercises = [
  // Грудь
  { name: 'Жим штанги лёжа', category: 'chest', type: 'strength', equipment: 'штанга', targetMuscles: ['грудь', 'трицепс', 'передняя дельта'] },
  { name: 'Жим гантелей лёжа', category: 'chest', type: 'strength', equipment: 'гантели', targetMuscles: ['грудь', 'трицепс'], isDoubleWeight: true },
  { name: 'Отжимания', category: 'chest', type: 'strength', equipment: null, targetMuscles: ['грудь', 'трицепс'], isBodyweight: true },
  { name: 'Разводка гантелей', category: 'chest', type: 'strength', equipment: 'гантели', targetMuscles: ['грудь'], isDoubleWeight: true },
  // Спина
  { name: 'Подтягивания', category: 'back', type: 'strength', equipment: 'турник', targetMuscles: ['широчайшие', 'бицепс'], isBodyweight: true },
  { name: 'Тяга штанги в наклоне', category: 'back', type: 'strength', equipment: 'штанга', targetMuscles: ['широчайшие', 'ромбовидные'] },
  { name: 'Тяга верхнего блока', category: 'back', type: 'strength', equipment: 'тренажёр', targetMuscles: ['широчайшие'] },
  { name: 'Тяга гантели одной рукой', category: 'back', type: 'strength', equipment: 'гантели', targetMuscles: ['широчайшие', 'ромбовидные'], isDoubleWeight: true },
  // Ноги
  { name: 'Приседания со штангой', category: 'legs', type: 'strength', equipment: 'штанга', targetMuscles: ['квадрицепс', 'ягодицы', 'бицепс бедра'] },
  { name: 'Приседания', category: 'legs', type: 'strength', equipment: null, targetMuscles: ['квадрицепс', 'ягодицы'], isBodyweight: true },
  { name: 'Жим ногами', category: 'legs', type: 'strength', equipment: 'тренажёр', targetMuscles: ['квадрицепс', 'ягодицы'] },
  { name: 'Выпады', category: 'legs', type: 'strength', equipment: 'гантели', targetMuscles: ['квадрицепс', 'ягодицы'], isDoubleWeight: true },
  { name: 'Румынская тяга', category: 'legs', type: 'strength', equipment: 'штанга', targetMuscles: ['бицепс бедра', 'ягодицы'] },
  // Плечи
  { name: 'Жим штанги стоя', category: 'shoulders', type: 'strength', equipment: 'штанга', targetMuscles: ['передняя дельта', 'средняя дельта'] },
  { name: 'Боковые подъёмы гантелей', category: 'shoulders', type: 'strength', equipment: 'гантели', targetMuscles: ['средняя дельта'], isDoubleWeight: true },
  { name: 'Армейский жим гантелей', category: 'shoulders', type: 'strength', equipment: 'гантели', targetMuscles: ['дельта', 'трицепс'], isDoubleWeight: true },
  // Руки
  { name: 'Подъём штанги на бицепс', category: 'arms', type: 'strength', equipment: 'штанга', targetMuscles: ['бицепс'] },
  { name: 'Французский жим', category: 'arms', type: 'strength', equipment: 'штанга', targetMuscles: ['трицепс'] },
  { name: 'Молотковые сгибания', category: 'arms', type: 'strength', equipment: 'гантели', targetMuscles: ['бицепс', 'плечевая мышца'], isDoubleWeight: true },
  // Пресс
  { name: 'Скручивания', category: 'core', type: 'strength', equipment: null, targetMuscles: ['прямая мышца живота'], isBodyweight: true },
  { name: 'Планка', category: 'core', type: 'strength', equipment: null, targetMuscles: ['кор'], isBodyweight: true },
  { name: 'Подъём ног в висе', category: 'core', type: 'strength', equipment: 'турник', targetMuscles: ['нижний пресс'], isBodyweight: true },
  // Кардио
  { name: 'Бег', category: 'cardio', type: 'cardio', equipment: null, targetMuscles: ['ноги', 'кардио'], isBodyweight: true },
  { name: 'Прыжки на скакалке', category: 'cardio', type: 'cardio', equipment: 'скакалка', targetMuscles: ['кардио'], isBodyweight: true },
  { name: 'Велотренажёр', category: 'cardio', type: 'cardio', equipment: 'тренажёр', targetMuscles: ['ноги', 'кардио'] },
];

// GET /api/exercises
export const getAllExercises = async (req, res) => {
  try {
    const { category, type, search } = req.query;
    const filter = {
      $or: [{ isCustom: false }, { isCustom: true, createdBy: req.user._id }],
    };

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (search) filter.$text = { $search: search };

    const exercises = await Exercise.find(filter).sort({ category: 1, name: 1 });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/exercises/:id
export const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ message: 'Упражнение не найдено' });
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/exercises — создать пользовательское упражнение
export const createExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create({
      ...req.body,
      isCustom: true,
      createdBy: req.user._id,
    });
    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/exercises/:id
export const updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOne({ _id: req.params.id, createdBy: req.user._id, isCustom: true });
    if (!exercise) return res.status(404).json({ message: 'Упражнение не найдено или недоступно для изменения' });

    Object.assign(exercise, req.body);
    await exercise.save();
    res.json(exercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/exercises/:id
export const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id, isCustom: true });
    if (!exercise) return res.status(404).json({ message: 'Упражнение не найдено или недоступно для удаления' });
    res.json({ message: 'Упражнение удалено' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/exercises/seed — заполнить базу упражнениями (только dev)
export const seedExercises = async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ message: 'Доступно только в режиме разработки' });
    }

    const count = await Exercise.countDocuments({ isCustom: false });
    if (count > 0) {
      return res.json({ message: `Уже есть ${count} упражнений`, count });
    }

    const created = await Exercise.insertMany(defaultExercises);
    res.json({ message: `Добавлено ${created.length} упражнений`, count: created.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
