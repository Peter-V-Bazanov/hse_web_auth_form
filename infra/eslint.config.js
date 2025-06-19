import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist/'],
  },

  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.ts'],

    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },

    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },

    prettierConfig,
  },
];
