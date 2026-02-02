import mongoose from 'mongoose';

const ExerciseStatsSchema = new mongoose.Schema({
  exerciseId: {
    type: String,
    required: true,
    unique: true
  },
  exerciseName: {
    type: String,
    required: true
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
  maxWeight: {
    type: Number,
    default: 0
  },
  averageWeight: {
    type: Number,
    default: 0
  },
  volumeByPeriod: [{
    date: Date,
    volume: Number
  }],
  performanceHistory: [{
    date: Date,
    sets: [{
      reps: Number,
      weight: Number,
      completed: Boolean
    }],
    totalVolume: Number
  }],
  personalRecords: [{
    exerciseId: String,
    exerciseName: String,
    maxWeight: Number,
    maxReps: Number,
    maxVolume: Number,
    date: Date
  }],
  lastPerformed: Date,
  frequency: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export default mongoose.model('ExerciseStats', ExerciseStatsSchema);
