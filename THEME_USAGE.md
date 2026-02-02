# Theme System Usage

## ThemeContext

Система управления темой приложения с поддержкой светлой, темной и системной темы.

### Возможности

✅ Три режима темы: `light`, `dark`, `system`  
✅ Автоматическое определение системной темы  
✅ Сохранение выбора в localStorage  
✅ Отслеживание изменений системной темы  
✅ Автоматическое применение класса `dark` к `<html>`  

---

## Использование

### 1. Обернуть приложение в ThemeProvider

```tsx
// src/main.tsx
import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
```

### 2. Использовать хук useTheme

```tsx
import { useTheme } from '../hooks/useTheme';

function MyComponent() {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      {/* Текущая тема */}
      <p>Текущая тема: {theme}</p>
      <p>Темная тема активна: {isDark ? 'Да' : 'Нет'}</p>

      {/* Переключить между light и dark */}
      <button onClick={toggleTheme}>
        {isDark ? '☀️ Светлая' : '🌙 Темная'}
      </button>

      {/* Выбор конкретной темы */}
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Светлая</option>
        <option value="dark">Темная</option>
        <option value="system">Системная</option>
      </select>
    </div>
  );
}
```

---

## API Reference

### ThemeContext

```tsx
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';       // Выбранная тема
  resolvedTheme: 'light' | 'dark';          // Реальная тема (без system)
  setTheme: (theme: Theme) => void;         // Установить тему
  toggleTheme: () => void;                   // Переключить light/dark
  isDark: boolean;                           // Флаг темной темы
}
```

### useTheme Hook

```tsx
const {
  theme,          // 'light' | 'dark' | 'system'
  resolvedTheme,  // 'light' | 'dark'
  setTheme,       // (theme: Theme) => void
  toggleTheme,    // () => void
  isDark,         // boolean
} = useTheme();
```

---

## Примеры использования

### Простой переключатель

```tsx
function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
```

### Расширенный селектор

```tsx
function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme('light')}
        className={theme === 'light' ? 'active' : ''}
      >
        ☀️ Светлая
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={theme === 'dark' ? 'active' : ''}
      >
        🌙 Темная
      </button>
      <button
        onClick={() => setTheme('system')}
        className={theme === 'system' ? 'active' : ''}
      >
        💻 Системная
      </button>
    </div>
  );
}
```

### Условный рендеринг

```tsx
function MyComponent() {
  const { isDark, resolvedTheme } = useTheme();
  
  return (
    <div>
      {isDark ? (
        <MoonIcon />
      ) : (
        <SunIcon />
      )}
      
      {resolvedTheme === 'dark' && (
        <p>Темная тема включена!</p>
      )}
    </div>
  );
}
```

---

## Как это работает

1. **Инициализация**: При первом запуске проверяется localStorage. Если темы нет - используется `system`

2. **System Mode**: Когда выбрана `system`, автоматически определяется тема ОС через `prefers-color-scheme`

3. **Отслеживание изменений**: Подписка на `matchMedia` отслеживает изменения системной темы в реальном времени

4. **Применение темы**: Класс `dark` автоматически добавляется/удаляется из `<html>` элемента

5. **Сохранение**: Выбор пользователя сохраняется в localStorage под ключом `gym-tracker-theme`

---

## Tailwind CSS Integration

Система работает с Tailwind CSS dark mode через класс:

```js
// tailwind.config.js
export default {
  darkMode: 'class', // Использует класс .dark на html
  // ...
}
```

Теперь можно использовать `dark:` префикс:

```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-black dark:text-white">Текст</p>
</div>
```

---

## localStorage Key

```
gym-tracker-theme: 'light' | 'dark' | 'system'
```

Чтобы сбросить тему:
```js
localStorage.removeItem('gym-tracker-theme');
// Перезагрузить страницу
```
