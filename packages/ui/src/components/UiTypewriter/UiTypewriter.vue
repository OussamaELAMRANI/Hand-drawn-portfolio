<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'
import type { TypewriterParagraph, UiTypewriterProps } from './UiTypewriter.types'

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
let stopped = false
let io: IntersectionObserver | undefined

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

interface Entry {
  node: Text
  full: string
}

// typing works on text nodes, so nested markup and components keep their
// tags/classes while only the visible characters accumulate
function collect(root: HTMLElement): Entry[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const entries: Entry[] = []
  let n: Node | null
  while ((n = walker.nextNode())) {
    const t = n as Text
    if (t.data.trim()) entries.push({ node: t, full: t.data })
  }
  return entries
}

let entries: Entry[] = []
let started = false

async function type() {
  if (started) return
  started = true
  for (const e of entries) {
    const holder = e.node.parentElement
    if (props.cursor) holder?.setAttribute('data-typing', '')
    for (let i = 1; i <= e.full.length; i++) {
      if (stopped) return
      e.node.data = e.full.slice(0, i)
      const ch = e.full[i - 1]
      await sleep(ch === '.' || ch === '!' || ch === '?' ? props.speed * 6 : props.speed)
    }
    holder?.removeAttribute('data-typing')
    if (stopped) return
    await sleep(props.paragraphPause)
  }
  emit('done')
}

onMounted(() => {
  const root = rootRef.value
  if (!root) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    emit('done')
    return
  }
  // clear right away (pre-paint) so the SSR'd full text doesn't linger
  entries = collect(root)
  entries.forEach((e) => (e.node.data = ''))

  if (!props.startOnVisible) {
    void type()
    return
  }
  io = new IntersectionObserver(
    (ents) => {
      if (ents.some((e) => e.isIntersecting)) {
        io?.disconnect()
        void type()
      }
    },
    { threshold: 0.2 },
  )
  io.observe(root)
})

onBeforeUnmount(() => {
  stopped = true
  io?.disconnect()
})
</script>

<template>
  <!-- full copy for screen readers; the animated copy is decorative -->
  <div class="sr-only">
    <slot v-if="useSlot" />
    <template v-else>
      <template v-for="(p, i) in items" :key="i">
        <!-- html paragraphs are an explicit trusted-markup opt-in (see types) -->
        <!-- eslint-disable-next-line vue/no-v-html, vue/no-v-text-v-html-on-component -->
        <component :is="p.tag ?? 'p'" v-if="p.html" :class="p.class" v-html="p.content" />
        <component :is="p.tag ?? 'p'" v-else :class="p.class">{{ p.content }}</component>
      </template>
    </template>
  </div>

  <div ref="rootRef" aria-hidden="true">
    <slot v-if="useSlot" />
    <template v-else>
      <template v-for="(p, i) in items" :key="i">
        <!-- html paragraphs are an explicit trusted-markup opt-in (see types) -->
        <!-- eslint-disable-next-line vue/no-v-html, vue/no-v-text-v-html-on-component -->
        <component :is="p.tag ?? 'p'" v-if="p.html" :class="p.class" v-html="p.content" />
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
