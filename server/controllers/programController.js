import WorkoutProgram from '../models/WorkoutProgram.js';

// Получить все программы тренировок
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await WorkoutProgram.find()
      .populate('workouts')
      .sort({ createdAt: -1 });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получить одну программу
export const getProgramById = async (req, res) => {
  try {
    const program = await WorkoutProgram.findById(req.params.id)
      .populate('workouts');
    
    if (!program) {
      return res.status(404).json({ message: 'Программа не найдена' });
    }
    
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Создать программу
export const createProgram = async (req, res) => {
  try {
    const program = new WorkoutProgram(req.body);
    const savedProgram = await program.save();
    res.status(201).json(savedProgram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Обновить программу
export const updateProgram = async (req, res) => {
  try {
    const program = await WorkoutProgram.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!program) {
      return res.status(404).json({ message: 'Программа не найдена' });
    }
    
    res.json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Удалить программу
export const deleteProgram = async (req, res) => {
  try {
    const program = await WorkoutProgram.findByIdAndDelete(req.params.id);
    
    if (!program) {
      return res.status(404).json({ message: 'Программа не найдена' });
    }
    
    res.json({ message: 'Программа удалена' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Активировать программу
export const activateProgram = async (req, res) => {
  try {
    const program = await WorkoutProgram.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({ message: 'Программа не найдена' });
    }
    
    program.isActive = true;
    await program.save(); // pre-save hook деактивирует другие программы
    
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
