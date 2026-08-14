import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Только для разработки. Модуль вешает на window функцию loadTestWorkouts,
// которая одним вызовом стирает сохранённые тренировки, — в продакшен-бандле
// ей делать нечего. Динамический импорт под флагом вырезается при сборке.
if (import.meta.env.DEV) {
  import('./utils/testData')
}

// Register service worker for PWA.
// Путь строится от BASE_URL: на GitHub Pages приложение лежит в подпапке,
// и '/sw.js' в корне домена просто не существует.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Service worker registration handled by vite-plugin-pwa
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
