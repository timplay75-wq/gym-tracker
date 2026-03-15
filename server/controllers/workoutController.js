import Workout from '../models/Workout.js';
import User from '../models/User.js';
import { updateRecordsFromWorkout } from './personalRecordController.js';

// POST /api/workouts/fix-completed — миграция: добавляет completedAt к завершённым тренировкам без этого поля
export const fixCompletedWorkouts = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Workout.updateMany(
      { userId, status: 'completed', completedAt: { $exists: false } },
      [{ $set: { completedAt: { $ifNull: ['$updatedAt', '$date', new Date()] } } }]
    );
    const result2 = await Workout.updateMany(
      { userId, status: 'completed', completedAt: null },
      [{ $set: { completedAt: { $ifNull: ['$updatedAt', '$date', new Date()] } } }]
    );
    res.json({ fixed: (result.modifiedCount || 0) + (result2.modifiedCount || 0) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workouts
export const getAllWorkouts = async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    const total = await Workout.countDocuments(filter);
    const workouts = await Workout.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({ workouts, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workouts/today
export const getTodayWorkout = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const workout = await Workout.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: tomorrow },
      status: { $ne: 'skipped' },
    }).sort({ date: -1 });

    res.json(workout || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workouts/:id
export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, userId: req.user._id });
    if (!workout) return res.status(404).json({ message: 'РўСЂРµРЅРёСЂРѕРІРєР° РЅРµ РЅР°Р№РґРµРЅР°' });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/workouts
export const createWorkout = async (req, res) => {
  try {
    console.log('📥 createWorkout body:', JSON.stringify(req.body, null, 2));
    const workout = new Workout({ ...req.body, userId: req.user._id });
    const saved = await workout.save();
    console.log('✅ workout saved:', saved._id);
    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ createWorkout error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/workouts/:id
export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!workout) return res.status(404).json({ message: 'РўСЂРµРЅРёСЂРѕРІРєР° РЅРµ РЅР°Р№РґРµРЅР°' });
    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/workouts/:id
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!workout) return res.status(404).json({ message: 'РўСЂРµРЅРёСЂРѕРІРєР° РЅРµ РЅР°Р№РґРµРЅР°' });
    res.json({ message: 'РўСЂРµРЅРёСЂРѕРІРєР° СѓРґР°Р»РµРЅР°' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/workouts/:id/start
export const startWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, status: 'planned' },
      { status: 'in-progress', startedAt: new Date() },
      { new: true }
    );
    if (!workout) return res.status(404).json({ message: 'РўСЂРµРЅРёСЂРѕРІРєР° РЅРµ РЅР°Р№РґРµРЅР° РёР»Рё СѓР¶Рµ РЅР°С‡Р°С‚Р°' });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/workouts/:id/complete
export const completeWorkout = async (req, res) => {
  try {
    const { duration, exercises } = req.body;
    const workout = await Workout.findOne({ _id: req.params.id, userId: req.user._id });
    if (!workout) return res.status(404).json({ message: 'РўСЂРµРЅРёСЂРѕРІРєР° РЅРµ РЅР°Р№РґРµРЅР°' });

    workout.status = 'completed';
    workout.completedAt = new Date();
    if (duration) workout.duration = duration;
    if (exercises) workout.exercises = exercises;
    await workout.save();

    // Автообновляем личные рекорды
    await updateRecordsFromWorkout(req.user._id, workout);

    // Начисляем 10 монет за завершённую тренировку
    await User.findByIdAndUpdate(req.user._id, { $inc: { coins: 10 } });

    res.json(workout.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workouts/stats вЂ” РѕР±С‰Р°СЏ СЃС‚Р°С‚РёСЃС‚РёРєР°
export const getWorkoutStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, thisMonth, totalVolume] = await Promise.all([
      Workout.countDocuments({ userId, status: 'completed' }),
      Workout.countDocuments({ userId, status: 'completed', completedAt: { $gte: monthStart } }),
      Workout.aggregate([
        { $match: { userId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalVolume' } } },
      ]),
    ]);

    res.json({
      totalWorkouts: total,
      thisMonthWorkouts: thisMonth,
      totalVolume: totalVolume[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET /api/workouts/calendar?year=2026&month=2 — тренировки по дням месяца
export const getCalendar = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const year = parseInt(req.query.year) || now.getFullYear();
    const month = parseInt(req.query.month) || now.getMonth() + 1;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const workouts = await Workout.find({
      userId,
      date: { $gte: start, $lt: end },
    }).select('date status name totalVolume duration').lean();

    const byDay = {};
    workouts.forEach((w) => {
      const d = new Date(w.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push({ _id: w._id, name: w.name, status: w.status, totalVolume: w.totalVolume, duration: w.duration });
    });

    const result = Object.entries(byDay).map(([date, items]) => ({
      date,
      count: items.length,
      status: items.some((w) => w.status === 'completed') ? 'completed'
            : items.some((w) => w.status === 'in-progress') ? 'in-progress'
            : 'planned',
      workouts: items,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

