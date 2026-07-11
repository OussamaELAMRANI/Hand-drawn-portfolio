<script setup lang="ts">
import { computed } from 'vue'
import SketchBox from '#components/SketchBox/SketchBox.vue'
import { useShiki } from '#composables/useShiki'
import type { UiTerminalProps } from './UiTerminal.types'

const props = withDefaults(
    defineProps<UiTerminalProps>(),
    { title: '~/terminal', code: undefined, lang: 'text' },
)

// the terminal surface stays #22252B in both themes, so highlighting
// always uses the dark theme rather than the dual light/dark render
const { html } = useShiki(
    () => props.code ?? '',
    () => props.lang,
    'dark',
)
const highlighted = computed(() => (props.code != null ? html.value : null))

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
      <!-- eslint-disable-next-line vue/no-v-html — shiki output, built from escaped code -->
      <div v-if="highlighted !== null" class="terminal-code" v-html="highlighted" />
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
</style>
