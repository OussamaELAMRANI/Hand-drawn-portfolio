<script setup lang="ts">
import type { UiTapeProps } from './UiTape.types'

withDefaults(defineProps<UiTapeProps>(), {
  width: 76,
  height: 22,
  angle: -5,
})
</script>

<template>
  <span
      class="inline-block border border-ink/10 bg-sky/50 dark:border-chalk/10"
      :style="{ width: `${width}px`, height: `${height}px`, transform: `rotate(${angle}deg)` }"
      aria-hidden="true"
  />
</template>
