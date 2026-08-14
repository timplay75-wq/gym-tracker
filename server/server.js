// Запуск обычным сервером: локальная разработка, Docker, Render, VPS.
//
// Само приложение живёт в app.js — так его можно поднять и без своего порта,
// например как serverless-функцию на Vercel (см. api/index.js).
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Подключаемся заранее, чтобы первый запрос не ждал соединения.
// Здесь, в отличие от serverless, недоступная база — повод не стартовать.
connectDB().catch((error) => {
  console.error('❌ Не удалось подключиться к MongoDB, останавливаюсь:', error.message);
  process.exit(1);
});

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
