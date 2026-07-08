import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

/** @type {import('eslint').Linter.Config[]} */
export default [
    {  files: ['**/*.config.{js,ts,mjs}'], ...tseslint.configs.disableTypeChecked,},
    {ignores: ['**/dist/**', '**/.output/**', '**/.nuxt/**', '**/coverage/**', '**/storybook-static/**']},
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {parser: tseslint.parser},
        },
        rules: {
            // TS checks undefined identifiers in <script lang="ts">; eslint's no-undef
            // false-positives on DOM globals like MouseEvent there
            'no-undef': 'off',
        },
    },
    {
        rules: {
            'vue/multi-word-component-names': 'off',
            '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
            '@typescript-eslint/consistent-type-imports': 'error',
        },
    },
    prettier, // must be last — disables rules that conflict with Prettier
]