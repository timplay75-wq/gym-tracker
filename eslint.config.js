import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Подчёркивание = «намеренно не используется». Конвенция уже применялась
      // в коде (например _mode в dataExport), но правилом не поддерживалась.
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
    },
  },
  {
    // Провайдеры держат контекст, компонент-провайдер и хук доступа в одном
    // файле. Правило требует разнести их по разным файлам ради Fast Refresh
    // в dev-режиме; на рантайм это не влияет, а импорты пришлось бы править
    // в 32 файлах. Сознательно оставляем принятую в проекте компоновку.
    files: [
      'src/context/AuthContext.tsx',
      'src/contexts/ThemeContext.tsx',
      'src/contexts/ToastContext.tsx',
      'src/i18n/index.tsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
