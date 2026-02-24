import mongoose from 'mongoose';

const WorkoutDaySchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  exercises: [
    {
      exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
      name: String,
      category: String,
      sets: { type: Number, default: 3 },
      reps: { type: Number, default: 10 },
      weight: { type: Number, default: 0 },
      restTime: { type: Number, default: 90 },
    },
  ],
});

const ProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название программы обязательно'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  days: [WorkoutDaySchema],
  isActive: {
    type: Boolean,
    default: false,
  },
  durationWeeks: {
    type: Number,
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.model('WorkoutProgram', ProgramSchema);
