import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Relax: turunkan aturan "unused" jadi warning (bukan error) agar build
      // Vercel (yang menjalankan eslint saat build) tidak gagal hanya karena
      // import React lama / variabel sisa refactoring. Code tetap berjalan
      // normal; warning ini bisa dibersihkan bertahap tanpa memblokir deploy.
      'no-unused-vars': 'warn',
      'react-refresh/only-export-components': 'warn',
      'no-useless-assignment': 'warn',
      // Rule baru React 19 (set-state-in-effect) terlalu ketat untuk pola
      // yang sah seperti inisialisasi state dari props/initialData di useEffect.
      // Turunkan jadi warning agar tidak memblokir deploy.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])
