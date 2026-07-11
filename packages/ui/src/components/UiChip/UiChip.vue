<script setup lang="ts">
import { computed } from 'vue'
import type { ChipStroke, UiChipProps } from './UiChip.types'
import SketchBox from '#components/SketchBox/SketchBox.vue'

const props = withDefaults(
    defineProps<UiChipProps>(),
    { variant: 'subtle', stroke: 'gray', color: undefined },
)

// gray/ink strokes get night-mode remaps inside SketchBox;
// accent strokes stay identical in both modes, like the rest of the system
const STROKES: Record<ChipStroke, { color: string; text: string }> = {
  gray:    { color: '#b9b9af', text: 'text-ink-600 dark:text-chalk-600' },
  ink:     { color: '#2A2A2A', text: 'text-ink dark:text-chalk' },
  cyan:    { color: '#0E93A8', text: 'text-cyan' },
  magenta: { color: '#C0577F', text: 'text-magenta' },
  violet:  { color: '#8A6BCF', text: 'text-violet' },
  amber:   { color: '#C98A2B', text: 'text-amber' },
}

// a custom color paints the outline only — text keeps the neutral ink
// so brand strokes (TS blue, Node green, …) never hurt label legibility
const strokeSpec = computed(() =>
    props.color
        ? { color: props.color, text: STROKES.gray.text }
        : STROKES[props.stroke],
)
</script>

<template>
  <SketchBox
      v-if="variant === 'sketch'"
      tag="span"
      :color="strokeSpec.color"
      :stroke-width="1.4"
      class="inline-block px-[13px] py-[5px] font-mono text-[12.5px] transition-transform
             duration-150 ease-out hover:-rotate-2"
      :class="strokeSpec.text"
  >
    <slot />
  </SketchBox>
  <span
      v-else
      class="rounded-[3px] bg-[#f4f4ec] px-[10px] py-[3px] font-mono text-[12px] text-ink-500
             dark:bg-night-700 dark:text-chalk-500"
  >
    <slot />
  </span>
</template>
