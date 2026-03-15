import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название упражнения обязательно'],
    trim: true,
  },
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
  equipment: {
    type: String,
    default: null,
  },
  targetMuscles: [String],
  instructions: {
    type: String,
    default: null,
  },
  videoUrl: {
    type: String,
    default: null,
  },
  isDoubleWeight: {
    type: Boolean,
    default: false,
  },
  isBodyweight: {
    type: Boolean,
    default: false,
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

// Индекс для быстрого поиска
ExerciseSchema.index({ category: 1 });
ExerciseSchema.index({ name: 'text' });

export default mongoose.model('Exercise', ExerciseSchema);
