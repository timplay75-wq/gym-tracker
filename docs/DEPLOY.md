# 🚀 Деплой Gym Tracker

## Архитектура

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│     Vercel       │────▶│     Railway      │────▶│  MongoDB Atlas   │
│   (фронтенд)    │     │  (бэкенд API)     │     │  (база данных)   │
│   React SPA      │     │  Express + Node   │     │  уже настроена   │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## 1. База данных — MongoDB Atlas (уже готова ✅)

Ваш кластер уже работает. Убедитесь:
- IP-доступ: `Network Access → 0.0.0.0/0` (разрешить хостинг-провайдерам)
- URI вида: `mongodb+srv://user:pass@cluster.mongodb.net/gym-tracker`

---

## 2. Бэкенд — Railway (бесплатно, $5 кредит/мес)

> Репозиторий уже на GitHub: `https://github.com/timplay75-wq/gym-tracker.git`
> Railway НЕ засыпает (в отличие от Render) — сервер всегда онлайн.

### Шаг 1: Регистрация на Railway

1. Открыть https://railway.app
2. **Login** → **Login with GitHub**
3. Разрешить доступ к репозиториям

### Шаг 2: Создание проекта

1. На дашборде нажать **New Project**
2. Выбрать **Deploy from GitHub repo**
3. Найти `timplay75-wq/gym-tracker` → выбрать
4. Railway спросит "Do you want to deploy?" → **пока НЕ нажимать Deploy**
5. Нажать на появившийся сервис → **Settings**

### Шаг 3: Настройки сервиса

В разделе **Settings** → **General**:

| Поле | Значение |
|---|---|
| **Root Directory** | `/server` |
| **Start Command** | `node server.js` |

В разделе **Settings** → **Networking**:
1. Нажать **Generate Domain** — Railway даст URL вида `gym-tracker-api-production-xxxx.up.railway.app`
2. **Запомнить этот URL** — он понадобится дальше

### Шаг 4: Переменные окружения

Перейти во вкладку **Variables** → добавить каждую (кнопка **+ New Variable**):

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://timplay75_db_user:5913TimPlay@cluster0.tut0gpp.mongodb.net/gym-tracker` |
| `JWT_SECRET` | *(скопировать из server/.env — длинная строка)* |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `*` *(временно, обновим после деплоя фронта)* |
| `BACKEND_URL` | *(URL из шага 3, вида https://xxx.up.railway.app)* |
| `FRONTEND_URL` | `https://gym-tracker.vercel.app` |

Railway автоматически задеплоит после добавления переменных.

### Шаг 5: Проверить деплой

- Подождать 1-2 минуты, пока статус станет **Active** (зелёная точка)
- Открыть ваш Railway URL в браузере
- Должно показать: `{"message":"Gym Tracker API работает!"}`
- Проверить также `/health`: `{"status":"ok"}`

> ✅ Railway не засыпает — UptimeRobot не нужен!

---

## 3. Фронтенд — Vercel (бесплатно)

### Шаг 6: Регистрация на Vercel

1. Открыть https://vercel.com
2. **Sign Up** → **Continue with GitHub**
3. Разрешить доступ к репозиториям

### Шаг 7: Создание проекта

1. На дашборде нажать **Add New...** → **Project**
2. Найти `timplay75-wq/gym-tracker` → нажать **Import**
3. Заполнить:

| Поле | Значение |
|---|---|
| Project Name | `gym-tracker` |
| Framework Preset | `Vite` |
| Root Directory | `.` (оставить пустым — корень) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. Раскрыть **Environment Variables** и добавить:

| Key | Value |
|---|---|
| `VITE_API_URL` | *(ваш Railway URL + /api, вида https://xxx.up.railway.app/api)* |

> ⚠️ Переменная **обязательно** с префиксом `VITE_` — иначе Vite её игнорирует

5. Нажать **Deploy**
6. Подождать 1-2 минуты → получите URL вида `https://gym-tracker.vercel.app`

---

## 4. Связать фронт и бэк

### Шаг 8: Обновить CORS на Railway

1. Вернуться на https://railway.app → ваш проект
2. Открыть сервис → **Variables**
3. Изменить переменные:

| Key | Старое значение | Новое значение |
|---|---|---|
| `CORS_ORIGIN` | `*` | `https://gym-tracker.vercel.app` |
| `FRONTEND_URL` | `https://gym-tracker.vercel.app` | *(подтвердить что правильный URL)* |

4. Railway автоматически передеплоится

### Проверка: всё должно работать

| URL | Ожидаемый результат |
|---|---|
| *(Railway URL)* | `{"message":"Gym Tracker API работает!"}` |
| *(Railway URL)/health* | `{"status":"ok"}` |
| `https://gym-tracker.vercel.app` | Открывается приложение |
| Регистрация в приложении | Создаётся аккаунт, данные в MongoDB Atlas |

---

## 5. Свой домен (если купил)

### Шаг 9: Привязка домена

**Фронтенд (Vercel):**
1. Vercel → проект → **Settings → Domains → Add**
2. Ввести `gymtracker.ru` (или ваш домен)
3. Vercel покажет нужные DNS-записи
4. На Рег.ру → DNS → добавить:
   - `A` запись `@` → `76.76.21.21`
   - `CNAME` запись `www` → `cname.vercel-dns.com`

**Бэкенд (Railway):**
1. Railway → сервис → **Settings → Networking → Custom Domain**
2. Ввести `api.gymtracker.ru`
3. Railway покажет CNAME-запись
4. На Рег.ру → DNS → добавить:
   - `CNAME` запись `api` → *(значение из Railway)*

**Обновить env после привязки:**

| Где | Key | Новое значение |
|---|---|---|
| Vercel | `VITE_API_URL` | `https://api.gymtracker.ru/api` |
| Railway | `CORS_ORIGIN` | `https://gymtracker.ru` |
| Railway | `FRONTEND_URL` | `https://gymtracker.ru` |
| Railway | `BACKEND_URL` | `https://api.gymtracker.ru` |

---

## 6. HTTPS

✅ Vercel и Railway автоматически настраивают HTTPS (Let's Encrypt).

Никаких дополнительных действий не нужно.

---

## 7. Альтернативы

### Бэкенд

| Платформа | Бесплатно | Авто-деплой | Сон |
|---|---|---|---|
| **Railway** ⭐ | $5 кредит/мес | ✅ | Нет |
| **Render** | ✅ | ✅ | 15 мин (засыпает) |
| **Fly.io** | 3 VM | ✅ | Нет |
| **Koyeb** | 1 сервис | ✅ | Нет |
| **VPS (Hetzner)** | €3.79/мес | ❌ (pm2) | Нет |

### Фронтенд

| Платформа | Бесплатно | Авто-деплой | CDN |
|---|---|---|---|
| **Vercel** | ✅ | ✅ | ✅ |
| **Netlify** | ✅ | ✅ | ✅ |
| **Cloudflare Pages** | ✅ | ✅ | ✅ |

---

## 8. VPS вариант (для продвинутых)

Если хотите полный контроль (например Hetzner VPS):

```bash
# На сервере
sudo apt update && sudo apt install -y nodejs npm nginx certbot
npm install -g pm2

# Клонировать проект
git clone https://github.com/YOUR_USER/gym-tracker.git
cd gym-tracker/server
npm install

# Создать .env
cp .env.example .env
nano .env  # заполнить реальные значения

# Запуск через pm2
pm2 start server.js --name gym-api
pm2 save
pm2 startup

# Nginx (reverse proxy)
sudo nano /etc/nginx/sites-available/gym-api
```

Конфиг Nginx:

```nginx
server {
    listen 80;
    server_name api.gym.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/gym-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d api.gym.yourdomain.com
```

---

## 8. Чеклист деплоя

- [ ] MongoDB Atlas: IP `0.0.0.0/0` разрешён
- [ ] Бэкенд задеплоен (Render/Railway/VPS)
- [ ] API отвечает: `https://your-api.com/` → `{"message":"Gym Tracker API работает!"}`
- [ ] Фронтенд задеплоен (Vercel/Netlify)
- [ ] `VITE_API_URL` указывает на боевой бэкенд
- [ ] `CORS_ORIGIN` на бэкенде указывает на боевой фронтенд
- [ ] HTTPS работает (автоматически на PaaS)
- [ ] Регистрация/логин работают
- [ ] Тренировки создаются и сохраняются
- [ ] PWA устанавливается с боевого URL
