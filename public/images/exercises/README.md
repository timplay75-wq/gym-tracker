# Папка для изображений упражнений

Здесь хранятся изображения для различных категорий упражнений.

## Структура

```
exercises/
├── chest/          # Упражнения на грудь
├── back/           # Упражнения на спину
├── legs/           # Упражнения на ноги
├── shoulders/      # Упражнения на плечи
├── arms/           # Упражнения на руки
├── core/           # Упражнения на пресс
└── cardio/         # Кардио упражнения
```

## Рекомендации

- **Формат**: WebP, PNG или GIF (для анимаций)
- **Размер**: 400x400px для иконок, 800x600px для детальных изображений
- **Именование**: `exercise-name.gif` или `exercise-name.webp`

## Где взять изображения?

1. **Бесплатные источники:**
   - https://unsplash.com/
   - https://pexels.com/
   - https://musclewiki.com/

2. **Создайте свои:**
   - Сфотографируйте правильную технику
   - Используйте видео и конвертируйте в GIF

## Пример использования

```tsx
import { ExerciseIcon } from '@/components/ExerciseIcon';

<ExerciseIcon 
  imageUrl="/images/exercises/chest/bench-press.gif"
  size="lg"
  alt="Bench Press"
/>
```

Смотрите [ASSETS_GUIDE.md](../../ASSETS_GUIDE.md) для подробной информации.
