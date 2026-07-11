<script setup lang="ts">
import { computed } from 'vue'
import type { CardVariant, UiCardProps } from './UiCard.types'
import SketchBox from '#components/SketchBox/SketchBox.vue'
import UiPin from '#components/UiPin/UiPin.vue'
import UiTape from '#components/UiTape/UiTape.vue'

const props = withDefaults(defineProps<UiCardProps>(), { variant: 'index' })

const SPECS: Record<
    CardVariant,
    { color: string; strokeWidth: number; class: string }
> = {
  index: {
    color: '#2A2A2A',
    strokeWidth: 1.9,
    class: `bg-white px-[22px] py-6 shadow-sticky -rotate-[1.4deg]
            transition-transform duration-200 ease-out hover:rotate-0 hover:-translate-y-1
            dark:bg-night-800`,
  },
  polaroid: {
    color: '#2A2A2A',
    strokeWidth: 1.8,
    class: `bg-white px-3 pt-3 pb-4 shadow-sticky rotate-[1.6deg]
            transition-transform duration-200 ease-out hover:rotate-0 hover:scale-[1.02]
            dark:bg-night-800`,
  },
  callout: {
    color: '#C0577F',
    strokeWidth: 2,
    class: `bg-blush px-6 py-[22px]
            transition-transform duration-200 ease-out hover:-translate-y-[3px]
            dark:bg-nightBlush`,
  },
}

const spec = computed(() => SPECS[props.variant])
</script>

<template>
  <SketchBox :color="spec.color" :stroke-width="spec.strokeWidth" :class="spec.class">
    <UiPin
        v-if="variant === 'index'"
        class="absolute -top-[9px] left-1/2 -translate-x-1/2"
    />
    <UiTape
        v-if="variant === 'polaroid'"
        class="absolute -top-[11px] left-1/2 -translate-x-1/2"
    />
    <slot />
  </SketchBox>
</template>
