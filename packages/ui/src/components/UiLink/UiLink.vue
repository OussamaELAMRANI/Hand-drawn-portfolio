<script setup lang="ts">
import type { UiLinkProps } from './UiLink.types'

withDefaults(defineProps<UiLinkProps>(), { href: '#' })
</script>

<template>
  <a
      :href="href"
      class="text-cyan underline decoration-cyan decoration-wavy decoration-[1.5px] underline-offset-4
             transition-colors duration-200 ease-out
             hover:text-magenta hover:decoration-[#F49BC1]"
  >
    <slot />
  </a>
</template>
