import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      stylistic: false, // you're using Prettier for formatting
    },
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    // extra strictness from @larevo/config/tsconfig/base that Nuxt doesn't set;
    // Nuxt owns the generated tsconfigs, so options go here instead of "extends"
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: true,
      },
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
})
