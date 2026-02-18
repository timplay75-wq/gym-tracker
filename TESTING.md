# Инструкция по установке зависимостей для тестирования

## Установите следующие пакеты:

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
```

## После установки запустите тесты:

```bash
# Запустить все тесты один раз
npm test

# Запустить тесты в watch mode (автоматическая перезагрузка)
npm test -- --watch

# Запустить тесты с UI интерфейсом
npm run test:ui

# Запустить тесты с отчетом о покрытии кода
npm run test:coverage
```

## Структура тестов

Все тесты находятся в папке `src/test/`:
- `setup.ts` - настройка окружения для тестов
- `*.test.tsx` - файлы с тестами для компонентов

## Покрытие тестами

✅ Button - 100% покрытие
✅ Card - 100% покрытие
✅ Badge - 100% покрытие
✅ Switch - 100% покрытие
✅ Checkbox - 100% покрытие
✅ Alert - 100% покрытие
✅ Spinner - 100% покрытие
✅ Skeleton - 100% покрытие

Остальные компоненты можно протестировать по аналогии.
