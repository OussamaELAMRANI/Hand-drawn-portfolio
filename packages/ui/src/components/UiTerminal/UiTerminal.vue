<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import SketchBox from '#components/SketchBox/SketchBox.vue'
import { useShiki } from '#composables/useShiki'
import { useTypewriter } from '#composables/useTypewriter'
import type { UiTerminalProps } from './UiTerminal.types'

const props = withDefaults(
    defineProps<UiTerminalProps>(),
    { title: '~/terminal', code: undefined, lang: 'text', typewriter: false, typeSpeed: 50 },
)

// the terminal surface stays #22252B in both themes, so highlighting
// always uses the dark theme rather than the dual light/dark render
const { html, ready } = useShiki(
    () => props.code ?? '',
    () => props.lang,
    'dark',
)
const highlighted = computed(() => (props.code != null ? html.value : null))

// ── optional typewriter: arm on the Shiki render, type when visible ──
const codeRef = ref<HTMLElement | null>(null)
const armed = ref(false)

const { arm, typing, done } = useTypewriter(codeRef, {
  speed: () => props.typeSpeed,
  paragraphPause: 0,
})

watch(
    [ready, () => props.typewriter],
    async ([r, tw]) => {
      if (!r || !tw || armed.value) return
      // wait for the highlighted HTML to land in the DOM before collecting
      await nextTick()
      armed.value = arm()
    },
    { immediate: true, flush: 'post' },
)

// hand-drawn traffic lights: each blob gets its own wobbly radius
const LIGHTS = [
  { color: '#f4a3a3', radius: '48% 52% 50% 50% / 52% 50% 50% 48%' },
  { color: '#f4d58d', radius: '50% 50% 47% 53% / 50%' },
  { color: '#a8d8a0', radius: '52% 48% 50% 50% / 48% 52% 50% 50%' },
]
</script>

<template>
  <SketchBox color="#4a4a4a" :stroke-width="2" class="max-w-[640px] shadow-terminal">
    <div class="overflow-hidden rounded-[10px] bg-terminal">
      <div class="flex items-center gap-2 border-b border-[#33373f] px-4 py-3">
        <span
            v-for="(l, i) in LIGHTS"
            :key="i"
            class="h-[13px] w-[13px]"
            :style="{ background: l.color, borderRadius: l.radius }"
        />
        <span class="ml-[10px] font-mono text-xs text-[#8b909a]">{{ title }}</span>
      </div>
      <!-- eslint-disable vue/no-v-html — shiki output, built from escaped code -->
      <div
          v-if="highlighted !== null"
          ref="codeRef"
          class="terminal-code"
          :class="{ invisible: typewriter && !typing && !done }"
          v-html="highlighted"
      />
      <!-- eslint-enable vue/no-v-html -->
      <pre
          v-else
          class="m-0 whitespace-pre-wrap px-5 py-[18px] font-mono text-[13px] leading-[1.65] text-[#d7dbe2]"
      ><slot /></pre>
    </div>
  </SketchBox>
</template>

<style scoped>
/* shiki emits <pre class="shiki"> with the theme's own background —
   the terminal panel supplies the surface, so the theme bg is dropped */
.terminal-code :deep(pre.shiki) {
  margin: 0;
  padding: 18px 20px;
  background: transparent !important;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.65;
  white-space: pre-wrap;
}

/* typewriter caret — terminal green, like the mock */
.terminal-code :deep([data-typing])::after {
  content: '▍';
  margin-left: 1px;
  color: #a8d8a0;
  animation: term-blink 1s step-end infinite;
}
@keyframes term-blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}
</style>
