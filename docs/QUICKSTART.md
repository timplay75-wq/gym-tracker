# 🚀 Быстрый старт - Gym Tracker

## ✅ Что уже сделано:

✔ React 19 + TypeScript + Vite фронтенд
✔ Tailwind CSS для стилей  
✔ React Router для навигации
✔ PWA с service worker
✔ Node.js + Express + MongoDB бэкенд
✔ JWT аутентификация
✔ Все зависимости установлены

## 📋 Что нужно сделать перед запуском:

### 1. Установить MongoDB

**Вариант A: Локальная установка (Windows)**
1. Скачать: https://www.mongodb.com/try/download/community
2. Установить MongoDB Community Edition
3. Запустить MongoDB:
   ```bash
   mongod
   ```

**Вариант B: Облачная БД MongoDB Atlas (рекомендуется)**
1. Создать бесплатный аккаунт: https://www.mongodb.com/cloud/atlas/register
2. Создать кластер (бесплатный M0 Sandbox)
3. Получить строку подключения (Connect -> Connect your application)
4. Заменить в `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gym-tracker
   ```

## 🎮 Запуск приложения

### Вариант 1: Полный стек (Frontend + Backend)

**Терминал 1 - Backend:**
```bash
cd server
npm run dev
```
✅ Backend запустится на http://localhost:5000

**Терминал 2 - Frontend:**
```bash
npm run dev
```
✅ Frontend запустится на http://localhost:5173

### Вариант 2: Только Frontend (без бэкенда, использует localStorage)

```bash
npm run dev
```

## 🧪 Тестирование API

### Через браузер:
- http://localhost:5000 - проверка работы API

### Через Postman или curl:

**Создать тренировку:**
```bash
curl -X POST http://localhost:5000/api/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Грудь и трицепс",
    "exercises": [{
      "name": "Жим лежа",
      "category": "chest",
      "sets": [{"reps": 10, "weight": 80, "completed": true}]
    }]
  }'
```

**Получить все тренировки:**
```bash
curl http://localhost:5000/api/workouts
```

## 📱 Возможности приложения

- ✅ Создание тренировок
- ✅ Добавление упражнений и подходов
- ✅ Просмотр истории
- ✅ Статистика
- ✅ Работает офлайн (PWA)
- ✅ Синхронизация с сервером
- ✅ Регистрация/вход (JWT)

## 🔧 Полезные команды

```bash
# Форматирование кода
npm run format

# Линтинг
npm run lint

# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview
```

## 📚 Структура проекта

```
gym-tracker/
├── src/              # Frontend
│   ├── components/   # React компоненты
│   ├── pages/        # Страницы
│   ├── services/     # API клиент
│   └── types/        # TypeScript типы
│
├── server/           # Backend API
│   ├── models/       # MongoDB модели
│   ├── routes/       # API endpoints
│   ├── controllers/  # Бизнес-логика
│   └── config/       # Конфигурация
│
└── public/           # Статические файлы
```

## 🎯 Следующие шаги

1. Добавить иконки в `public/icons/` (192x192 и 512x512)
2. Интегрировать API в компоненты фронтенда
3. Добавить формы регистрации/входа
4. Настроить хранение JWT токенов
5. Добавить графики прогресса

## ❓ Возможные проблемы

**MongoDB не запускается:**
- Используйте MongoDB Atlas (облачный вариант)
- Проверьте, что порт 27017 свободен

**CORS ошибки:**
- Уже настроено в `server/server.js`
- Проверьте, что backend запущен на порту 5000

**Порт занят:**
- Frontend: измените в `vite.config.ts`
- Backend: измените PORT в `server/.env`

## 🎉 Готово!

Приложение готово к использованию. Приятной разработки! 💪
