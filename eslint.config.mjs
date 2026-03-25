import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
// eslint-plugin-jsx-a11y는 devDependencies에 포함됨.
// ESLint flat 설정에서 next/typescript(FlatCompat)와 병합 시 일부 환경에서 순환 참조 오류가 나므로,
// 안정화 후 아래 블록을 추가해 활성화: { files: ['**/*.{js,jsx,ts,tsx}'], ...jsxA11y.flatConfigs.recommended },

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // 여기에 추가적인 규칙을 설정할 수 있습니다
      'no-unused-vars': 'off', // TypeScript에서 @typescript-eslint/no-unused-vars 사용
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn', // no-explicit-any 규칙을 warn으로 변경
    },
  },
  eslintConfigPrettier,
];

export default eslintConfig;
