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

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration handled by vite-plugin-pwa
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
