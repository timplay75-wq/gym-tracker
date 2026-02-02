import ExerciseStats from '../models/ExerciseStats.js';
import Workout from '../models/Workout.js';

// Получить статистику по упражнению
export const getExerciseStats = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    let stats = await ExerciseStats.findOne({ exerciseId });
    
    if (!stats) {
      // Создать статистику если не существует
      stats = await calculateExerciseStats(exerciseId);
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получить все упражнения со статистикой
export const getAllExercisesStats = async (req, res) => {
  try {
    const stats = await ExerciseStats.find().sort({ totalVolume: -1 });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Пересчитать статистику для упражнения
export const recalculateExerciseStats = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const stats = await calculateExerciseStats(exerciseId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Вспомогательная функция для расчета статистики
async function calculateExerciseStats(exerciseId) {
  // Найти все тренировки с этим упражнением
  const workouts = await Workout.find({
    'exercises.name': exerciseId // или по ID если используете
  });
  
  let totalVolume = 0;
  let totalSets = 0;
  let totalReps = 0;
  let maxWeight = 0;
  let weights = [];
  const performanceHistory = [];
  const volumeByPeriod = [];
  let exerciseName = exerciseId;
  let lastPerformed = null;
  
  workouts.forEach(workout => {
    const exercise = workout.exercises.find(ex => ex.name === exerciseId);
    if (exercise) {
      exerciseName = exercise.name;
      let workoutVolume = 0;
      
      exercise.sets.forEach(set => {
        if (set.completed) {
          const volume = set.weight * set.reps;
          totalVolume += volume;
          workoutVolume += volume;
          totalSets++;
          totalReps += set.reps;
          maxWeight = Math.max(maxWeight, set.weight);
          weights.push(set.weight);
        }
      });
      
      performanceHistory.push({
        date: workout.date,
        sets: exercise.sets,
        totalVolume: workoutVolume
      });
      
      volumeByPeriod.push({
        date: workout.date,
        volume: workoutVolume
      });
      
      if (!lastPerformed || workout.date > lastPerformed) {
        lastPerformed = workout.date;
      }
    }
  });
  
  const averageWeight = weights.length > 0 
    ? weights.reduce((a, b) => a + b, 0) / weights.length 
    : 0;
  
  // Вычислить частоту (раз в неделю)
  const daysSinceFirst = performanceHistory.length > 0
    ? (Date.now() - new Date(performanceHistory[performanceHistory.length - 1].date)) / (1000 * 60 * 60 * 24)
    : 0;
  const frequency = daysSinceFirst > 0 
    ? (performanceHistory.length / daysSinceFirst) * 7 
    : 0;
  
  // Найти персональные рекорды
  const personalRecords = [{
    exerciseId,
    exerciseName,
    maxWeight,
    maxReps: Math.max(...performanceHistory.flatMap(h => h.sets.map(s => s.reps))),
    maxVolume: Math.max(...volumeByPeriod.map(v => v.volume)),
    date: lastPerformed
  }];
  
  // Обновить или создать запись статистики
  const stats = await ExerciseStats.findOneAndUpdate(
    { exerciseId },
    {
      exerciseId,
      exerciseName,
      totalVolume,
      totalSets,
      totalReps,
      maxWeight,
      averageWeight,
      volumeByPeriod,
      performanceHistory,
      personalRecords,
      lastPerformed,
      frequency
    },
    { upsert: true, new: true }
  );
  
  return stats;
}

export { calculateExerciseStats };
