# 💪 Анатомические Иконки Мышц

Эта папка содержит детализированные SVG/PNG иконки отдельных мышечных групп для визуализации упражнений.

## 📥 Где скачать анатомические иконки

### 🎨 **Flaticon** (Рекомендуется)
**Ссылка:** https://www.flaticon.com/search?word=muscle+anatomy

**Преимущества:**
- Бесплатные SVG/PNG файлы
- Высокое качество
- Единый стиль иконок
- Прозрачный фон

**Поиск:**
1. `muscle anatomy icon`
2. `trapezius muscle`
3. `latissimus dorsi`
4. `biceps icon`
5. `chest muscle anatomy`

**Рекомендуемые паки:**
- "Human Muscle Anatomy" by Freepik
- "Bodybuilding Icons" by Eucalyp
- "Fitness Muscle Icons" by Smashicons

---

### 🎯 **Freepik** 
**Ссылка:** https://www.freepik.com/search?format=search&query=muscle+anatomy+icon

**Что искать:**
- `muscle anatomy vector`
- `bodybuilding muscle illustration`
- `anatomical muscle diagram`

---

### 🏋️ **Специализированные ресурсы**

#### **1. Noun Project**
**Ссылка:** https://thenounproject.com/search/icons/?q=muscle

**Поиск:**
- `trapezius`, `latissimus`, `deltoid`, `pectoralis`
- Бесплатно с атрибуцией или $3.99/мес за Pro

#### **2. Iconfinder**
**Ссылка:** https://www.iconfinder.com/search?q=muscle+anatomy

**Фильтры:**
- Free icons ✅
- SVG format ✅
- Transparent background ✅

#### **3. SVG Repo**
**Ссылка:** https://www.svgrepo.com/vectors/muscle/

**Преимущества:**
- 100% бесплатно
- Только SVG
- Не требует регистрации

---

## 📁 Структура папок

```
public/icons/muscles/
├── chest/
│   ├── pectoralis-major.svg
│   ├── pectoralis-minor.svg
│   ├── upper-chest.svg
│   └── lower-chest.svg
│
├── back/
│   ├── latissimus-dorsi.svg
│   ├── trapezius-upper.svg
│   ├── trapezius-middle.svg
│   ├── trapezius-lower.svg
│   ├── rhomboids.svg
│   ├── erector-spinae.svg
│   └── teres-major.svg
│
├── shoulders/
│   ├── deltoid-anterior.svg
│   ├── deltoid-lateral.svg
│   ├── deltoid-posterior.svg
│   └── rotator-cuff.svg
│
├── arms/
│   ├── biceps-brachii.svg
│   ├── triceps-brachii.svg
│   ├── brachialis.svg
│   ├── forearm-flexors.svg
│   └── forearm-extensors.svg
│
├── legs/
│   ├── quadriceps.svg
│   ├── hamstrings.svg
│   ├── gluteus-maximus.svg
│   ├── gluteus-medius.svg
│   ├── calves-gastrocnemius.svg
│   └── calves-soleus.svg
│
├── core/
│   ├── rectus-abdominis.svg
│   ├── obliques-external.svg
│   ├── obliques-internal.svg
│   ├── transverse-abdominis.svg
│   └── serratus-anterior.svg
│
└── full-body/
    ├── front-view.svg
    ├── back-view.svg
    └── side-view.svg
```

---

## 🎨 Рекомендуемый стиль

- **Формат:** SVG (масштабируется без потери качества)
- **Цвета:** Монохромные (легко перекрашивать через CSS)
- **Размер:** 24x24, 48x48, 64x64 пикселей
- **Фон:** Прозрачный
- **Стиль:** Линейные иконки или filled icons (выбрать один стиль для всех)

---

## 🔍 Точные поисковые запросы

### Для каждой группы мышц:

**Грудь:**
- `pectoralis major icon`
- `chest muscle anatomy svg`

**Спина:**
- `trapezius muscle icon`
- `latissimus dorsi svg`
- `rhomboid muscle icon`
- `scapula anatomy icon` (лопатки!)

**Плечи:**
- `deltoid muscle icon`
- `anterior deltoid svg`
- `rotator cuff icon`

**Ноги:**
- `quadriceps muscle icon`
- `hamstring muscle svg`
- `gluteus maximus icon`
- `calf muscle gastrocnemius`

**Пресс:**
- `rectus abdominis icon`
- `oblique muscles svg`
- `core muscles icon`

**Руки:**
- `biceps brachii icon`
- `triceps muscle svg`
- `forearm muscles icon`

---

## 📦 Готовые наборы (Рекомендую!)

### **1. Muscle & Fitness Icon Pack**
**Flaticon Pack:** https://www.flaticon.com/packs/muscle-and-fitness
- 50+ иконок мышц
- Единый стиль
- SVG + PNG

### **2. Anatomy Icons Collection**
**Freepik Collection:** https://www.freepik.com/free-vector/human-muscle-collection_4015571.htm
- Полный набор анатомии
- Векторные файлы

### **3. Bodybuilding Icons**
**Iconfinder Pack:** https://www.iconfinder.com/iconsets/bodybuilding-6
- 30 иконок упражнений + мышцы

---

## 🛠️ После скачивания

1. **Переименовать файлы:**
   ```
   muscle-icon-chest-01.svg → pectoralis-major.svg
   ```

2. **Оптимизировать SVG:**
   - Используй https://jakearchibald.github.io/svgomg/
   - Убери лишние метаданные
   - Уменьши размер файлов

3. **Проверь прозрачность:**
   - Открой в браузере на темном фоне
   - Убедись, что нет белых квадратов

---

## 💡 Использование в коде

```tsx
// Импорт через props
<ExerciseIcon 
  imageUrl="/icons/muscles/back/trapezius-upper.svg"
  alt="Верхняя трапеция"
  size="lg"
/>

// Или напрямую
<img 
  src="/icons/muscles/chest/pectoralis-major.svg" 
  alt="Большая грудная мышца"
  className="w-12 h-12"
/>
```

---

## 📝 Атрибуция (если требуется)

Если используешь бесплатные иконки, добавь в `src/pages/About.tsx`:

```tsx
<p className="text-sm text-gray-500">
  Icons by <a href="https://www.flaticon.com">Flaticon</a>,
  <a href="https://www.freepik.com">Freepik</a>,
  and <a href="https://thenounproject.com">Noun Project</a>
</p>
```

---

## 🎯 Быстрый старт (5 минут)

1. Иди на https://www.flaticon.com/search?word=muscle+anatomy
2. Найди "Muscle Anatomy Icon Pack"
3. Скачай в формате SVG
4. Распакуй в папки по группам мышц
5. Используй в компонентах!

**Готово!** Теперь у тебя детализированные анатомические иконки! 🎉
