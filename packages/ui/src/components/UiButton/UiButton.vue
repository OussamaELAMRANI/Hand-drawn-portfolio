<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ButtonVariant, UiButtonProps } from './UiButton.types'
import { useDarkMode } from '#composables/useDarkMode'
import { useElementSize } from '#composables/useElementSize'
import { usePressable } from '#composables/usePressable'
import { useRoughShape } from '#composables/useRoughShape'
import { useSweepReveal } from '#composables/useSweepReveal'

const props = withDefaults(
    defineProps<UiButtonProps>(),
    {
      href: undefined,
      variant: 'sketch',
      shape: 'rect',
      reveal: 'fade',
      fillStyle: 'zigzag',
      hachureAngle: -41,
      roughness: 1.8,
      animate: true,
      disabled: false,
    },
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()

interface Ink {
  stroke: string
  strokePressed: string
  fill: string
}

// SVG inks are computed in JS (rough.js paths), so night mode needs an
// explicit dark palette — CSS `dark:` variants only cover the text color.
// textOnFillDark: the marker-yellow fill stays bright in night mode, so
// chalk text must fall back to ink while the fill is showing.
const VARIANTS: Record<
    ButtonVariant,
    { light: Ink; dark: Ink; text: string; textOnFillDark?: string }
> = {
  sketch: {
    light: { stroke: '#2A2A2A', strokePressed: '#000000', fill: '#FCE34B' },
    dark:  { stroke: '#e9e9e1', strokePressed: '#ffffff', fill: '#FCE34B' },
    text: 'text-[#2A2A2A] dark:text-[#e9e9e1]',
    textOnFillDark: 'text-[#2A2A2A]',
  },
  primary: {
    light: { stroke: '#1d4ed8', strokePressed: '#1e3a8a', fill: '#93c5fd' },
    dark:  { stroke: '#93c5fd', strokePressed: '#dbeafe', fill: '#1d4ed8' },
    text: 'text-blue-900 dark:text-blue-200',
  },
  secondary: {
    light: { stroke: '#374151', strokePressed: '#111827', fill: '#d1d5db' },
    dark:  { stroke: '#d1d5db', strokePressed: '#f9fafb', fill: '#4b5563' },
    text: 'text-gray-800 dark:text-gray-200',
  },
  danger: {
    light: { stroke: '#b91c1c', strokePressed: '#7f1d1d', fill: '#fca5a5' },
    dark:  { stroke: '#fca5a5', strokePressed: '#fecaca', fill: '#b91c1c' },
    text: 'text-red-900 dark:text-red-200',
  },
  ghost: {
    light: { stroke: '#6b7280', strokePressed: '#374151', fill: 'none' },
    dark:  { stroke: '#9ca3af', strokePressed: '#e5e7eb', fill: 'none' },
    text: 'text-gray-600 dark:text-gray-400',
  },
}

const { isDark } = useDarkMode()

const palette = computed(() => {
  const v = VARIANTS[props.variant]
  return isDark.value ? v.dark : v.light
})

// ─────────────────────────────────────────────
// Compose the hooks — the whole logic layer
// ─────────────────────────────────────────────
const rootRef = ref<HTMLElement | null>(null)

const { size } = useElementSize(rootRef)

const { hovered, pressed, seed, handlers } = usePressable(() => props.disabled)

const { outlinePaths, fillPaths } = useRoughShape({
  size,
  seed,
  shape: () => props.shape,
  roughness: () => props.roughness,
  stroke: () => (pressed.value ? palette.value.strokePressed : palette.value.stroke),
  strokeWidth: () => (pressed.value ? 3 : 2.2),
  fill: () => palette.value.fill,
  fillStyle: () => props.fillStyle,
  fillWeight: () => (pressed.value ? 1.8 : 1.4),
  hachureAngle: () => props.hachureAngle,
})

const showFill = computed(() => hovered.value && !props.disabled)

const textClass = computed(() => {
  const v = VARIANTS[props.variant]
  return showFill.value && isDark.value && v.textOnFillDark ? v.textOnFillDark : v.text
})

const { clipId, cx, cy, D, windowAngle, clipWindow } = useSweepReveal(
    size,
    () => props.hachureAngle,
    showFill,
)

// draw-in runs only for the first sketch, not on resizes
const drawnOnce = ref(false)
watch(size, () => {
  if (!drawnOnce.value) setTimeout(() => (drawnOnce.value = true), 1200)
})

function onClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  emit('click', e)
}
</script>

<template>
  <component
      :is="href ? 'a' : 'button'"
      ref="rootRef"
      :href="href"
      :type="href ? undefined : 'button'"
      :disabled="href ? undefined : disabled"
      :aria-disabled="href && disabled ? 'true' : undefined"
      class="group relative isolate inline-flex items-center justify-center
           bg-transparent px-6 py-3 font-hand text-lg no-underline select-none
           transition-[transform,color] duration-200 ease-out
           focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current
           motion-reduce:transition-none"
      :class="[
      textClass,
      disabled
        ? 'opacity-40 cursor-not-allowed'
        : 'cursor-pointer hover:-translate-y-0.5 hover:-rotate-1',
      { 'translate-y-px scale-[0.99] !rotate-0': pressed && !disabled },
    ]"
      v-on="handlers"
      @click="onClick"
  >
    <svg
        v-if="size.w > 0"
        class="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-visible"
        aria-hidden="true"
    >
      <defs v-if="reveal === 'sweep'">
        <clipPath :id="clipId">
          <rect
              :x="cx - D / 2"
              :width="D"
              :y="clipWindow.y"
              :height="clipWindow.height"
              :transform="`rotate(${windowAngle}, ${cx}, ${cy})`"
              class="transition-all duration-500 ease-out motion-reduce:transition-none"
          />
        </clipPath>
      </defs>

      <!-- Scribble fill -->
      <g
          v-if="fillPaths.length"
          :clip-path="reveal === 'sweep' ? `url(#${clipId})` : undefined"
          :class="
          reveal === 'fade'
            ? ['transition-opacity duration-200 ease-out', showFill ? 'opacity-100' : 'opacity-0']
            : undefined
        "
      >
        <!-- most fill styles are stroked scribbles (fill 'none');
             'solid' instead emits a filled path with stroke 'none' -->
        <path
            v-for="(p, i) in fillPaths"
            :key="`f-${i}`"
            :d="p.d"
            :stroke="p.stroke"
            :stroke-width="p.strokeWidth"
            stroke-linecap="round"
            :fill="p.fill ?? 'none'"
        />
      </g>

      <!-- Sketchy border with declarative draw-in -->
      <g>
        <path
            v-for="(p, i) in outlinePaths"
            :key="`o-${i}`"
            :d="p.d"
            :stroke="p.stroke"
            :stroke-width="p.strokeWidth"
            stroke-linecap="round"
            fill="none"
            pathLength="1"
            :class="{ 'draw-in': animate && !drawnOnce }"
            :style="{ animationDelay: `${i * 0.05}s` }"
        />
      </g>
    </svg>

    <slot>See my work →</slot>
  </component>
</template>

<style scoped>
.draw-in {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw-in 0.55s ease forwards;
}
@keyframes draw-in {
  to {
    stroke-dashoffset: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .draw-in {
    animation: none;
    stroke-dashoffset: 0;
  }
}

.font-hand {
  font-family: 'Patrick Hand', 'Comic Sans MS', cursive;
}
</style>