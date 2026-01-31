import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

const reactRules = reactPlugin.configs?.recommended?.rules ?? {};
const reactHooksRules = reactHooks.configs?.recommended?.rules ?? {};
const prettierRules = prettierConfig?.rules ?? {};

export default [
    {
        ignores: [
            'node_modules/**',
            'public/build/**',
            'public/storage/**',
            'storage/**',
            'vendor/**',
        ],
    },
    {
        files: ['resources/js/**/*.{js,jsx}'],
        linterOptions: {
            reportUnusedDisableDirectives: 'error',
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                fetch: 'readonly',
                FormData: 'readonly',
                URL: 'readonly',
                URLSearchParams: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooks,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...reactRules,
            ...reactHooksRules,
            ...prettierRules,
            'react/react-in-jsx-scope': 'off',
        },
    },
];
