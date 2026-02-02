# Gym Tracker PWA 💪

Полнофункциональное приложение для отслеживания тренировок с REST API бэкендом.

## 🚀 Технологии

### Frontend
- **React 19** - UI библиотека
- **TypeScript** - типобезопасность
- **Vite** - быстрая сборка и разработка
- **Tailwind CSS** - утилитарные стили
- **React Router** - маршрутизация
- **PWA** - работает офлайн, устанавливается на устройство

### Backend
- **Node.js + Express** - REST API сервер
- **MongoDB + Mongoose** - база данных
- **JWT** - аутентификация
- **bcryptjs** - безопасность

## 📁 Структура проекта

```
gym-tracker/
├── src/              # Frontend React приложение
│   ├── components/
│   ├── pages/
│   ├── services/     # API и localStorage
│   ├── types/
│   └── utils/
└── server/           # Backend REST API
    ├── config/       # Конфигурация БД
    ├── models/       # MongoDB модели
    ├── routes/       # API routes
    ├── controllers/  # Бизнес-логика
    └── middleware/   # JWT auth
```

## 🛠 Установка и запуск

### 1. Установка MongoDB

**Windows:**
```bash
# Скачайте и установите MongoDB Community
# https://www.mongodb.com/try/download/community
mongod
```

**Или используйте MongoDB Atlas (облачная БД):**
https://www.mongodb.com/cloud/atlas

### 2. Установка зависимостей

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 3. Настройка переменных окружения

Создайте `.env` в корне проекта:
```env
VITE_API_URL=http://localhost:5000/api
```

Создайте `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gym-tracker
JWT_SECRET=your-secret-key-change-this
```

### 4. Запуск приложения

**Вариант 1: Раздельный запуск (рекомендуется для разработки)**

Терминал 1 - Backend:
```bash
cd server
npm run dev
```

Терминал 2 - Frontend:
```bash
npm run dev
```

**Вариант 2: Только Frontend (без бэкенда, используя localStorage)**
```bash
npm run dev
```

### 5. Открыть приложение

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📡 API Endpoints

### Тренировки
- `GET /api/workouts` - Все тренировки
- `GET /api/workouts/:id` - Одна тренировка
- `POST /api/workouts` - Создать
- `PUT /api/workouts/:id` - Обновить
- `DELETE /api/workouts/:id` - Удалить
- `GET /api/workouts/stats` - Статистика

### Пользователи
- `POST /api/users/register` - Регистрация
- `POST /api/users/login` - Вход
- `GET /api/users/profile` - Профиль (требует JWT)

### Сборка для продакшена

```bash
npm run build
```

### Предпросмотр продакшен сборки

```bash
npm run preview
```

### Линтинг и форматирование

```bash
# Запустить ESLint
npm run lint

# Отформатировать код с помощью Prettier
npm run format
```

## 📱 PWA возможности

- ✅ Работает офлайн благодаря Service Worker
- ✅ Устанавливается на домашний экран
- ✅ Быстрая загрузка благодаря кешированию
- ✅ Адаптивный дизайн для всех устройств

## 🎯 Основные функции

- Создание и отслеживание тренировок
- Добавление упражнений и подходов
- Хранение данных локально (localStorage)
- История тренировок
- Статистика прогресса

## 📝 Примечание об иконках

Иконки для PWA (icon-192x192.png и icon-512x512.png) должны быть добавлены в папку `public/icons/`.

Вы можете сгенерировать их с помощью онлайн-сервисов:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

## 📄 Лицензия

MIT

## 🤝 Вклад в проект

Pull requests приветствуются! Для больших изменений сначала откройте issue для обсуждения.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
