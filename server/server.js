import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { authLimiter, writeLimiter } from './middleware/rateLimiters.js';
import workoutRoutes from './routes/workouts.js';
import userRoutes from './routes/users.js';
import programRoutes from './routes/programs.js';
import statsRoutes from './routes/stats.js';
import exerciseRoutes from './routes/exercises.js';
import recordRoutes from './routes/personalRecords.js';
import oauthRoutes from './routes/oauth.js';
import measurementRoutes from './routes/measurements.js';
import shopRoutes from './routes/shop.js';
import subscriptionRoutes from './routes/subscriptions.js';

// Загрузка переменных окружения
dotenv.config();

// Подключение к БД
connectDB();

const app = express();

// Railway/Vercel проксируют запросы: без этого express-rate-limit видит один
// IP прокси для всех клиентов и общий лимит становится глобальным.
app.set('trust proxy', 1);


// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Разрешить запросы без origin (curl, мобильные приложения)
    if (!origin) return callback(null, true);
    
    const allowed = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim());
    // Разрешить все Vercel preview URLs проекта
    if (
      allowed.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin === 'http://localhost:5173' ||
      origin === 'https://tonna.ge' ||
      origin === 'https://www.tonna.ge'
    ) {
      return callback(null, true);
    }
    callback(new Error('CORS not allowed'));
  },
  credentials: true,
}));
// rawBody нужен для проверки HMAC-подписи вебхука платёжки: подпись считается
// по байтам тела, а не по результату JSON.parse.
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; },
}));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', authLimiter, userRoutes);
app.use('/api/workouts', writeLimiter, workoutRoutes);
app.use('/api/programs', writeLimiter, programRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/exercises', writeLimiter, exerciseRoutes);
app.use('/api/records', writeLimiter, recordRoutes);
app.use('/api/oauth', authLimiter, oauthRoutes);
app.use('/api/measurements', writeLimiter, measurementRoutes);
app.use('/api/shop', writeLimiter, shopRoutes);
app.use('/api/subscriptions', writeLimiter, subscriptionRoutes);

// Базовый роут
app.get('/', (req, res) => {
  res.json({ message: 'Gym Tracker API работает!' });
});

// Health-check для UptimeRobot / keep-alive пинга
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Обработка ошибок 404
app.use((req, res) => {
  res.status(404).json({ message: 'Роут не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Если ответ уже ушёл, повторная отправка бросит ERR_HTTP_HEADERS_SENT —
  // отдаём управление обработчику Express по умолчанию.
  if (res.headersSent) return next(err);
  res.status(500).json({
    message: 'Что-то пошло не так!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

// Одиночная ошибка в асинхронном обработчике не должна ронять процесс:
// логируем и продолжаем обслуживать остальные запросы.
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
});

export default app;
