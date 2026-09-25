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
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        // Injected by vite.config.js `define` at build time. They exist in the
        // bundle but nowhere ESLint can see, so they have to be declared or
        // every read of them is a no-undef error. readonly, because assigning
        // to one would be writing to a literal.
        __APP_VERSION__: 'readonly',
        __APP_COMMIT__: 'readonly',
        __BUILD_TIME__: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Build/tooling files run in Node, not the browser. Without this they are
    // linted against browser globals only, so `process` and `__dirname` read as
    // undefined variables — and vite.config.js legitimately needs `process` to
    // pick up TUNNEL_HOST from the environment.
    files: ['vite.config.js', 'eslint.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
