import Workout from '../models/Workout.js';
import Exercise from '../models/Exercise.js';
import mongoose from 'mongoose';

// GET /api/stats/summary вЂ” СЃРІРѕРґРЅР°СЏ СЃС‚Р°С‚РёСЃС‚РёРєР° РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
export const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [total, thisMonth, lastMonth, volumeAgg] = await Promise.all([
      Workout.countDocuments({ userId, status: 'completed' }),
      Workout.countDocuments({ userId, status: 'completed', completedAt: { $gte: monthStart } }),
      Workout.countDocuments({ userId, status: 'completed', completedAt: { $gte: lastMonthStart, $lt: monthStart } }),
      Workout.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalVolume' }, avgDuration: { $avg: '$duration' } } },
      ]),
    ]);

    const streak = await calculateStreak(userId);

    res.json({
      totalWorkouts: total,
      thisMonthWorkouts: thisMonth,
      lastMonthWorkouts: lastMonth,
      totalVolume: volumeAgg[0]?.total || 0,
      avgDuration: Math.round(volumeAgg[0]?.avgDuration || 0),
      currentStreak: streak,
    });
  } catch (error) {
    console.error('Stats summary error:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/stats/weekly вЂ” СЃС‚Р°С‚РёСЃС‚РёРєР° РїРѕ РЅРµРґРµР»СЏРј (РїРѕСЃР»РµРґРЅРёРµ 8 РЅРµРґРµР»СЊ)
export const getWeeklyStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const weeksAgo = new Date();
    weeksAgo.setDate(weeksAgo.getDate() - 56); // 8 РЅРµРґРµР»СЊ

    const workouts = await Workout.find({
      userId,
      status: 'completed',
      completedAt: { $gte: weeksAgo },
    }).select('completedAt totalVolume duration');

    // Р“СЂСѓРїРїРёСЂСѓРµРј РїРѕ РЅРµРґРµР»СЏРј
    const weeks = {};
    workouts.forEach((w) => {
      const date = new Date(w.completedAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay() + 1);
      weekStart.setHours(0, 0, 0, 0);
      const key = weekStart.toISOString().split('T')[0];

      if (!weeks[key]) weeks[key] = { week: key, count: 0, volume: 0, duration: 0 };
      weeks[key].count += 1;
      weeks[key].volume += w.totalVolume || 0;
      weeks[key].duration += w.duration || 0;
    });

    res.json(Object.values(weeks).sort((a, b) => a.week.localeCompare(b.week)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/stats/exercises вЂ” С‚РѕРї СѓРїСЂР°Р¶РЅРµРЅРёР№ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ РїРѕ С‚РѕРЅРЅР°Р¶Сѓ
export const getTopExercises = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Workout.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'completed' } },
      { $unwind: '$exercises' },
      { $unwind: '$exercises.sets' },
      { $match: { 'exercises.sets.completed': true } },
      {
        $group: {
          _id: '$exercises.name',
          category: { $first: '$exercises.category' },
          totalVolume: { $sum: { $multiply: ['$exercises.sets.weight', '$exercises.sets.reps'] } },
          totalSets: { $sum: 1 },
          maxWeight: { $max: '$exercises.sets.weight' },
          times: { $addToSet: '$_id' },
        },
      },
      { $addFields: { timesPerformed: { $size: '$times' } } },
      { $sort: { totalVolume: -1 } },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/stats/muscles — распределение нагрузки по группам мышц
export const getMuscleDistribution = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period } = req.query; // week, month, year, all
    const now = new Date();
    let dateFilter = {};

    if (period === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { completedAt: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { completedAt: { $gte: monthAgo } };
    } else if (period === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      dateFilter = { completedAt: { $gte: yearAgo } };
    }

    const result = await Workout.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'completed', ...dateFilter } },
      { $unwind: '$exercises' },
      { $unwind: '$exercises.sets' },
      { $match: { 'exercises.sets.completed': true } },
      {
        $group: {
          _id: '$exercises.category',
          volume: { $sum: { $multiply: ['$exercises.sets.weight', '$exercises.sets.reps'] } },
          sets: { $sum: 1 },
          exercises: { $addToSet: '$exercises.name' },
        },
      },
      { $addFields: { exerciseCount: { $size: '$exercises' } } },
      { $sort: { volume: -1 } },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/stats/exercise/:name вЂ” РёСЃС‚РѕСЂРёСЏ РїРѕ РєРѕРЅРєСЂРµС‚РЅРѕРјСѓ СѓРїСЂР°Р¶РЅРµРЅРёСЋ
export const getExerciseHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);

    const [workouts, exerciseDoc] = await Promise.all([
      Workout.find({
        userId,
        'exercises.name': decodedName,
        'exercises.sets.completed': true,
      }).sort({ completedAt: -1, date: -1 }).limit(50),
      Exercise.findOne({
        name: decodedName,
        $or: [{ createdBy: userId }, { isCustom: false }],
      }),
    ]);

    // Personal records across ALL data
    let prMaxWeight = 0;
    let prMaxReps = 0;
    let prMaxVolume = 0;
    let prMaxWeightDate = null;
    let prMaxRepsDate = null;
    let prMaxVolumeDate = null;

    const history = workouts.map((w) => {
      const exercise = w.exercises.find((e) => e.name === decodedName);
      const completedSets = exercise?.sets?.filter((s) => s.completed) || [];
      if (!completedSets.length) return null;
      const maxWeight = completedSets.reduce((max, s) => Math.max(max, s.weight || 0), 0);
      const maxReps = completedSets.reduce((max, s) => Math.max(max, s.reps || 0), 0);
      const totalVolume = completedSets.reduce((sum, s) => sum + (s.weight || 0) * (s.reps || 0), 0);
      const totalReps = completedSets.reduce((sum, s) => sum + (s.reps || 0), 0);
      const date = w.completedAt || w.date;

      // Track PRs
      if (maxWeight > prMaxWeight) { prMaxWeight = maxWeight; prMaxWeightDate = date; }
      if (maxReps > prMaxReps) { prMaxReps = maxReps; prMaxRepsDate = date; }
      if (totalVolume > prMaxVolume) { prMaxVolume = totalVolume; prMaxVolumeDate = date; }

      return {
        date,
        sets: completedSets.map((s) => ({ weight: s.weight, reps: s.reps })),
        maxWeight,
        maxReps,
        totalVolume,
        totalReps,
        setsCount: completedSets.length,
      };
    });

    const filteredHistory = history.filter(Boolean);

    // Detect flags from Exercise doc, with fallback auto-detection from data
    let isBodyweight = exerciseDoc?.isBodyweight || false;
    let isDoubleWeight = exerciseDoc?.isDoubleWeight || false;

    // Fallback: if all completed sets across all sessions have weight=0, treat as bodyweight
    if (!isBodyweight && filteredHistory.length > 0) {
      const allWeightsZero = filteredHistory.every((h) => h.maxWeight === 0);
      if (allWeightsZero) isBodyweight = true;
    }

    res.json({
      exerciseName: decodedName,
      totalSessions: workouts.length,
      isDoubleWeight,
      isBodyweight,
      personalRecords: {
        maxWeight: { value: prMaxWeight, date: prMaxWeightDate },
        maxReps: { value: prMaxReps, date: prMaxRepsDate },
        maxVolume: { value: prMaxVolume, date: prMaxVolumeDate },
      },
      history: filteredHistory.reverse(), // chronological order for charts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Р’СЃРїРѕРјРѕРіР°С‚РµР»СЊРЅР°СЏ: РїРѕРґСЃС‡С‘С‚ streak
async function calculateStreak(userId) {
  const workouts = await Workout.find({ userId, status: 'completed' })
    .sort({ completedAt: -1 })
    .select('completedAt')
    .lean();

  if (!workouts.length) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < workouts.length; i++) {
    const date = new Date(workouts[i].completedAt);
    date.setHours(0, 0, 0, 0);

    const expected = new Date(today);
    expected.setDate(today.getDate() - streak);

    if (date.getTime() === expected.getTime()) {
      streak++;
    } else if (streak === 0) {
      // Р•СЃР»Рё СЃРµРіРѕРґРЅСЏ РЅРµС‚ вЂ” РїСЂРѕРІРµСЂСЏРµРј РІС‡РµСЂР°
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      if (date.getTime() === yesterday.getTime()) {
        streak++;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
}

// РЈСЃС‚Р°СЂРµРІС€РёРµ СЌРЅРґРїРѕРёРЅС‚С‹ (СЃРѕРІРјРµСЃС‚РёРјРѕСЃС‚СЊ СЃРѕ СЃС‚Р°СЂС‹Рј routes/stats.js)
// GET /api/stats/weekdays — frequency by day of week
export const getWeekdayFrequency = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Workout.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'completed' } },
      { $group: { _id: { $dayOfWeek: '$completedAt' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    // MongoDB $dayOfWeek: 1=Sun, 2=Mon,...7=Sat → convert to 0=Mon...6=Sun
    const days = [0, 0, 0, 0, 0, 0, 0];
    result.forEach(r => {
      const idx = r._id === 1 ? 6 : r._id - 2;
      days[idx] = r.count;
    });
    res.json(days);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExerciseStats = getSummary;
export const getAllExercisesStats = getTopExercises;
export const recalculateExerciseStats = (req, res) => res.json({ message: 'РСЃРїРѕР»СЊР·СѓР№С‚Рµ /api/stats/exercises' });

