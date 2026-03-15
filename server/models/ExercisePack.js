import mongoose from 'mongoose';

const ExercisePackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  icon: {
    type: String,
    default: '📦',
  },
  category: {
    type: String,
    enum: ['crossfit', 'yoga', 'powerlifting', 'calisthenics'],
    required: true,
  },
  exercises: [{
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'other'],
      required: true,
    },
    type: {
      type: String,
      enum: ['strength', 'cardio', 'stretching'],
      default: 'strength',
    },
    equipment: { type: String, default: null },
  }],
}, {
  timestamps: true,
});

export default mongoose.model('ExercisePack', ExercisePackSchema);
