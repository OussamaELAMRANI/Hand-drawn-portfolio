// Fallback so plain `tsc` and TS servers without the Vue language plugin can
// resolve `.vue` imports. vue-tsc / Volar-enabled editors resolve the real SFC
// types instead — TypeScript prefers actual modules over wildcard ambients.
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<object, object, unknown>
    export default component
}
