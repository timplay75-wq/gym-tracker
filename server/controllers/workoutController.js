import Workout from '../models/Workout.js';

// Получить все тренировки
export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получить одну тренировку
export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Тренировка не найдена' });
    }
    
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Создать тренировку
export const createWorkout = async (req, res) => {
  try {
    const workout = new Workout(req.body);
    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Обновить тренировку
export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!workout) {
      return res.status(404).json({ message: 'Тренировка не найдена' });
    }
    
    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Удалить тренировку
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Тренировка не найдена' });
    }
    
    res.json({ message: 'Тренировка удалена' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получить статистику
export const getWorkoutStats = async (req, res) => {
  try {
    const totalWorkouts = await Workout.countDocuments();
    const totalExercises = await Workout.aggregate([
      { $unwind: '$exercises' },
      { $count: 'total' }
    ]);
    
    res.json({
      totalWorkouts,
      totalExercises: totalExercises[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
