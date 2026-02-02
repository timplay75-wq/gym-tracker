# Gym Tracker - REST API Backend

Backend для приложения трекинга тренировок на Node.js + Express + MongoDB.

## Технологии

- **Node.js** - runtime
- **Express** - веб-фреймворк
- **MongoDB** - база данных
- **Mongoose** - ODM для MongoDB
- **JWT** - аутентификация
- **bcryptjs** - хеширование паролей

## Установка

```bash
cd server
npm install
```

## Настройка

Создайте файл `.env` в папке `server/`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gym-tracker
JWT_SECRET=your-secret-key
```

## Установка MongoDB

### Windows:
1. Скачайте MongoDB Community: https://www.mongodb.com/try/download/community
2. Установите MongoDB
3. Запустите MongoDB:
```bash
mongod
```

### Или используйте MongoDB Atlas (облачная БД):
1. Создайте аккаунт: https://www.mongodb.com/cloud/atlas
2. Создайте кластер
3. Получите строку подключения и вставьте в `.env`

## Запуск

```bash
# Режим разработки
npm run dev

# Продакшн
npm start
```

Сервер запустится на http://localhost:5000

## API Endpoints

### Тренировки

- `GET /api/workouts` - Получить все тренировки
- `GET /api/workouts/:id` - Получить тренировку по ID
- `POST /api/workouts` - Создать тренировку
- `PUT /api/workouts/:id` - Обновить тренировку
- `DELETE /api/workouts/:id` - Удалить тренировку
- `GET /api/workouts/stats` - Получить статистику

### Программы тренировок

- `GET /api/programs` - Получить все программы
- `GET /api/programs/:id` - Получить программу по ID
- `POST /api/programs` - Создать программу
- `PUT /api/programs/:id` - Обновить программу
- `DELETE /api/programs/:id` - Удалить программу
- `POST /api/programs/:id/activate` - Активировать программу

### Статистика упражнений

- `GET /api/stats` - Получить статистику всех упражнений
- `GET /api/stats/:exerciseId` - Получить статистику упражнения
- `POST /api/stats/:exerciseId/recalculate` - Пересчитать статистику

### Пользователи

- `POST /api/users/register` - Регистрация
- `POST /api/users/login` - Вход
- `GET /api/users/profile` - Профиль (требует токен)

## Примеры запросов

### Создать тренировку
```json
POST /api/workouts
{
  "name": "Грудь и трицепс",
  "date": "2026-02-01T10:00:00Z",
  "status": "planned",
  "exercises": [
    {
      "name": "Жим лежа",
      "category": "chest",
      "type": "strength",
      "sets": [
        { 
          "reps": 10, 
          "weight": 80, 
          "completed": false,
          "restTime": 90,
          "rpe": 8
        }
      ]
    }
  ]
}
```

### Создать программу тренировок
```json
POST /api/programs
{
  "name": "Push/Pull/Legs",
  "description": "Трехдневный сплит",
  "duration": 12,
  "schedule": {
    "monday": "push-workout-id",
    "wednesday": "pull-workout-id",
    "friday": "legs-workout-id"
  }
}
```

### Получить статистику упражнения
```bash
GET /api/stats/bench-press
```

### Регистрация
```json
POST /api/users/register
{
  "name": "Иван",
  "email": "ivan@example.com",
  "password": "123456"
}
```
