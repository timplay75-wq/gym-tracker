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
    min: 1,
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
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutProgram'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

// Вычисление общего тоннажа перед сохранением
WorkoutSchema.pre('save', function(next) {
  let totalVolume = 0;
  this.exercises.forEach(exercise => {
    exercise.sets.forEach(set => {
      if (set.completed) {
        totalVolume += set.weight * set.reps;
      }
    });
  });
  this.totalVolume = totalVolume;
  next();
});

export default mongoose.model('Workout', WorkoutSchema);
