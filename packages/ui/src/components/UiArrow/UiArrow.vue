<script setup lang="ts">
import { ref, computed } from 'vue'
import rough from 'roughjs'
import { useElementSize } from '#composables/useElementSize'
import type { UiArrowProps } from './UiArrow.types'

const props = withDefaults(
    defineProps<UiArrowProps>(),
    { color: '#C0577F', strokeWidth: 2, roughness: 1.8 },
)

const gen = rough.generator()
const seed = Math.floor(Math.random() * 2 ** 31)
const rootRef = ref<HTMLElement | null>(null)
const { size } = useElementSize(rootRef)

// hand arrow geometry from the design system's sketch engine:
// a swooping shaft plus a small open arrowhead
const paths = computed(() => {
  const { w, h } = size.value
  if (!w || !h) return []
  const pad = 4
  const opts = {
    seed,
    stroke: props.color,
    strokeWidth: props.strokeWidth,
    roughness: props.roughness,
  }
  const shaft = gen.linearPath(
      [
        [pad, pad + 6],
        [w * 0.45, h * 0.55],
        [w - pad - 4, h - pad],
      ],
      opts,
  )
  const head = gen.linearPath(
      [
        [w - pad - 18, h - pad - 12],
        [w - pad - 4, h - pad],
        [w - pad - 20, h - pad - 2],
      ],
      opts,
  )
  return [...gen.toPaths(shaft), ...gen.toPaths(head)]
})
</script>

<template>
  <span ref="rootRef" class="relative isolate inline-block h-[60px] w-[90px]" aria-hidden="true">
    <svg class="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      <path
          v-for="(p, i) in paths"
          :key="i"
          :d="p.d"
          :stroke="p.stroke"
          :stroke-width="p.strokeWidth"
          stroke-linecap="round"
          fill="none"
      />
    </svg>
  </span>
</template>
