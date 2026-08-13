import { rateLimit } from 'express-rate-limit';

const isDev = () => process.env.NODE_ENV === 'development';
const isProd = () => process.env.NODE_ENV === 'production';

// Логин и регистрация
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: () => (isProd() ? 20 : 200),
  message: { message: 'Слишком много запросов, попробуйте через 15 минут' },
  skip: isDev,
});

// Точки, пригодные для перебора: сброс пароля и OAuth-колбэки
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: () => (isProd() ? 10 : 100),
  message: { message: 'Слишком много запросов, попробуйте через 15 минут' },
  skip: isDev,
});

// Мутирующие запросы к данным; чтение не ограничиваем
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: () => (isProd() ? 300 : 5000),
  message: { message: 'Слишком много запросов, попробуйте позже' },
  skip: (req) => isDev() || req.method === 'GET' || req.method === 'HEAD',
});
