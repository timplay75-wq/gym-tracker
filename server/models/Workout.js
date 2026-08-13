import mongoose from 'mongoose';

const SetSchema = new mongoose.Schema({
  reps: {
    type: Number,
    required: true,
    min: 0
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  restTime: {
    type: Number, // секунды
    min: 0
  },
  rpe: {
    type: Number, // Rate of Perceived Exertion (1-10)
    min: 0,
    max: 10
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: String,
  timestamp: Date
});

const PersonalRecordSchema = new mongoose.Schema({
  exerciseId: String,
  exerciseName: String,
  maxWeight: Number,
  maxReps: Number,
  maxVolume: Number,
  date: Date
});

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название упражнения обязательно'],
    trim: true
  },
  category: {
    type: String,
    enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'other'],
    required: true
  },
  type: {
    type: String,
    enum: ['strength', 'cardio', 'stretching'],
    default: 'strength'
  },
  sets: [SetSchema],
  equipment: String,
  targetMuscles: [String],
  instructions: String,
  videoUrl: String,
  personalRecords: PersonalRecordSchema
});

const WorkoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название тренировки обязательно'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  exercises: [ExerciseSchema],
  duration: {
    type: Number, // минуты
    min: 0
  },
  status: {
    type: String,
    enum: ['planned', 'completed', 'in-progress', 'skipped'],
    default: 'planned'
  },
  notes: {
    type: String,
    trim: true
  },
  totalVolume: {
    type: Number,
    default: 0
  },
  totalSets: {
    type: Number,
    default: 0
  },
  totalReps: {
    type: Number,
    default: 0
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutProgram'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Пользователь обязателен']
  },
  startedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  // Защита от повторного начисления монет: клиент вызывает /complete после
  // каждого упражнения, а награда полагается один раз за тренировку.
  coinsAwarded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

/**
 * Считает тоннаж, подходы и повторения по завершённым подходам.
 *
 * Вынесено из хука, чтобы те же значения можно было проставить в атомарном
 * findOneAndUpdate — там pre('save') не срабатывает, и тоталы оставались бы
 * от прошлой версии, отравляя всю статистику.
 */
export function computeTotals(exercises = []) {
  let totalVolume = 0;
  let totalSets = 0;
  let totalReps = 0;

  for (const exercise of exercises) {
    for (const set of exercise?.sets || []) {
      if (set?.completed) {
        totalVolume += (set.weight || 0) * (set.reps || 0);
        totalSets += 1;
        totalReps += set.reps || 0;
      }
    }
  }

  return { totalVolume, totalSets, totalReps };
}

// Вычисление общего тоннажа, подходов и повторений
WorkoutSchema.pre('save', function (next) {
  Object.assign(this, computeTotals(this.exercises));
  next();
});

export default mongoose.model('Workout', WorkoutSchema);
