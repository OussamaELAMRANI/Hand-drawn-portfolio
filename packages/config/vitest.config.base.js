// plain .js so Node can load it when Vite externalizes this package
// from consumers' vitest.config.ts bundles
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            exclude: ['**/*.stories.ts', '**/*.config.*'],
        },
    },
})
