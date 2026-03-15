# 🚀 Деплой Gym Tracker

## Архитектура

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Vercel/Netlify │────▶│  Render/Railway   │────▶│  MongoDB Atlas   │
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

## 2. Бэкенд — Render (бесплатно)

### Шаг 1: Подготовка репозитория

Залить проект на GitHub (если ещё нет):

```bash
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/YOUR_USER/gym-tracker.git
git push -u origin main
```

### Шаг 2: Создание сервиса на Render

1. Зайти на https://render.com → Sign Up (через GitHub)
2. **New → Web Service**
3. Подключить репозиторий `gym-tracker`
4. Настройки:
   - **Name**: `gym-tracker-api`
   - **Region**: Frankfurt (EU) — ближе к серверу Atlas
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

### Шаг 3: Переменные окружения

В Render → Environment → добавить:

| Переменная | Значение |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render по умолчанию) |
| `MONGODB_URI` | `mongodb+srv://...` (ваш URI из Atlas) |
| `JWT_SECRET` | Сгенерировать: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `https://gym-tracker-xxx.vercel.app` (URL фронта, заполнить позже) |
| `BACKEND_URL` | `https://gym-tracker-api.onrender.com` |
| `FRONTEND_URL` | `https://gym-tracker-xxx.vercel.app` (заполнить позже) |

> ⚠️ Render Free засыпает через 15 мин без запросов. Первый запрос после сна — ~30с. Для работы без задержек — план Starter ($7/мес).

### Шаг 4: Деплой

Render автоматически делает деплой при каждом push в `main`. После деплоя проверить:

```
https://gym-tracker-api.onrender.com/
→ { "message": "Gym Tracker API работает!" }
```

---

## 3. Фронтенд — Vercel (бесплатно)

### Шаг 1: Создание проекта

1. Зайти на https://vercel.com → Sign Up (через GitHub)
2. **Import Project** → выбрать `gym-tracker`
3. Настройки:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (корень)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Шаг 2: Переменные окружения

В Vercel → Settings → Environment Variables:

| Переменная | Значение |
|---|---|
| `VITE_API_URL` | `https://gym-tracker-api.onrender.com/api` |

> ⚠️ Переменные Vite должны начинаться с `VITE_`

### Шаг 3: Деплой

Vercel автоматически собирает при push в `main`. После деплоя:

```
https://gym-tracker-xxx.vercel.app
```

### Шаг 4: Обновить CORS

Вернуться в Render → Environment → обновить:
- `CORS_ORIGIN` = `https://gym-tracker-xxx.vercel.app`
- `FRONTEND_URL` = `https://gym-tracker-xxx.vercel.app`

Передеплоить бэкенд (Manual Deploy → Deploy latest commit).

---

## 4. Свой домен (опционально)

### На Vercel:
1. Settings → Domains → Add Domain
2. Добавить `gym.yourdomain.com`
3. Настроить DNS: CNAME на `cname.vercel-dns.com`

### На Render:
1. Settings → Custom Domains → Add Custom Domain
2. Добавить `api.gym.yourdomain.com`
3. Настроить DNS: CNAME на `gym-tracker-api.onrender.com`

### Обновить после привязки домена:
- Vercel: `VITE_API_URL` = `https://api.gym.yourdomain.com/api`
- Render: `CORS_ORIGIN` = `https://gym.yourdomain.com`

---

## 5. HTTPS

✅ Vercel и Render автоматически настраивают HTTPS (Let's Encrypt).

Никаких дополнительных действий не нужно.

---

## 6. Альтернативы

### Бэкенд

| Платформа | Бесплатно | Авто-деплой | Сон |
|---|---|---|---|
| **Render** | ✅ | ✅ | 15 мин |
| **Railway** | 500ч/мес | ✅ | Нет |
| **Fly.io** | 3 VM | ✅ | Нет |
| **VPS (Hetzner)** | €3.79/мес | ❌ (pm2) | Нет |

### Фронтенд

| Платформа | Бесплатно | Авто-деплой | CDN |
|---|---|---|---|
| **Vercel** | ✅ | ✅ | ✅ |
| **Netlify** | ✅ | ✅ | ✅ |
| **Cloudflare Pages** | ✅ | ✅ | ✅ |

---

## 7. VPS вариант (для продвинутых)

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
