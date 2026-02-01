import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react' // <--- 1. TAMBAHKAN IMPORT INI
import { defineConfig } from 'eslint/config'

export default defineConfig([
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    // Setup Bahasa & Parser
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    // Setup Settings (Penting untuk deteksi versi React)
    settings: {
      react: { version: '18.3' }, // Atau 'detect'
    },
    // Setup Plugins
    plugins: {
      'react': react, // <--- 2. REGISTRASI PLUGIN REACT
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    // Setup Rules
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules, // Load rule standar React
      
      // <--- 3. RULE UTAMA UNTUK MEMPERBAIKI MASALAH ANDA:
      'react/jsx-uses-vars': 'error', 
      'react/react-in-jsx-scope': 'off', // Matikan ini jika pakai React 17+ (Vite)
      'react/prop-types': 'off',

      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // Rule Custom Anda
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])