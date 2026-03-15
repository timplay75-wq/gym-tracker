# Обязательные правила (всегда соблюдать)

- **Одна функция на промт** — реализовывать одну фичу, но полностью и качественно
- **Коммит только после подтверждения** — не делать `git commit` пока пользователь не сказал что всё работает
- **Цвета через hex** — `bg-[#9333ea]`, `text-[#7c3aed]`, не `bg-primary-500`
- **После изменений** — запускать `npx vitest run` и убеждаться что все тесты зелёные
- **Серверы всегда включены** — если фронтенд (`npm run dev`, порт 5173) или бэкенд (`server/npm run dev`, порт 5000) не запущены — запускать их автоматически в начале работы, без вопросов
- **Полный файл правил** — см. RULES.md в корне проекта

---

# Gym Tracker PWA - Project Setup Complete! 🎉

## Frontend Configuration ✅
- React 19 with TypeScript ✅
- Vite build tool ✅
- Tailwind CSS ✅
- React Router ✅
- ESLint and Prettier ✅
- PWA with manifest.json and service worker ✅
- Folder structure: components, pages, hooks, utils, services, types ✅

## Backend Configuration ✅
- Node.js + Express REST API ✅
- MongoDB with Mongoose ✅
- JWT Authentication ✅
- bcryptjs for password hashing ✅
- CORS enabled ✅
- Full CRUD for workouts ✅
- User registration/login ✅

## Setup Steps ✅
- [x] Clarify Project Requirements
- [x] Scaffold the Project
- [x] Customize the Project
- [x] Install Required Extensions (N/A)
- [x] Compile the Project
- [x] Create Backend Structure
- [x] Create API Routes and Controllers
- [x] Configure Database Connection
- [x] Update Frontend Services
- [x] Create Documentation

## 🚀 Next Steps

1. **Install MongoDB:**
   - Local: https://www.mongodb.com/try/download/community
   - Cloud: https://www.mongodb.com/cloud/atlas (recommended)

2. **Run Backend:**
   ```bash
   cd server
   npm run dev
   ```

3. **Run Frontend:**
   ```bash
   npm run dev
   ```

4. **Add PWA Icons:**
   - Create 192x192 and 512x512 icons in `public/icons/`

5. **Integrate Backend:**
   - Update components to use `apiService` instead of `storageService`
   - Add authentication flow
   - Add JWT token management

## 📚 Documentation

- Main README: [README.md](../README.md)
- Backend README: [server/README.md](../server/README.md)
- Quick Start: [QUICKSTART.md](../QUICKSTART.md)

Проект полностью готов к разработке! 💪
