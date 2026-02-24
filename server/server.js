import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { rateLimit } from 'express-rate-limit';
import workoutRoutes from './routes/workouts.js';
import userRoutes from './routes/users.js';
import programRoutes from './routes/programs.js';
import statsRoutes from './routes/stats.js';
import exerciseRoutes from './routes/exercises.js';
import recordRoutes from './routes/personalRecords.js';

// Загрузка переменных окружения
dotenv.config();

// Подключение к БД
connectDB();

const app = express();

// Rate limiting для auth маршрутов
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 20,
  message: { message: 'Слишком много запросов, попробуйте через 15 минут' },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', authLimiter, userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/records', recordRoutes);

// Базовый роут
app.get('/', (req, res) => {
  res.json({ message: 'Gym Tracker API работает!' });
});

// Обработка ошибок 404
app.use((req, res) => {
  res.status(404).json({ message: 'Роут не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Что-то пошло не так!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
