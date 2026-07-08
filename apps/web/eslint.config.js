import withNuxt from './.nuxt/eslint.config.mjs'
import rules from '@larevo/config/eslint-rules'

export default withNuxt(
    // your shared rules are appended AFTER Nuxt's defaults, so they win
    ...rules,
)