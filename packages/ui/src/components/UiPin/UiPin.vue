<script setup lang="ts">
import type { UiPinProps } from './UiPin.types'

withDefaults(defineProps<UiPinProps>(), { color: '#C0577F', size: 16 })
</script>

<template>
  <span
      class="inline-block shadow-[0_2px_3px_rgba(0,0,0,0.2)]"
      :style="{
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        borderRadius: '48% 52% 50% 50% / 52% 50% 50% 48%',
      }"
      aria-hidden="true"
  />
</template>
