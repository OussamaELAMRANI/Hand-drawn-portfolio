<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDarkMode } from '#composables/useDarkMode'
import { useElementSize } from '#composables/useElementSize'
import { useRoughShape } from '#composables/useRoughShape'
import type { SketchBoxProps } from './SketchBox.types'

const props = withDefaults(
    defineProps<SketchBoxProps>(),
    {
      tag: 'div',
      shape: 'rect',
      color: '#2A2A2A',
      darkColor: undefined,
      strokeWidth: 1.7,
      roughness: 1.8,
    },
)

// night-mode equivalents of the neutral strokes the design system uses;
// accent strokes (magenta, cyan) and the terminal frame (#4a4a4a) stay
// identical in both modes, matching the source theme's remap table
const DARK_STROKES: Record<string, string> = {
  '#2a2a2a': '#e9e9e1',
  '#c9c9bf': '#565961',
  '#b9b9af': '#565961',
}

const { isDark } = useDarkMode()
const rootRef = ref<HTMLElement | null>(null)
const { size } = useElementSize(rootRef)
// fixed seed so redraws (resize, theme flip) keep the same wobble
const seed = Math.floor(Math.random() * 2 ** 31)

const stroke = computed(() =>
    isDark.value
        ? (props.darkColor ?? DARK_STROKES[props.color.toLowerCase()] ?? props.color)
        : props.color,
)

const { outlinePaths } = useRoughShape({
  size,
  seed,
  shape: () => props.shape,
  roughness: () => props.roughness,
  stroke,
  strokeWidth: () => props.strokeWidth,
  fill: () => 'none',
})
</script>

<template>
  <component :is="tag" ref="rootRef" class="relative isolate">
    <svg
        v-if="size.w > 0"
        class="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-visible"
        aria-hidden="true"
    >
      <path
          v-for="(p, i) in outlinePaths"
          :key="i"
          :d="p.d"
          :stroke="p.stroke"
          :stroke-width="p.strokeWidth"
          stroke-linecap="round"
          fill="none"
      />
    </svg>
    <slot />
  </component>
</template>
