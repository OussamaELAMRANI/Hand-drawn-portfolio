import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  // @storybook/vue3-vite v10 no longer injects @vitejs/plugin-vue itself —
  // without it .vue files reach the bundler untransformed
  viteFinal: (viteConfig) => mergeConfig(viteConfig, { plugins: [vue(), tailwindcss()] }),
}

export default config
