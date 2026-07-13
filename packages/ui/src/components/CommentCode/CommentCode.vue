<script setup lang="ts">
import type { CommentCodeProps } from './CommentCode.types'

withDefaults(defineProps<CommentCodeProps>(), {
  rotate: -1,
})
</script>

<template>
  <div
    class="font-hand text-[19px] text-cyan"
    :style="{ transform: `rotate(${rotate}deg)` }"
  >
    // <slot />
  </div>
</template>
