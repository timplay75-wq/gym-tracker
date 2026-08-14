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

const app = express();

// Railway/Vercel/Render проксируют запросы: без этого express-rate-limit видит
// один IP прокси для всех клиентов и общий лимит становится глобальным.
app.set('trust proxy', 1);

const isDev = () => process.env.NODE_ENV === 'development';

// Источники, которым разрешено обращаться к API.
//
// Раньше здесь стояла маска *.vercel.app: под неё подходил любой сайт, который
// кто угодно за минуту разворачивает на Vercel. Список задаётся через
// CORS_ORIGIN — несколько адресов пишутся через запятую.
const allowedOrigins = () =>
  (process.env.CORS_ORIGIN || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

const DEV_ORIGINS = ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({
  origin: function (origin, callback) {
    // Запросы без Origin — это curl, мобильные приложения и серверные вызовы
    if (!origin) return callback(null, true);

    if (allowedOrigins().includes(origin)) return callback(null, true);
    if (isDev() && DEV_ORIGINS.includes(origin)) return callback(null, true);

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

// Health-check объявлен до подключения к базе: он должен отвечать даже когда
// база недоступна, иначе платформа не отличит «сервис жив, но БД лежит»
// от «сервис не поднялся».
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Gym Tracker API работает!' });
});

// Гарантируем соединение с базой перед обработкой запросов к данным.
// На обычном сервере оно уже установлено при старте и это no-op; в serverless
// первый запрос после холодного старта подключается здесь.
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch {
    res.status(503).json({ message: 'База данных недоступна' });
  }
});

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

export default app;
