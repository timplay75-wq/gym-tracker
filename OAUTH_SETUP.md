# Настройка OAuth (Google, GitHub, Microsoft)

Пошаговый гайд по настройке входа через внешние аккаунты.

---

## 0. Подготовка

1. Скопируй файл `server/.env.example` → `server/.env`
2. Заполни `MONGODB_URI` и `JWT_SECRET` (если ещё не сделано)
3. Убедись, что в `.env` указаны URL-ы:

```env
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

> При деплое замени `localhost` на реальные домены.

---

## 1. Google

### Шаг 1 — Создай проект

1. Открой **[Google Cloud Console](https://console.cloud.google.com/)**
2. Вверху нажми **Select a project** → **New Project**
3. Назови проект (например `Gym Tracker`) → **Create**

### Шаг 2 — Настрой OAuth consent screen

1. В левом меню: **APIs & Services** → **OAuth consent screen**
2. Выбери **External** → **Create**
3. Заполни:
   - **App name**: `Gym Tracker`
   - **User support email**: твой email
   - **Developer contact**: твой email
4. Нажми **Save and Continue**
5. На странице **Scopes** нажми **Add or Remove Scopes**, выбери:
   - `openid`
   - `email`
   - `profile`
6. **Save and Continue** → **Save and Continue** → **Back to Dashboard**

### Шаг 3 — Создай учётные данные

1. **APIs & Services** → **Credentials** → **+ Create Credentials** → **OAuth client ID**
2. **Application type**: `Web application`
3. **Name**: `Gym Tracker Web`
4. **Authorized redirect URIs** — добавь:
   ```
   http://localhost:5000/api/oauth/google/callback
   ```
5. Нажми **Create**
6. Скопируй **Client ID** и **Client Secret**

### Шаг 4 — Добавь в .env

```env
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
```

---

## 2. GitHub

### Шаг 1 — Создай OAuth App

1. Открой **[GitHub Developer Settings](https://github.com/settings/developers)**
2. Нажми **OAuth Apps** → **New OAuth App**
3. Заполни:
   - **Application name**: `Gym Tracker`
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**:
     ```
     http://localhost:5000/api/oauth/github/callback
     ```
4. Нажми **Register application**

### Шаг 2 — Получи ключи

1. На странице приложения скопируй **Client ID**
2. Нажми **Generate a new client secret** → скопируй секрет

### Шаг 3 — Добавь в .env

```env
GITHUB_CLIENT_ID=Iv1.xxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx
```

---

## 3. Microsoft

### Шаг 1 — Зарегистрируй приложение

1. Открой **[Azure Portal — App registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)**
2. Нажми **+ New registration**
3. Заполни:
   - **Name**: `Gym Tracker`
   - **Supported account types**: выбери **Accounts in any organizational directory and personal Microsoft accounts**
   - **Redirect URI**:
     - Platform: `Web`
     - URI: `http://localhost:5000/api/oauth/microsoft/callback`
4. Нажми **Register**

### Шаг 2 — Получи Client ID

1. На странице Overview скопируй **Application (client) ID**
2. **Tenant ID** оставь `common` (если хочешь любые MS-аккаунты)

### Шаг 3 — Создай Client Secret

1. В левом меню: **Certificates & secrets** → **+ New client secret**
2. Description: `gym-tracker`, Expires: `24 months`
3. Нажми **Add** → скопируй **Value** (это Client Secret)

> ⚠️ Секрет показывается только один раз! Сохрани его сразу.

### Шаг 4 — Добавь в .env

```env
MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MICROSOFT_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MICROSOFT_TENANT_ID=common
```

---

## 4. Проверка

1. Запусти backend:
   ```bash
   cd server
   npm run dev
   ```

2. Проверь, что провайдеры видны:
   ```
   GET http://localhost:5000/api/oauth/providers
   ```
   Ответ:
   ```json
   { "google": true, "github": true, "microsoft": true }
   ```

3. Запусти frontend:
   ```bash
   npm run dev
   ```

4. Открой `http://localhost:5173/login` — под формой входа появятся кнопки:
   - **Войти через Google**
   - **Войти через GitHub**
   - **Войти через Microsoft**

5. Нажми любую кнопку → откроется popup → авторизуйся → popup закроется → ты залогинен!

---

## 5. Деплой (продакшн)

При деплое нужно:

1. Обновить `BACKEND_URL` и `FRONTEND_URL` в `.env` на реальные домены
2. Добавить реальные callback URL в каждом провайдере:
   - Google: `https://api.yourdomain.com/api/oauth/google/callback`
   - GitHub: `https://api.yourdomain.com/api/oauth/github/callback`
   - Microsoft: `https://api.yourdomain.com/api/oauth/microsoft/callback`
3. В Google Cloud Console: опубликовать OAuth consent screen (иначе лимит 100 тестовых юзеров)

---

## FAQ

**Q: Можно настроить только одного провайдера?**
A: Да. Кнопки отображаются для всех трёх, но ненастроенный провайдер просто вернёт ошибку. Если `GOOGLE_CLIENT_ID` пуст — Google OAuth не будет работать, но GitHub и Microsoft будут.

**Q: Что если у пользователя уже есть аккаунт с email/паролем?**
A: OAuth автоматически привяжется к существующему аккаунту по email. Пользователь сможет входить как через пароль, так и через OAuth.

**Q: Нужно ли устанавливать дополнительные npm-пакеты?**
A: Нет. OAuth реализован через прямые HTTP-запросы к API провайдеров (без passport.js и других зависимостей).
