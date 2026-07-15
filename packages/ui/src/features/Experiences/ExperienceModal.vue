<script setup lang="ts">
import { watch } from 'vue'
import type { NotebookRole } from './Experiences.types'
import RichDoc from '#components/RichDoc/RichDoc.vue'
import SketchBox from '#components/SketchBox/SketchBox.vue'
import Typography from '#components/Typography/Typography.vue'
import UiCard from '#components/UiCard/UiCard.vue'
import UiChip from '#components/UiChip/UiChip.vue'

const props = defineProps<{ role: NotebookRole | null; originRect: DOMRect | null }>()
const emit = defineEmits<{ close: [] }>()

const reducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

// ── FLIP morph: the note card scales/translates out from wherever it was
// clicked, and reverses on close — no shared library, just rects + transforms.
function morphFrom(el: Element, from: DOMRect) {
  const to = el.getBoundingClientRect()
  const dx = from.left + from.width / 2 - (to.left + to.width / 2)
  const dy = from.top + from.height / 2 - (to.top + to.height / 2)
  const sx = from.width / to.width
  const sy = from.height / to.height
  return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`
}

function onBeforeEnter(el: Element) {
  const card = el as HTMLElement
  if (!props.originRect || reducedMotion()) return
  card.style.transition = 'none'
  card.style.transform = morphFrom(card, props.originRect)
  card.style.opacity = '0.5'
}

function onEnter(el: Element, done: () => void) {
  const card = el as HTMLElement
  if (!props.originRect || reducedMotion()) {
    done()
    return
  }
  void card.offsetWidth // force reflow so the "from" transform actually paints first
  card.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.9, 0.25, 1), opacity 0.25s ease-out'
  card.style.transform = 'translate(0, 0) scale(1, 1)'
  card.style.opacity = '1'
  card.addEventListener('transitionend', done, { once: true })
}

function onLeave(el: Element, done: () => void) {
  const card = el as HTMLElement
  if (!props.originRect || reducedMotion()) {
    done()
    return
  }
  card.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in'
  card.style.transform = morphFrom(card, props.originRect)
  card.style.opacity = '0'
  card.addEventListener('transitionend', done, { once: true })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.role,
  (role) => {
    if (role) document.addEventListener('keydown', onKeydown)
    else document.removeEventListener('keydown', onKeydown)
  },
)

const formatDate = (d: string | null | undefined) =>
  d
    ? new Date(d).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : undefined
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop-fade">
      <div
        v-if="role"
        class="fixed inset-0 z-[100] overflow-y-auto bg-ink/40 px-5 py-11
               backdrop-blur-[2px] dark:bg-black/60"
        @click.self="emit('close')"
      >
        <Transition
          :css="false"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave"
        >
          <div
            v-if="role"
            class="relative mx-auto w-full max-w-[680px]"
            style="transform-origin: center center"
          >
            <SketchBox
              v-if="role.endDate === null"
              tag="span"
              color="#FCE34B"
              :stroke-width="1.6"
              class="absolute -top-3 right-10 z-10 rotate-3 bg-marker px-2.5 py-1 font-hand
                     text-[13px] text-ink shadow-sticky"
            >
              I'm now at →
            </SketchBox>
            <UiCard
              variant="index"
              class="!rotate-0 hover:!translate-y-0 relative"
              :stroke-color="role.endDate === null ? '#FCE34B' : undefined"
            >
              <button
                type="button"
                class="absolute right-4 top-4 cursor-pointer border-none bg-transparent p-0
                       text-ink-400 transition-transform hover:rotate-6 hover:scale-110
                       hover:text-ink dark:text-chalk-500 dark:hover:text-chalk"
                aria-label="close"
                @click="emit('close')"
              >
                <SketchBox
                  tag="span"
                  shape="ellipse"
                  :stroke-width="1.8"
                  class="flex h-9 w-9 items-center justify-center font-hand text-lg"
                >
                  ✕
                </SketchBox>
              </button>

              <div class="mb-1.5 font-mono text-[12px] text-cyan">{{ role.period }}</div>
              <Typography variant="h2" class="!text-[38px] !leading-[1.05] pr-12">
                {{ role.title }}
              </Typography>
              <div class="mb-4 mt-1 font-hand text-[19px] text-ink-400 dark:text-chalk-500">
                {{ role.company }}
              </div>

              <RichDoc
                v-if="role.description"
                :doc="role.description"
                paragraph-class="mb-5 text-[15.5px] leading-relaxed text-ink-600 dark:text-chalk-600"
              />
              <p
                v-else
                class="mb-5 whitespace-pre-line text-[15.5px] leading-relaxed text-ink-600
                       dark:text-chalk-600"
              >
                {{ role.blurb }}
              </p>

              <UiCard v-if="role.learned" variant="callout" class="mb-5 !rotate-0">
                <div class="mb-1 font-hand text-[15px] text-magenta">what I learned</div>
                <p class="text-[14.5px] leading-relaxed text-ink-700 dark:text-chalk-700">
                  {{ role.learned }}
                </p>
              </UiCard>

              <div class="flex flex-wrap gap-1.5">
                <UiChip v-for="tag in role.tags" :key="tag">{{ tag }}</UiChip>
              </div>

              <div
                v-if="formatDate(role.startDate) || formatDate(role.endDate)"
                class="mt-5 font-mono text-[11.5px] text-ink-400 dark:text-chalk-500"
              >
                {{ formatDate(role.startDate) ?? '—' }} – {{ formatDate(role.endDate) ?? 'present' }}
              </div>
            </UiCard>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.25s ease;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .backdrop-fade-enter-active,
  .backdrop-fade-leave-active {
    transition: none;
  }
}
</style>