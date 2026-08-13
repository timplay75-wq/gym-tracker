# 📱 Сборка APK для Android

## Выбор метода

| Метод | Когда использовать |
|---|---|
| **Capacitor** (этот гайд) | Хочешь установить APK локально без хостинга |
| **PWABuilder** | Уже есть задеплоенный сайт (HTTPS) |
| **TWA** | Для Google Play + есть задеплоенный сайт |

---

## Метод 1 — Capacitor (установка APK без хостинга)

### Требования

- **Android Studio** — https://developer.android.com/studio
- **Java JDK 17+** — устанавливается вместе с Android Studio
- **Node.js** (уже установлен)

### Шаг 1 — Установка Android Studio

1. Скачай с https://developer.android.com/studio
2. Установи → при установке отметь:
   - ✅ Android SDK
   - ✅ Android Virtual Device (AVD)
3. После запуска: **SDK Manager** → убедись что установлен **Android 13 (API 33)** или выше

### Шаг 2 — Установка Capacitor

```bash
# В корне проекта (gym-tracker)
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/splash-screen @capacitor/status-bar
```

### Шаг 3 — Инициализация (только первый раз)

```bash
npx cap init "Gym Tracker" "com.gymtracker.app" --web-dir dist
```

### Шаг 4 — Собрать фронтенд и добавить Android платформу

```bash
# Собрать React приложение
npm run build

# Добавить Android проект (только первый раз)
npx cap add android

# Синхронизировать файлы
npx cap sync android
```

### Шаг 5 — Открыть в Android Studio

```bash
npx cap open android
```

Откроется Android Studio с проектом. Подожди пока Gradle синхронизируется (2-5 минут).

### Шаг 6 — Собрать APK

В Android Studio:

1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Ждёшь 1-3 минуты
3. Нажми **locate** в уведомлении снизу
4. Файл будет в: `android/app/build/outputs/apk/debug/app-debug.apk`

### Шаг 7 — Установить на телефон

1. Скопируй `app-debug.apk` на телефон (через USB или облако)
2. На телефоне: **Настройки → Безопасность → Неизвестные источники** → включить
3. Открой файл APK → **Установить**

---

## Метод 2 — PWABuilder (после деплоя на Vercel)

Когда сайт задеплоен по HTTPS:

1. Открой https://www.pwabuilder.com
2. Введи URL твоего сайта (например `https://gym-tracker-xxx.vercel.app`)
3. Нажми **Start** → **Package for stores**  
4. Выбери **Android** → **Generate Package**
5. Скачай APK/AAB

---

## Метод 3 — TWA для Google Play

> Требует: HTTPS домен + `assetlinks.json`

### Шаг 1 — Создать `assetlinks.json`

Файл должен быть доступен по адресу:
```
https://твой-домен.com/.well-known/assetlinks.json
```

### Шаг 2 — Через Bubblewrap (Google инструмент)

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://твой-домен.com/manifest.json
bubblewrap build
```

---

## Обновление приложения

При изменениях в коде:

```bash
npm run build        # пересобрать фронтенд
npx cap sync android # синхронизировать с Android проектом
# Открыть Android Studio → Build → Build APK
```

Или одной командой:

```bash
npm run build:android
```

---

## Подпись APK для Google Play

> Нужно только для публикации в Play Market

```bash
# Сгенерировать keystore (один раз)
keytool -genkey -v -keystore gym-tracker.keystore -alias gym-tracker -keyalg RSA -keysize 2048 -validity 10000
```

В Android Studio: **Build → Generate Signed Bundle/APK** → выбери keystore → **Release**

---

## Чеклист

- [ ] Android Studio установлен
- [ ] `npm install @capacitor/core @capacitor/cli @capacitor/android` выполнен
- [ ] `npx cap add android` выполнен
- [ ] `npm run build && npx cap sync android` выполнен
- [ ] APK собран в Android Studio
- [ ] APK устанавливается на телефон
- [ ] Приложение работает корректно
