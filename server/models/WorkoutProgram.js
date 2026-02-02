import mongoose from 'mongoose';

const WorkoutProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название программы обязательно'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  workouts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout'
  }],
  schedule: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  duration: {
    type: Number, // недели
    min: 1
  },
  isActive: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

// Обеспечить, что только одна программа может быть активной
WorkoutProgramSchema.pre('save', async function(next) {
  if (this.isActive && this.userId) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

export default mongoose.model('WorkoutProgram', WorkoutProgramSchema);
