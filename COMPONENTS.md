# UI Components Library

Полная библиотека переиспользуемых UI компонентов для Gym Tracker PWA.

## 📦 Установка зависимостей для тестирования

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
```

## 🧪 Запуск тестов

```bash
# Запустить тесты один раз
npm test

# Запустить тесты в watch mode
npm test -- --watch

# Запустить тесты с UI
npm run test:ui

# Запустить тесты с покрытием
npm run test:coverage
```

## 🎨 Компоненты

### 1. Button
Универсальная кнопка с поддержкой вариантов, размеров, загрузки и иконок.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `disabled`: boolean
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean

**Пример использования:**
```tsx
import { Button } from '@/components';

<Button variant="primary" size="md" icon={<Icon />}>
  Начать тренировку
</Button>
```

---

### 2. Card
Адаптивная карточка с различными вариантами и отступами.

**Props:**
- `variant`: 'default' | 'elevated' | 'glass' | 'interactive'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `onClick`: () => void

**Пример использования:**
```tsx
import { Card } from '@/components';

<Card variant="elevated" padding="lg">
  <h3>Заголовок</h3>
  <p>Контент карточки</p>
</Card>
```

---

### 3. Input
Текстовое поле ввода с поддержкой валидации и иконок.

**Props:**
- `label`: string
- `error`: string
- `success`: string
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'
- Все стандартные HTML input props

**Пример использования:**
```tsx
import { Input } from '@/components';

<Input
  label="Название тренировки"
  placeholder="Грудь и трицепс"
  error="Обязательное поле"
/>
```

---

### 4. Textarea
Многострочное текстовое поле.

**Props:**
- `label`: string
- `error`: string
- `success`: string
- `helperText`: string
- Все стандартные HTML textarea props

**Пример использования:**
```tsx
import { Textarea } from '@/components';

<Textarea
  label="Заметки"
  placeholder="Как прошла тренировка?"
  rows={4}
/>
```

---

### 5. Badge
Компактный индикатор статуса или категории.

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `dot`: boolean

**Пример использования:**
```tsx
import { Badge } from '@/components';

<Badge variant="success" dot>Завершено</Badge>
```

---

### 6. Switch
Тумблер для включения/выключения опций.

**Props:**
- `checked`: boolean
- `onChange`: (checked: boolean) => void
- `disabled`: boolean
- `label`: string

**Пример использования:**
```tsx
import { Switch } from '@/components';

<Switch 
  checked={isEnabled} 
  onChange={setIsEnabled}
  label="Включить уведомления"
/>
```

---

### 7. Checkbox
Чекбокс для выбора опций.

**Props:**
- `label`: string
- `error`: string
- Все стандартные HTML input[type="checkbox"] props

**Пример использования:**
```tsx
import { Checkbox } from '@/components';

<Checkbox 
  label="Согласен с условиями"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
```

---

### 8. Select
Выпадающий список с поиском.

**Props:**
- `options`: SelectOption[]
- `value`: string
- `onChange`: (value: string) => void
- `placeholder`: string
- `label`: string
- `error`: string
- `disabled`: boolean

**Пример использования:**
```tsx
import { Select, type SelectOption } from '@/components';

const options: SelectOption[] = [
  { value: 'chest', label: 'Грудь', icon: <Icon /> },
  { value: 'back', label: 'Спина', icon: <Icon /> }
];

<Select
  label="Группа мышц"
  options={options}
  value={selected}
  onChange={setSelected}
/>
```

---

### 9. Modal
Модальное окно с backdrop.

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'

**Пример использования:**
```tsx
import { Modal } from '@/components';

<Modal isOpen={isOpen} onClose={handleClose} title="Заголовок">
  Контент модального окна
</Modal>
```

---

### 10. BottomSheet
Выдвигающаяся панель снизу с поддержкой свайпа.

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: 'auto' | 'half' | 'full'

**Пример использования:**
```tsx
import { BottomSheet } from '@/components';

<BottomSheet isOpen={isOpen} onClose={handleClose} title="Опции">
  Контент панели
</BottomSheet>
```

---

### 11. Tabs
Компонент вкладок для организации контента.

**Props:**
- `tabs`: Array<{ id: string; label: string; content: ReactNode; icon?: ReactNode }>
- `defaultTab`: string
- `onChange`: (tabId: string) => void

**Пример использования:**
```tsx
import { Tabs } from '@/components';

<Tabs
  tabs={[
    { id: 'tab1', label: 'Обзор', content: <div>Контент 1</div> },
    { id: 'tab2', label: 'История', content: <div>Контент 2</div> }
  ]}
  defaultTab="tab1"
/>
```

---

### 12. Alert
Уведомление или предупреждение.

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error'
- `title`: string
- `onClose`: () => void

**Пример использования:**
```tsx
import { Alert } from '@/components';

<Alert variant="success" title="Успешно!">
  Тренировка сохранена
</Alert>
```

---

### 13. StatCard
Карточка для отображения статистики.

**Props:**
- `title`: string
- `value`: string | number
- `icon`: ReactNode
- `trend`: { direction: 'up' | 'down' | 'neutral'; value: string | number }
- `subtitle`: string

**Пример использования:**
```tsx
import { StatCard } from '@/components';

<StatCard
  title="Всего тренировок"
  value="42"
  icon={<Icon />}
  trend={{ direction: 'up', value: '+12%' }}
/>
```

---

### 14. ProgressRing
Круговой индикатор прогресса.

**Props:**
- `progress`: number (0-100)
- `size`: number
- `strokeWidth`: number
- `label`: string
- `showPercentage`: boolean

**Пример использования:**
```tsx
import { ProgressRing } from '@/components';

<ProgressRing 
  progress={75} 
  size={120} 
  label="Завершено" 
/>
```

---

### 15. Spinner
Индикатор загрузки.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'primary' | 'white' | 'gray'

**Пример использования:**
```tsx
import { Spinner } from '@/components';

<Spinner size="md" variant="primary" />
```

---

### 16. Skeleton
Заглушка для загружаемого контента.

**Props:**
- `variant`: 'text' | 'circular' | 'rectangular'
- `width`: string | number
- `height`: string | number

**Композиции:**
- `SkeletonCard`: готовая карточка-заглушка
- `SkeletonAvatar`: заглушка аватара

**Пример использования:**
```tsx
import { Skeleton, SkeletonCard } from '@/components';

<Skeleton variant="text" width="80%" />
<SkeletonCard />
```

---

## 🎨 Design Demo

Для просмотра всех компонентов в действии перейдите на страницу `/design` в приложении или откройте файл `src/pages/DesignDemo.tsx`.

---

## 🧪 Тестирование

Все компоненты покрыты unit-тестами с использованием Vitest и React Testing Library.

**Структура тестов:**
```
src/test/
├── setup.ts          # Настройка окружения для тестов
├── Button.test.tsx   # Тесты для Button
├── Card.test.tsx     # Тесты для Card
├── Badge.test.tsx    # Тесты для Badge
└── ...               # Остальные тесты
```

**Пример теста:**
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

---

## 📝 Лучшие практики

1. **Используйте типизацию**: Все компоненты полностью типизированы с TypeScript
2. **Accessibility**: Компоненты следуют best practices для доступности
3. **Темная тема**: Все компоненты поддерживают dark mode через Tailwind
4. **Производительность**: Используйте React.memo для оптимизации при необходимости
5. **Тестирование**: Пишите тесты для новых компонентов и функций

---

## 🚀 Расширение библиотеки

Чтобы добавить новый компонент:

1. Создайте файл в `src/components/YourComponent.tsx`
2. Экспортируйте компонент в `src/components/index.ts`
3. Добавьте демонстрацию в `src/pages/DesignDemo.tsx`
4. Напишите тесты в `src/test/YourComponent.test.tsx`
5. Обновите эту документацию

---

## 📚 Дополнительные ресурсы

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev)
- [Testing Library](https://testing-library.com/react)
