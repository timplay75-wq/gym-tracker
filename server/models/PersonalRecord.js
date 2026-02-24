import mongoose from 'mongoose';

const BestSetSchema = new mongoose.Schema({
  weight: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
}, { _id: false });

const PersonalRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exerciseName: { type: String, required: true, trim: true },
  category: { type: String, default: 'other' },

  // Лучшие показатели
  maxWeight: { type: Number, default: 0 },  // Максимальный вес в одном сете
  maxReps: { type: Number, default: 0 },    // Макс повторений (без учёта веса)
  maxVolume: { type: Number, default: 0 },  // Лучший одиночный сет: weight * reps

  bestSet: BestSetSchema,

  // История PR-обновлений
  history: [BestSetSchema],

  updatedAt: { type: Date, default: Date.now },
}, { timestamps: { createdAt: true, updatedAt: false } });

PersonalRecordSchema.index({ userId: 1, exerciseName: 1 }, { unique: true });

export default mongoose.model('PersonalRecord', PersonalRecordSchema);
