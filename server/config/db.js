import mongoose from 'mongoose';
import dns from 'dns';

// Используем Google DNS для резолва SRV записей Atlas
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

/**
 * Подключение переживает вызовы функции.
 *
 * На serverless-платформах (Vercel) модуль загружается заново для каждого
 * «холодного» запуска, но между тёплыми вызовами процесс живёт. Без кэша
 * каждый запрос открывал бы новое соединение и быстро упёрся бы в лимит
 * подключений Atlas. Храним в globalThis, а не в переменной модуля, потому
 * что модуль может быть загружен повторно.
 */
const cache = globalThis.__mongooseCache || (globalThis.__mongooseCache = {
  conn: null,
  promise: null,
});

/**
 * Подключается к MongoDB и возвращает соединение.
 *
 * Раньше здесь при ошибке вызывался process.exit(1). Для обычного сервера это
 * приемлемо, но в serverless убивало бы обработчик запроса целиком, поэтому
 * теперь ошибка пробрасывается — решение о завершении принимает вызывающий.
 */
const connectDB = async () => {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI не задан');
    }

    cache.promise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4, // использовать IPv4
    });
  }

  try {
    cache.conn = await cache.promise;
    console.log(`✅ MongoDB подключена: ${cache.conn.connection.host}`);
    return cache.conn;
  } catch (error) {
    // Сбрасываем обещание, иначе следующий запрос получит ту же ошибку
    // из кэша и повторная попытка станет невозможной.
    cache.promise = null;
    console.error(`❌ Ошибка подключения к MongoDB: ${error.message}`);
    throw error;
  }
};

export default connectDB;
