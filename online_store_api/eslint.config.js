import eslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': eslintPlugin,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['warn'],
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
        },
    },
];
