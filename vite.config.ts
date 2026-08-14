import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// GitHub Pages отдаёт проект по адресу вида
// https://<логин>.github.io/<репозиторий>/ — то есть из подпапки, а не с корня.
// Без base все ссылки на скрипты и стили ведут в корень домена, и открывается
// белый экран. В режиме разработки база остаётся корневой.
const BASE = '/gym-tracker/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? BASE : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'icons/*.png'],
      manifest: {
        name: 'Gym Tracker',
        short_name: 'GymTracker',
        description: 'Приложение для отслеживания тренировок',
        theme_color: '#9333ea',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'portrait',
        // Пути относительно base — иначе установленное PWA открывалось бы
        // на корне домена, где приложения нет
        start_url: BASE,
        scope: BASE,
        icons: [
          {
            src: `${BASE}icons/icon-192x192.png`,
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: `${BASE}icons/icon-512x512.png`,
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: `${BASE}icons/icon-512x512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              },
              networkTimeoutSeconds: 5,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}))
