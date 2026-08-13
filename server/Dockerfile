# Бэкенд gym-tracker.
# Build context — каталог server/, поэтому фронтенд в образ не попадает.
FROM node:24-alpine

WORKDIR /app

# Манифесты копируем отдельно: слой с зависимостями переиспользуется,
# пока package-lock.json не менялся.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
# Код читает process.env.PORT; 8080 — то, что ожидают Northflank и Render.
ENV PORT=8080
EXPOSE 8080

# Образ node:alpine содержит непривилегированного пользователя node
USER node

CMD ["node", "server.js"]
