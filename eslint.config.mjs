import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

const sourceFiles = ['src/app/**/*.ts'];
const templateFiles = ['src/app/**/*.html'];

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.angular/**',
      'public/**',
      'e2e/**',
      'scripts/**',
      'src/**/*.spec.ts',
    ],
  },
  {
    files: sourceFiles,
    ...eslint.configs.recommended,
  },
  ...tseslint.configs.recommended.map((config) => ({ ...config, files: sourceFiles })),
  ...angular.configs.tsRecommended.map((config) => ({ ...config, files: sourceFiles })),
  {
    files: sourceFiles,
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Enforce-forward: estas reglas de migración/estilo no bloquean el baseline.
      '@angular-eslint/prefer-inject': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@angular-eslint/use-lifecycle-interface': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  ...angular.configs.templateRecommended.map((config) => ({ ...config, files: templateFiles })),
);
