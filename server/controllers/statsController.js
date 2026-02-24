import Workout from '../models/Workout.js';
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
      { $limit: 10 },
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

    const workouts = await Workout.find({
      userId,
      status: 'completed',
      'exercises.name': decodeURIComponent(name),
    }).sort({ completedAt: -1 }).limit(20);

    const history = workouts.map((w) => {
      const exercise = w.exercises.find((e) => e.name === decodeURIComponent(name));
      const completedSets = exercise?.sets?.filter((s) => s.completed) || [];
      const maxWeight = completedSets.reduce((max, s) => Math.max(max, s.weight), 0);
      const totalVolume = completedSets.reduce((sum, s) => sum + s.weight * s.reps, 0);

      return {
        date: w.completedAt || w.date,
        sets: completedSets,
        maxWeight,
        totalVolume,
      };
    });

    res.json(history);
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
export const getExerciseStats = getSummary;
export const getAllExercisesStats = getTopExercises;
export const recalculateExerciseStats = (req, res) => res.json({ message: 'РСЃРїРѕР»СЊР·СѓР№С‚Рµ /api/stats/exercises' });

