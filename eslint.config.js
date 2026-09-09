import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'

export default [
  { ignores: ['dist', 'node_modules'] },
  // Build/tooling config runs under Node, not the browser.
  { files: ['*.config.js'], languageOptions: { globals: globals.node } },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: { ecmaVersion: 'latest', ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    plugins: { react, 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    settings: { react: { version: 'detect' } },
    rules: {
      ...js.configs.recommended.rules,
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
]
