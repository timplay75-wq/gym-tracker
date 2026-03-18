# 🏋️ Gym Tracker PWA — Мастер-промты

> Актуальный сводный документ. Заменяет PROMPTS.md, PROMPTS_IMPROVED.md, PROMPTS_CONTINUED.md.
> Обновлён с учётом реального стека: **React 19 + TypeScript + Vite + Tailwind + MongoDB + Express + JWT**.

---

## ✅ Статус выполнения

| Этап | Описание | Статус |
|------|----------|--------|
| 1 | Архитектура, структура данных, типы | ✅ Готово |
| 2 | Дизайн-система, Tailwind, темная тема, UI-компоненты (Button, Card, Input, Modal, NumberStepper) | ✅ Готово |
| 3 | Home, WorkoutBuilder, ActiveWorkout, ExerciseLibrary, CreateExercise | ✅ Готово |
| 4 | Statistics, ExerciseStats, Calendar | ✅ Готово |
| 5 | JWT Auth, Login/Register, Profile, OAuth (Google/GitHub/Microsoft) | ✅ Готово |
| 6 | Programs, CreateProgram, библиотека упражнений | ✅ Готово |
| 7.1 | PWA (vite-plugin-pwa, manifest, service worker) | ✅ Готово |
| 7.2 | Code splitting, React.lazy() + Suspense на всех страницах | ✅ Готово |
| 8.1 | Анимации: page transitions, list stagger, button ripple, tap-scale | ✅ Готово |
| 8.2-A | Toast-уведомления (in-app) | ✅ Готово |
| 8.3 | Экспорт / Импорт данных (JSON + CSV) | ✅ Готово |
| 8.4 | Оффлайн-режим и синхронизация | ✅ Готово |
| **9.1** | **Расширение тестов (coverage > 80%)** | ✅ |
| **9.2** | **Деплой (Vercel + CI/CD)** | ✅ |
| **10.4** | **Forgot Password / Reset Flow** | ✅ |
| **Б.2** | **Swipe-to-delete в списках** | ✅ |
| **Б.3** | **Pull-to-refresh (Home + Workouts)** | ✅ |
| **13** | **Кнопка «Изменить» на главной (мульти-выбор)** | ⬜ |
| **14** | **Редактирование упражнений в категориях** | ⬜ |
| **15** | **Хостинг и деплой (инструкция)** | ⬜ |
| **16** | **Сборка APK для Android** | ⬜ |
| **17** | **План промтов для дальнейшей разработки** | ⬜ |

---

## 📐 ПРАВИЛА (всегда соблюдать)

- **Один промт = одна фича** — реализовывать полностью, без компромиссов
- **Коммит только после `git commit` от пользователя** — не делать если не подтверждено
- **Цвета через hex** — `bg-[#9333ea]`, не `bg-primary-500`
- **После изменений** — запускать `npx vitest run`, все тесты должны быть зелёными
- **MongoDB backend** — никаких localStorage/Firebase, только `src/services/api.ts`
- **Dark theme** — каждый новый компонент должен поддерживать `dark:` классы

---

## 🔔 Этап 8.2 — Toast-уведомления + Push Notifications

### Цель
Реализовать два уровня уведомлений:
1. **In-app toast** — мгновенный feedback на действия (сохранил, удалил, ошибка)
2. **Push notifications** — напоминания о тренировках через Web Push API

### 8.2-A: Toast-система (in-app)

**Файлы для создания/изменения:**
- `src/components/Toast.tsx` — компонент тостов
- `src/hooks/useToast.ts` — хук для вызова тостов
- `src/contexts/ToastContext.tsx` — глобальный контекст
- `src/App.tsx` — добавить `<ToastContainer />`

**ToastContext.tsx:**
```typescript
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  variant: ToastVariant;
  message: string;
  duration?: number; // мс, default 3000
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void;
  dismissToast: (id: string) => void;
}
```

**Toast.tsx — дизайн:**
- Позиция: фиксированная, bottom-center, выше навигации (`bottom-24`)
- Анимация: slide-up + fade-in при появлении, fade-out при исчезновении
- Цвета:
  - success: `bg-[#22c55e]` + белый текст
  - error: `bg-[#ef4444]` + белый текст
  - warning: `bg-[#f59e0b]` + белый текст
  - info: `bg-[#9333ea]` + белый текст
- Иконки: ✓ / ✕ / ⚠ / ℹ (lucide-react)
- Закрытие: по клику или по `duration`
- Максимум 3 тоста одновременно (старые вытесняются)

**useToast.ts:**
```typescript
export function useToast() {
  const ctx = useContext(ToastContext);
  return {
    success: (msg: string) => ctx.showToast(msg, 'success'),
    error: (msg: string) => ctx.showToast(msg, 'error'),
    warning: (msg: string) => ctx.showToast(msg, 'warning'),
    info: (msg: string) => ctx.showToast(msg, 'info'),
    dismiss: ctx.dismissToast,
  };
}
```

**Где использовать тосты:**
| Действие | Тост |
|----------|------|
| Сохранение тренировки | success «Тренировка сохранена» |
| Удаление тренировки | success «Тренировка удалена» |
| Завершение тренировки | success «Тренировка завершена! 💪» |
| Ошибка API | error «Ошибка. Попробуйте снова» |
| Сохранение упражнения | success «Упражнение добавлено» |
| Копирование ссылки | info «Ссылка скопирована» |

**Тесты:** `src/test/Toast.test.tsx` — рендер, автоисчезновение, клик-закрытие

---

### 8.2-B: Push Notifications (Web Push API)

**Файлы:**
- `src/services/notifications.ts` — логика работы с Push API
- `src/components/NotificationSettings.tsx` — UI настроек в Profile
- `server/routes/notifications.js` — endpoint для VAPID подписки

**Push-уведомления:**
- Запрос разрешения при первом посещении (только после действия пользователя)
- VAPID ключи генерируются один раз, хранятся в `server/.env`
- Подписка сохраняется в MongoDB (модель `PushSubscription`)

**`src/services/notifications.ts`:**
```typescript
// Проверить поддержку Push API
export function isPushSupported(): boolean

// Запросить разрешение
export async function requestPermission(): Promise<NotificationPermission>

// Подписаться на push
export async function subscribePush(): Promise<PushSubscription | null>

// Отписаться
export async function unsubscribePush(): Promise<void>

// Получить текущий статус
export function getNotificationStatus(): 'granted' | 'denied' | 'default'
```

**Типы напоминаний:**
1. **Напоминание о тренировке** — пользователь настраивает время и дни
2. **Мотивационное** — «Уже 3 дня без тренировки!» (если нет активности)

**UI в Profile (раздел «Уведомления»):**
- Toggle «Push уведомления» (просит разрешение при включении)
- Время напоминания (time picker, default 09:00)
- Дни недели (мультиселект)
- «Напомнить через N дней без тренировки» (slider 1-7)

**Backend endpoint (POST /api/notifications/subscribe):**
- Принимает: `{ subscription: PushSubscription, settings: { time, days, inactivityDays } }`
- Сохраняет в MongoDB с userId
- Cron job (node-cron) проверяет и отправляет уведомления

**Критерии завершения:**
- [ ] ToastContext + useToast работают во всём приложении
- [ ] Тосты показываются на всех ключевых действиях
- [ ] Push разрешение запрашивается корректно
- [ ] Подписка сохраняется в MongoDB
- [ ] Настройки уведомлений в Profile
- [ ] Тесты для Toast компонента: `npx vitest run` — все зелёные

---

## 📦 Этап 8.3 — Экспорт и Импорт данных

### Цель
Дать пользователю полный контроль над своими данными: скачать все тренировки, загрузить бэкап, перенести данные.

**Файлы:**
- `src/services/dataExport.ts` — логика экспорта/импорта
- `src/components/ExportImport.tsx` — UI секция в Profile
- `server/routes/export.js` — backend endpoint для экспорта

---

### Экспорт

**Форматы:**
1. **JSON** (полный бэкап) — всё: тренировки, упражнения, программы
2. **CSV** — только завершённые тренировки (для Excel/Google Sheets)
3. **Отдельная тренировка** — JSON или текст для шаринга

**`src/services/dataExport.ts`:**
```typescript
// Экспортировать всё в JSON
export async function exportAllData(): Promise<void>

// Экспортировать тренировки в CSV
export async function exportWorkoutsCSV(dateFrom?: Date, dateTo?: Date): Promise<void>

// Скачать одну тренировку
export async function exportWorkout(workoutId: string, format: 'json' | 'text'): Promise<void>
```

**CSV-формат тренировок:**
```
Date,Workout Name,Duration (min),Total Volume (kg),Total Sets,Exercises
2024-01-15,Грудь и трицепс,65,4500,18,"Bench Press: 4x10@80kg; Dips: 3x12"
```

**JSON-формат (полный бэкап):**
```json
{
  "version": "1.0",
  "exportedAt": "2024-01-15T10:00:00Z",
  "userId": "...",
  "workouts": [...],
  "exercises": [...],
  "programs": [...]
}
```

---

### Импорт

**Валидация:**
- Проверить формат файла (JSON/CSV)
- Проверить версию схемы
- Показать превью: «Найдено 47 тренировок, 12 программ»
- Спросить: «Добавить к существующим» или «Заменить всё»

**UI флоу:**
1. Кнопка «Импорт» → открывается modal
2. Drag & drop или выбор файла
3. Превью найденных данных
4. Подтверждение
5. Toast «Импортировано 47 тренировок»

**Обработка конфликтов:**
- Дублирующиеся тренировки: пропустить (по дате + названию)
- Новые упражнения: добавить автоматически

---

### UI в Profile (секция «Данные»)

```
[📥 Экспорт JSON]   [📊 Экспорт CSV]
[📤 Импорт данных]  [🗑 Очистить всё]
```

- «Очистить всё» — double-confirm, показывает сколько данных будет удалено
- Последний бэкап: «15 янв 2024, 10:00»

**Критерии завершения:**
- [ ] Экспорт JSON скачивает валидный файл
- [ ] Экспорт CSV открывается в Excel без проблем
- [ ] Импорт JSON восстанавливает тренировки
- [ ] Валидация файла с понятными ошибками
- [ ] Double-confirm на «Очистить всё»
- [ ] `npx vitest run` — все тесты зелёные

---

## 📴 Этап 8.4 — Оффлайн-режим и синхронизация

### Цель
Приложение должно работать без интернета и синхронизировать данные при восстановлении соединения.

**Файлы:**
- `src/hooks/useOnlineStatus.ts` — хук детекции
- `src/components/OfflineBanner.tsx` — баннер «Нет соединения»
- `src/services/offlineQueue.ts` — очередь оффлайн-действий
- `src/services/syncService.ts` — синхронизация при восстановлении

---

**`useOnlineStatus.ts`:**
```typescript
export function useOnlineStatus(): {
  isOnline: boolean;
  wasOffline: boolean; // был оффлайн, теперь онлайн
}
```

**OfflineBanner.tsx:**
- Появляется вверху страницы (fixed, над навигацией)
- Цвет: `bg-[#ef4444]`
- Иконка Wifi-off + «Нет соединения. Данные сохраняются локально»
- При восстановлении: заменяется зелёным баннером «Онлайн. Синхронизация...» на 3 сек

**Оффлайн-очередь (`offlineQueue.ts`):**
```typescript
interface QueuedAction {
  id: string;
  type: 'save_workout' | 'delete_workout' | 'save_exercise';
  payload: unknown;
  timestamp: number;
  retries: number;
}
// Хранить очередь в localStorage
// При восстановлении сети — выполнить все действия по очереди
```

**Service Worker (обновить vite-plugin-pwa config):**
- NetworkFirst для API запросов (`/api/*`)
- CacheFirst для статики
- StaleWhileRevalidate для изображений

**Критерии завершения:**
- [ ] Баннер появляется при потере соединения
- [ ] Активная тренировка продолжается оффлайн
- [ ] Сохранённые оффлайн данные синхронизируются при восстановлении
- [ ] Тест: отключить Wi-Fi → завершить тренировку → включить Wi-Fi → данные в MongoDB

---

## 🧪 Этап 9.1 — Расширение тестов

### Цель
Поднять покрытие тестами с текущего уровня до ~80% для критических путей.

**Текущее состояние:** 238 тестов, 29 файлов

**Приоритетные тесты для добавления:**

### A. Toast система
**`src/test/Toast.test.tsx`:**
- [ ] Тост появляется при вызове `showToast`
- [ ] Тост исчезает через `duration` мс
- [ ] Клик по тосту закрывает его
- [ ] Максимум 3 тоста одновременно
- [ ] Каждый variant рендерится с правильным цветом

### B. Экспорт/Импорт
**`src/test/dataExport.test.ts`:**
- [ ] `exportAllData` создаёт валидный JSON
- [ ] `exportWorkoutsCSV` создаёт корректные CSV строки
- [ ] Импорт JSON добавляет тренировки
- [ ] Валидация отклоняет невалидный JSON
- [ ] Обработка дублей при импорте

### D. useOnlineStatus hook
**`src/test/useOnlineStatus.test.ts`:**
- [ ] Корректно отражает `navigator.onLine`
- [ ] Реагирует на `online`/`offline` события
- [ ] `wasOffline` флаг устанавливается правильно

### E. Integration тесты активной тренировки
**`src/test/ActiveWorkout.integration.test.tsx`:**
- [ ] Запуск → выполнение подходов → завершение
- [ ] Таймер отдыха автозапускается
- [ ] Общий тоннаж считается корректно
- [ ] Навигация между упражнениями работает

**После каждого блока тестов:** `npx vitest run` — должно быть зелёно

---

## 🚀 Этап 9.2 — Деплой

### Цель
Развернуть приложение в интернете с CI/CD.

### Frontend — Vercel

**Конфигурация `vercel.json`:**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

**Environment variables в Vercel:**
```
VITE_API_URL=https://your-backend.railway.app
VITE_VAPID_PUBLIC_KEY=...
```

### Backend — Railway.app (рекомендуется) или Render

**`server/Procfile`:**
```
web: node server.js
```

**`server/.env.production`:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong-random-secret-min-32-chars
CORS_ORIGIN=https://your-app.vercel.app
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

**Обновить CORS в `server/server.js`:**
```javascript
cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN 
    : 'http://localhost:5173',
  credentials: true,
})
```

### GitHub Actions CI/CD

**`.github/workflows/ci.yml`:**
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx vitest run
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Чеклист перед деплоем:**
- [ ] `npm run build` — сборка без ошибок
- [ ] `npx vitest run` — все тесты зелёные
- [ ] `VITE_API_URL` указывает на production backend
- [ ] MongoDB Atlas разрешает подключения с IP сервера (0.0.0.0/0 или конкретный IP)
- [ ] JWT_SECRET в production — случайная строка 64+ символов
- [ ] CORS настроен на production domain

**Критерии завершения:**
- [ ] Приложение открывается по HTTPS URL
- [ ] Регистрация и логин работают
- [ ] Создание/сохранение тренировки работает
- [ ] PWA устанавливается на телефон
- [ ] Lighthouse score: Performance > 90, PWA > 90

---

## 🎁 Бонус: Улучшения UX (после деплоя)

### Б.1 — Haptic Feedback ✅
```typescript
// src/utils/haptics.ts
export function hapticLight() {
  if ('vibrate' in navigator) navigator.vibrate(10);
}
export function hapticMedium() {
  if ('vibrate' in navigator) navigator.vibrate(30);
}
export function hapticSuccess() {
  if ('vibrate' in navigator) navigator.vibrate([10, 20, 10]);
}
// Использовать при: complete set, finish workout, PR
```

## 🎱 Б.2 — Swipe-to-delete в списках
- Workouts.tsx: свайп влево → кнопка «Удалить» (уже есть свайп для Stats, добавить Delete)
- Подтверждение через toast вместо confirm()

## 🎴 Б.3 — Pull-to-refresh
```typescript
// src/hooks/usePullToRefresh.ts
// touch-based pull-to-refresh на мобильном
// Показывает spinner при потягивании > 60px
// Вызывает callback при отпускании
```

## 🔔 Б.4 — Rest Timer звук
- Web Audio API для генерации короткого beep
- Без внешних файлов, полностью в браузере:
```typescript
function playBeep(freq = 880, dur = 200) {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  osc.connect(ctx.destination);
  osc.frequency.value = freq;
  osc.start();
  osc.stop(ctx.currentTime + dur / 1000);
}
```


---

## � Приоритеты приложения

> **Фокус:** удобно отслеживать прогресс по тренировкам + легко добавлять упражнения и программы. Без геймификации, без социальных фич.

```
СЛЕДУЮЩИЕ (улучшают основной сценарий):
  Б.2 Swipe-to-delete ✅ → Б.3 Pull-to-refresh ✅ → Б.4 Rest Timer звук ✅

БОНУС (quality of life):
  Дополнительные графики прогресса ✅ → Быстрое логирование из главной ✅
```

---

## 🔮 Этап 11 — Будущие фичи

### 11.1 — OAuth: Google, GitHub, Microsoft

**Цель:** Полноценный вход через внешние провайдеры (сейчас только JWT email/password).

**Backend (server/):**
- Установить `passport`, `passport-google-oauth20`, `passport-github2`, `passport-microsoft`
- Создать `server/config/passport.js` — стратегии для каждого провайдера
- Роуты: `GET /api/auth/google`, `GET /api/auth/google/callback` (и аналогично для github, microsoft)
- Модель User: добавить поля `provider: string`, `providerId: string`, `avatar: string`
- При первом входе через OAuth — создать пользователя автоматически
- При повторном — найти по `provider + providerId` и выдать JWT
- `.env`: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`

**Frontend:**
- Обновить `Login.tsx` и `Register.tsx` — добавить кнопки «Войти через Google/GitHub/Microsoft»
- Дизайн: три кнопки под основной формой, с иконками провайдеров
- При клике — редирект на `${API_URL}/auth/{provider}`
- Callback обрабатывает backend, редиректит на frontend с token в URL параметре
- `src/pages/OAuthCallback.tsx` — новая страница, парсит токен из URL, сохраняет и редиректит на Home
- Роут: `/oauth/callback`

**Критерии:**
- [ ] Кнопки OAuth на страницах Login/Register
- [ ] Google OAuth работает end-to-end
- [ ] GitHub OAuth работает end-to-end
- [ ] Microsoft OAuth работает end-to-end
- [ ] Новый пользователь создаётся при первом входе
- [ ] Повторный вход находит существующего пользователя
- [ ] `npx vitest run` — все тесты зелёные

---

### 11.2 — Магазин упражнений

**Цель:** Пользователь может покупать (разблокировать) дополнительные пакеты упражнений за внутреннюю валюту или реальные деньги.

**Backend:**
- Модель `ExercisePack`:
  ```
  { name, description, price, currency: 'coins' | 'usd', exercises: [...], icon, category }
  ```
- Модель User: добавить `coins: number` (внутренняя валюта), `purchasedPacks: [ObjectId]`
- Роуты:
  - `GET /api/shop/packs` — список доступных паков
  - `POST /api/shop/purchase/:packId` — покупка пака (списывает coins)
  - `GET /api/shop/my-purchases` — купленные паки
- Coins начисляются за завершённые тренировки (например 10 coins за тренировку)
- Дефолтные паки: «Кроссфит» (15 упр.), «Йога» (12 упр.), «Пауэрлифтинг» (10 упр.), «Калистеника» (12 упр.)

**Frontend:**
- `src/pages/Shop.tsx` — магазин с карточками паков
- Дизайн: карточки с иконкой, названием, описанием, ценой, кнопкой «Купить»
- Купленные пакеты помечены ✅, упражнения из них доступны в ExerciseLibrary
- Баланс coins отображается в шапке магазина и на Profile
- Анимация покупки: confetti или pulse-эффект
- Роут: `/shop`
- Навигация: новая иконка в Navigation.tsx (ShoppingBag из lucide-react)

**Критерии:**
- [ ] Страница Shop отображает паки упражнений
- [ ] Покупка списывает coins и разблокирует пак
- [ ] Купленные упражнения появляются в ExerciseLibrary
- [ ] Баланс обновляется после покупки

---

## 🔧 Этап 13 — Кнопка «Изменить» на главной (мульти-выбор)

### Цель
На главной странице добавить кнопку «Изменить» (карандаш или аналог). При нажатии включается режим мульти-выбора упражнений с плавающей панелью действий.

### Реализация

**Режим выбора:**
- Кнопка «Изменить» в шапке / рядом с датой на Home
- При нажатии каждое упражнение получает checkbox слева
- Внизу появляется плавающая панель с действиями

**Действия панели:**
1. **Повтор сегодня** — скопировать выбранные упражнения в сегодняшнюю тренировку (без результатов)
2. **Повтор с результатами** — скопировать с сохранением веса/повторений (для прогрессии)
3. **Сохранить как программу** — создать программу из выбранных упражнений
4. **Добавить комментарий** — добавить заметку к выбранным упражнениям

**Стили:**
- Панель: `fixed bottom-20 left-4 right-4 bg-white dark:bg-[#16213e] rounded-2xl shadow-xl p-4`
- Кнопки действий: иконка + текст, `text-[#9333ea]`
- Выбранные упражнения: `border-[#9333ea] bg-[#f3e8ff]`

**Критерии:**
- [ ] Кнопка «Изменить» на главной
- [ ] Режим мульти-выбора с чекбоксами
- [ ] Все 4 действия реализованы
- [ ] Плавающая панель с анимацией
- [ ] `npx vitest run` — все тесты зелёные

---

## 🔧 Этап 14 — Редактирование упражнений в категориях

### Цель
В разделе библиотеки упражнений / категорий добавить возможность редактирования упражнений.

### Реализация
- Кнопка «Изменить» в списке упражнений по категориям (ExerciseLibrary)
- Режим редактирования: переименовать, удалить, переместить в другую категорию
- Для пользовательских упражнений — полное редактирование
- Для стандартных (seed) — только скрыть/показать

**Критерии:**
- [ ] Кнопка редактирования в категориях
- [ ] Редактирование пользовательских упражнений
- [ ] Скрытие стандартных упражнений
- [ ] `npx vitest run` — все тесты зелёные

---

## 🌐 Этап 15 — Хостинг и деплой (инструкция)

### Цель
Настроить постоянную работу бэкенда и деплой для веба.

### Реализация
- **Бэкенд**: pm2 + VPS или PaaS (Render / Railway / Fly.io)
- **Фронтенд**: Vercel / Netlify (статика)
- **MongoDB**: Atlas (уже используется)
- Конфиг: environment variables, CORS для production домена
- Инструкция: пошаговый гайд по деплою

**Критерии:**
- [x] Бэкенд работает на VPS / PaaS без VS Code
- [x] Фронтенд доступен по URL
- [x] HTTPS настроен
- [x] ENV переменные безопасно хранятся
- [x] Создан DEPLOY.md с пошаговой инструкцией

---

## 📱 Этап 16 — Сборка APK для Android

### Цель
Собрать PWA в APK для установки на Android и (опционально) для Google Play.

### Реализация
- **Вариант 1**: Capacitor — обёртка PWA в нативное приложение
- **Вариант 2**: TWA (Trusted Web Activity) — если уже есть хостинг
- **Вариант 3**: PWABuilder (pwabuilder.com) — автоматическая сборка
- Подписка APK ключом для Google Play
- Инструкция: пошаговый гайд

**Критерии:**
- [x] APK собран и устанавливается на Android
- [x] Приложение работает корректно на телефоне
- [x] (Опционально) готово к публикации в Google Play
- [x] Создан APK.md с пошаговой инструкцией (Capacitor, PWABuilder, TWA)
- [x] Добавлен capacitor.config.ts
- [x] Добавлены npm скрипты build:android, cap:sync, cap:open

---

## 📋 Этап 17 — План промтов для дальнейшей разработки

### Цель
Создать структурированный план промтов для всех оставшихся фич и улучшений.

### Реализация
- Приоритеты: P0 (критично), P1 (важно), P2 (желательно)
- Каждый промт = одна фича, полностью реализуемая за одну сессию
- Группировка по направлениям: UX, backend, PWA, тесты

**Критерии:**
- [ ] Документ с планом промтов создан
- [ ] Каждый промт описан (цель, файлы, критерии)
- [ ] Приоритеты расставлены
- [ ] `npx vitest run` — все тесты зелёные

---

### 11.3 — Always-on: Keep Alive + Background Sync

**Цель:** Приложение всегда активно, не засыпает при блокировке экрана или переключении вкладки (важно для ActiveWorkout и Rest Timer).

**Файлы:**
- `src/hooks/useWakeLock.ts` — Screen Wake Lock API
- `src/hooks/useBackgroundTimer.ts` — корректный таймер при сворачивании
- Обновить `ActiveWorkout.tsx` — использовать wake lock во время тренировки
- Обновить Service Worker — background sync для отложенных действий

**`useWakeLock.ts`:**
```typescript
export function useWakeLock() {
  // Запросить Screen Wake Lock API при монтировании
  // Экран не гаснет пока тренировка активна
  // Освободить lock при размонтировании / завершении тренировки
}
```

**`useBackgroundTimer.ts`:**
```typescript
// Таймер который корректно работает при сворачивании приложения:
// - Запоминает startTime (Date.now())
// - При возврате — вычисляет реальное прошедшее время
// - Не зависит от setInterval (который замедляется в background)
```

**Service Worker обновления:**
- Background Sync API для POST/PUT запросов
- Periodic Background Sync для проверки новых данных (если поддерживается)

**Критерии:**
- [ ] Экран не гаснет во время ActiveWorkout
- [ ] Таймер отдыха корректно работает при сворачивании
- [ ] Общий таймер тренировки корректно работает при сворачивании
- [ ] Wake Lock освобождается при завершении тренировки
- [ ] `npx vitest run` — все тесты зелёные

---

### 11.4 — Редизайн UI

**Цель:** Освежить визуальный стиль приложения, сделать его более современным и приятным.

**Области для улучшения:**
- **Карточки тренировок** — новый стиль с тенями, градиентами, скруглёнными углами
- **Навигация** — floating bottom bar с blur-эффектом (backdrop-blur)
- **Графики** — кастомные tooltip, плавные анимации, gradient fill
- **Шрифты** — подключить Inter или Nunito для более современного вида
- **Иконки** — единый стиль иконок, stroke-width 1.5
- **Цветовая палитра** — обновить оттенки:
  - Primary: `#8b5cf6` → `#7c3aed` (более насыщенный)
  - Background (dark): `#1a1a2e` → `#0f0f23` (более глубокий)
  - Cards (dark): `#16213e` → `#1a1b3e` (чуть теплее)
- **Skeleton loaders** — добавить shimmer-эффект при загрузке данных
- **Микро-анимации** — hover-эффекты, transition на всех интерактивных элементах
- **Empty states** — красивые иллюстрации вместо текста «Нет данных»

**Порядок:**
1. Обновить `tailwind.config.js` — новые цвета и шрифты
2. Обновить `Navigation.tsx` — floating bar с blur
3. Обновить карточки в `Home.tsx`
4. Обновить `Statistics.tsx` — gradient графики
5. Обновить все empty states

**Критерии:**
- [ ] Навигация с backdrop-blur
- [ ] Обновлённые карточки тренировок
- [ ] Skeleton loaders при загрузке
- [ ] Единый стиль анимаций
- [ ] Dark theme обновлена
- [ ] `npx vitest run` — все тесты зелёные

---

## 🔧 Этап 12 — UX-фиксы и улучшения

### 12.1 — Кнопка «Сегодня» в календаре

**Цель:** Если пользователь далеко пролистал календарь, кнопка «Сегодня» справа мгновенно возвращает к текущей дате.

**Реализация:**
- Кнопка появляется справа в шапке календаря (или floating)
- При нажатии — `scrollToToday()`, сброс месяца на текущий
- Стиль: маленькая пилюля `bg-[#9333ea] text-white rounded-full px-3 py-1 text-xs`

---

### 12.2 — Переработка логики упражнений

**Цель:** Упростить создание и работу с упражнениями. Убрать лишнее.

**12.2-A: Упражнение не нужно "завершать"**
- Убрать кнопку / механику «выполнено» с упражнения
- Статистика обновляется автоматически при записи подхода

**12.2-B: Убрать кнопку "Редактировать упражнение"**
- Удалить кнопку edit из списка упражнений / карточки

**12.2-C: Упростить создание упражнения**
- Поля: только **название** + **день недели**
- Настройки:
  - Toggle **«Двойной вес»** — если используются 2 снаряда (2 гантели), вес автоматически ×2 в статистике
  - Toggle **«Собственный вес»** — для подтягиваний, отжиманий и т.п. (поле веса ≡ доп. отягощение или 0)
- Убрать всё остальное (категория, тип, muscle group) из формы создания

**12.2-D: Статистика под двойной/собственный вес**
- Если упражнение «двойной вес» — в статистике показывать реальный суммарный вес (×2)
- Если «собственный вес» — показывать отдельно (с пометкой «+ доп. вес» если есть)

**12.2-E: Кнопка «Добавить подход» ярче**
- Цвет кнопки: `bg-[#9333ea] text-white` вместо бледного/outline

---

### 12.3 — Стрелка назад и название на одной высоте (ActiveWorkout)

**Цель:** Во всех экранах активного упражнения стрелка «←» и название упражнения должны быть на одной горизонтальной линии (flex items-center).

---

### 12.4 — Подсветка последнего подхода в статистике

**Цель:** В статистике упражнения последний записанный подход подсвечивается + коротко пишется что изменилось.

**Реализация:**
- Последний подход выделен цветом / рамкой
- Рядом мини-текст: `+5 кг` или `+2 повт.` или `= прежний` — по сравнению с предыдущим
- Минималистичный стиль, без перегруза

---

### 12.5 — Убрать импорт/экспорт из профиля

**Цель:** Удалить секцию `ExportImportSection` из `Profile.tsx`.

---

### 12.6 — Иконка профиля → три точки

**Цель:** Изменить иконку кнопки перехода в профиль с текущей на три точки (⋯ / `MoreHorizontal` из lucide-react или SVG).

---

**Критерии для всего этапа 12:**
- [ ] Кнопка «Сегодня» на календаре
- [ ] Упрощённое создание упражнений (название + день + toggles)
- [ ] Статистика учитывает двойной / собственный вес
- [ ] Яркая кнопка «Добавить подход»
- [ ] Стрелка и название на одной высоте
- [ ] Подсветка последнего подхода в статистике
- [ ] Импорт/экспорт убран из профиля
- [ ] Иконка профиля = три точки
- [ ] `npx vitest run` — все тесты зелёные
