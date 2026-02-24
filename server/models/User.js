import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Пожалуйста, введите корректный email'],
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: 6,
    select: false,
  },
  avatar: {
    type: String,
    default: null,
  },
  goal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'endurance', 'maintenance', 'flexibility', null],
    default: null,
  },
  weight: {
    type: Number,
    min: 0,
    default: null,
  },
  height: {
    type: Number,
    min: 0,
    default: null,
  },
}, {
  timestamps: true,
});

// Хеширование пароля перед сохранением
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Метод для проверки пароля
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
