import BodyMeasurement from '../models/BodyMeasurement.js';

// GET /api/measurements — последние 90 записей
export const getAll = async (req, res) => {
  try {
    const records = await BodyMeasurement.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(365);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/measurements/latest — последняя запись
export const getLatest = async (req, res) => {
  try {
    const record = await BodyMeasurement.findOne({ userId: req.user._id }).sort({ date: -1 });
    res.json(record || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/measurements — добавить или обновить запись за дату
export const upsert = async (req, res) => {
  try {
    const { date, weight, notes } = req.body;
    if (!date || weight == null) {
      return res.status(400).json({ message: 'date и weight обязательны' });
    }
    const parsed = parseFloat(weight);
    if (isNaN(parsed) || parsed <= 0 || parsed > 999) {
      return res.status(400).json({ message: 'Некорректный вес' });
    }

    const record = await BodyMeasurement.findOneAndUpdate(
      { userId: req.user._id, date },
      { weight: parsed, notes: notes || '' },
      { upsert: true, new: true }
    );
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/measurements/:date — удалить запись за дату
export const remove = async (req, res) => {
  try {
    const result = await BodyMeasurement.findOneAndDelete({
      userId: req.user._id,
      date: req.params.date,
    });
    if (!result) return res.status(404).json({ message: 'Запись не найдена' });
    res.json({ message: 'Удалено' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
