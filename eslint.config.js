import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import nodePlugin from 'eslint-plugin-n';
import promisePlugin from 'eslint-plugin-promise';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        node: true,
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly'
      }
    },
    plugins: {
      unicorn,
      sonarjs,
      n: nodePlugin,
      jsdoc,
      import: importPlugin,
      promise: promisePlugin
    },
    rules: {
      // 基础 JavaScript 规则
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',

      // 现代 ES Module 实践
      'unicorn/prefer-module': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prefer-top-level-await': 'error',
      'unicorn/no-array-for-each': 'error',
      'unicorn/prefer-spread': 'error',
      'unicorn/prefer-ternary': 'error',
      'unicorn/prefer-logical-operator-over-ternary': 'error',
      'unicorn/no-null': 'off', // 允许使用 null
      'unicorn/prevent-abbreviations': 'off', // 允许缩写

      // Node.js 最佳实践
      'n/prefer-global/process': 'error',
      'n/prefer-promises/fs': 'error',
      'n/no-deprecated-api': 'error',
      'n/no-unsupported-features/es-syntax': 'off',
      'n/no-missing-import': 'off', // 与 TypeScript 冲突

      // 代码质量
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': ['error', { threshold: 5 }],
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/no-small-switch': 'error',
      'sonarjs/no-identical-functions': 'error',

      // JSDoc 文档规范
      'jsdoc/require-description': 'warn',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-indentation': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/no-undefined-types': 'off', // TypeScript 处理

      // Import/Export 规范
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off', // TypeScript 处理
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          mjs: 'never',
          ts: 'never'
        }
      ],

      // Promise 最佳实践
      'promise/always-return': 'error',
      'promise/catch-or-return': 'error',
      'promise/prefer-await-to-then': 'error',
      'promise/no-nesting': 'warn',
      'promise/no-return-wrap': 'error'
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      ...typescript.configs.recommended.rules,

      // TypeScript 工具库优化
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false
        }
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off', // 太严格

      // 覆盖基础规则，使用 TypeScript 版本
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error'
    }
  },
  {
    files: ['**/*.config.{js,mjs,cjs}', '**/.*rc.{js,mjs,cjs}', '**/*.config.cjs', '**/.*rc.cjs'],
    languageOptions: {
      globals: {
        module: 'readonly',
        exports: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly'
      }
    },
    rules: {
      // 配置文件允许更宽松的规则
      '@typescript-eslint/no-var-requires': 'off',
      'unicorn/prefer-module': 'off',
      'n/no-unpublished-require': 'off',
      'import/no-commonjs': 'off',
      'no-console': 'off',
      'jsdoc/require-description': 'off',
      'no-undef': 'off' // 配置文件允许 CommonJS
    }
  },
  {
    files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}', '**/test/**/*.{js,ts}'],
    rules: {
      // 测试文件允许更宽松的规则
      '@typescript-eslint/no-explicit-any': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'jsdoc/require-description': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns-description': 'off',
      'no-console': 'off'
    }
  },
  {
    ignores: [
      // 从 .eslintignore 迁移的规则
      'eslint.config.js',
      'global.t.ts',
      'node_modules/**',
      'dist/**',
      '*.d.ts',
      '.vscode/**',
      'package.json',
      // 原有的忽略规则
      'build/**',
      'coverage/**',
      '*.min.js',
      'packages/*/dist/**',
      'packages/*/build/**',
      '.pnpm-store/**'
    ]
  }
];

export default config;
