import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
    },
    extends: ['eslint:recommended', 'plugin:jest/recommended'],
  },
]);
