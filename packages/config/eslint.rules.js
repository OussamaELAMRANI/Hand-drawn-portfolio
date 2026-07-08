// packages/config/eslint.rules.js
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default [
    // TS files: type-aware parsing
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.mts'],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
    // Vue files: vue-eslint-parser wraps tseslint.parser, forward project options
    {
        files: ['**/*.vue'],
        languageOptions: {
            // parser stays vue-eslint-parser (set by the Vue preset / withNuxt)
            parserOptions: {
                parser: tseslint.parser,
                projectService: true,
                extraFileExtensions: ['.vue'],
            },
        },
    },
    {
        files: ['**/*.vue'],
        rules: {
            'vue/multi-word-component-names': 'off',
        },
    },
    // TS rules only where the TS parser runs — plain .js is parsed by espree
    // and @typescript-eslint rules crash without parser services
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.vue'],
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/consistent-type-imports': 'error',
        },
    },
    {
        files: ['**/*.config.{js,mjs,ts}', '**/*.stories.ts'],
        ...tseslint.configs.disableTypeChecked,
    },
    prettier,
]
