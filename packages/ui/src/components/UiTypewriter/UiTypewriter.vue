<script setup lang="ts">
import { computed, onMounted, ref, useSlots } from 'vue'
import type { TypewriterParagraph, UiTypewriterProps } from './UiTypewriter.types'
import { useTypewriter } from '#composables/useTypewriter'

const props = withDefaults(defineProps<UiTypewriterProps>(), {
  paragraphs: () => [],
  speed: 24,
  paragraphPause: 260,
  startOnVisible: true,
  cursor: true,
})

const emit = defineEmits<{ done: [] }>()

const slots = useSlots()
const useSlot = computed(() => !!slots.default)

const items = computed<TypewriterParagraph[]>(() =>
  props.paragraphs.map((p) => (typeof p === 'string' ? { content: p } : p)),
)

const rootRef = ref<HTMLElement | null>(null)

const { arm } = useTypewriter(rootRef, {
  speed: () => props.speed,
  paragraphPause: () => props.paragraphPause,
  cursor: () => props.cursor,
  startOnVisible: () => props.startOnVisible,
  onDone: () => emit('done'),
})

// clear right away (pre-paint) so the SSR'd full text doesn't linger
onMounted(arm)
</script>

<template>
  <!-- full copy for screen readers; the animated copy is decorative -->
  <div class="sr-only">
    <slot v-if="useSlot" />
    <template v-else>
      <template v-for="(p, i) in items" :key="i">
        <!-- html paragraphs are an explicit trusted-markup opt-in (see types).
             always a <p> here, not <component :is>: Vue's SSR renderer silently
             drops v-html through a dynamic tag, so custom `tag` only applies
             to plain-text paragraphs below -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-if="p.html" :class="p.class" v-html="p.content" />
        <component :is="p.tag ?? 'p'" v-else :class="p.class">{{ p.content }}</component>
      </template>
    </template>
  </div>

  <div ref="rootRef" aria-hidden="true">
    <slot v-if="useSlot" />
    <template v-else>
      <template v-for="(p, i) in items" :key="i">
        <!-- html paragraphs are an explicit trusted-markup opt-in (see types).
             always a <p> here, not <component :is>: Vue's SSR renderer silently
             drops v-html through a dynamic tag, so custom `tag` only applies
             to plain-text paragraphs below -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-if="p.html" :class="p.class" v-html="p.content" />
        <component :is="p.tag ?? 'p'" v-else :class="p.class">{{ p.content }}</component>
      </template>
    </template>
  </div>
</template>

<style scoped>
[aria-hidden] :deep([data-typing])::after {
  content: '▍';
  margin-left: 1px;
  color: #0e93a8;
  animation: tw-blink 1s step-end infinite;
}
@keyframes tw-blink {
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
