<script setup lang="ts">
import type { UiPillProps } from './UiPill.types'

withDefaults(defineProps<UiPillProps>(), { active: false })
</script>

<template>
  <button
      type="button"
      class="inline-block cursor-pointer rounded-[20px] border-[1.5px] px-[18px] py-2 font-hand text-base
             transition-transform duration-150 ease-out"
      :class="
        active
          ? '-rotate-[1.5deg] border-ink bg-ink text-paper dark:border-chalk dark:bg-chalk dark:text-night'
          : 'border-[#dcdcd2] bg-white text-ink hover:-translate-y-0.5 dark:border-night-600 dark:bg-night-800 dark:text-chalk'
      "
  >
    <slot />
  </button>
</template>
