<script setup lang="ts">
import { computed } from 'vue'
import type { TypographyVariant, TypographyProps } from './Typography.types'

const props = withDefaults(
    defineProps<TypographyProps>(),
    { variant: 'body', as: undefined },
)

// tag + classes per variant; sizes/leading/weight come from the
// fontSize tokens in @larevo/config/tailwind (text-h1 … text-mono)
const VARIANTS: Record<TypographyVariant, { tag: string; class: string }> = {
  h1:    { tag: 'h1',   class: 'font-display text-h1 text-ink dark:text-chalk' },
  h2:    { tag: 'h2',   class: 'font-display text-h2 text-ink dark:text-chalk' },
  lead:  { tag: 'p',    class: 'font-display text-lead text-ink dark:text-chalk' },
  label: { tag: 'span', class: 'font-hand text-label text-ink dark:text-chalk' },
  body:  { tag: 'p',    class: 'font-sans text-body text-ink-600 dark:text-chalk-600' },
  mono:  { tag: 'code', class: 'font-mono text-mono text-ink dark:text-chalk' },
}

const spec = computed(() => VARIANTS[props.variant])
</script>

<template>
  <component :is="as ?? spec.tag" :class="spec.class">
    <slot />
  </component>
</template>
