import { mergeConfig, defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import base from '@larevo/config/vitest'

export default mergeConfig(base, defineConfig({ plugins: [vue()] }))
