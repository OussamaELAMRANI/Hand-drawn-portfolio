<script setup lang="ts">
import { computed } from 'vue'
import type { BadgeVariant, UiBadgeProps } from './UiBadge.types'

const props = withDefaults(defineProps<UiBadgeProps>(), { variant: 'code' })

const COLORS: Record<BadgeVariant, string> = {
  ai: 'bg-magenta',
  code: 'bg-cyan',
  news: 'bg-violet',
  career: 'bg-amber',
}

const colorClass = computed(() => COLORS[props.variant])
</script>

<template>
  <span class="rounded-[3px] px-[11px] py-[3px] font-mono text-[11px] text-white" :class="colorClass">
    <slot />
  </span>
</template>
