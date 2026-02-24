import PersonalRecord from '../models/PersonalRecord.js';

// GET /api/records — все личные рекорды пользователя
export const getAllRecords = async (req, res) => {
  try {
    const records = await PersonalRecord.find({ userId: req.user._id })
      .sort({ maxVolume: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/records/:exerciseName — рекорд по упражнению
export const getRecordByExercise = async (req, res) => {
  try {
    const record = await PersonalRecord.findOne({
      userId: req.user._id,
      exerciseName: decodeURIComponent(req.params.exerciseName),
    });
    if (!record) return res.status(404).json({ message: 'Рекорд не найден' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Внутренняя функция: обновить рекорды из завершённой тренировки
export const updateRecordsFromWorkout = async (userId, workout) => {
  try {
    for (const exercise of workout.exercises) {
      const completedSets = exercise.sets?.filter(s => s.completed && s.weight > 0) || [];
      if (!completedSets.length) continue;

      for (const set of completedSets) {
        const volumeForSet = (set.weight || 0) * (set.reps || 0);

        await PersonalRecord.findOneAndUpdate(
          { userId, exerciseName: exercise.name },
          {
            $setOnInsert: { category: exercise.category || 'other' },
            $max: {
              maxWeight: set.weight || 0,
              maxReps: set.reps || 0,
              maxVolume: volumeForSet,
            },
            $set: { updatedAt: new Date() },
          },
          { upsert: true, new: true }
        );

        // Обновить bestSet если это новый максимум по объёму
        const record = await PersonalRecord.findOne({ userId, exerciseName: exercise.name });
        if (record && volumeForSet >= record.maxVolume) {
          const newBestSet = {
            weight: set.weight,
            reps: set.reps,
            date: workout.completedAt || new Date(),
            workoutId: workout._id,
          };
          await PersonalRecord.findOneAndUpdate(
            { userId, exerciseName: exercise.name },
            {
              $set: { bestSet: newBestSet },
              $push: { history: { $each: [newBestSet], $slice: -20 } },
            }
          );
        }
      }
    }
  } catch (error) {
    console.error('Error updating personal records:', error);
  }
};

// DELETE /api/records/:exerciseName — удалить рекорд
export const deleteRecord = async (req, res) => {
  try {
    await PersonalRecord.findOneAndDelete({
      userId: req.user._id,
      exerciseName: decodeURIComponent(req.params.exerciseName),
    });
    res.json({ message: 'Рекорд удалён' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
