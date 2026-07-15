<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SwipeCardItem, SwipeDeckProps } from './SwipeDeck.types'
import SketchBox from '#components/SketchBox/SketchBox.vue'
import UiPin from '#components/UiPin/UiPin.vue'
import UiTape from '#components/UiTape/UiTape.vue'

const props = withDefaults(defineProps<SwipeDeckProps>(), {
  loop: true,
  depth: 2,
  controls: true,
  accent: 'tape',
  dragOn: 'touch',
})

const emit = defineEmits<{
  swipe: [card: SwipeCardItem, direction: 'left' | 'right']
  empty: []
}>()

const order = ref<number[]>(props.cards.map((_, i) => i))
watch(
  () => props.cards,
  (cards) => (order.value = cards.map((_, i) => i)),
)

const visible = computed(() =>
  order.value.slice(0, props.depth + 1).flatMap((idx) => {
    const card = props.cards[idx]
    return card ? [{ idx, card }] : []
  }),
)

// stack slots: fanned out sideways so the deck reads as a pile of polaroids
const STACK = [
  { x: 0, y: 0, r: 0 },
  { x: 13, y: 9, r: 2.8 },
  { x: -12, y: 8, r: -2.6 },
  { x: 10, y: 11, r: 2 },
]
const slot = (i: number) => STACK[Math.min(i, STACK.length - 1)]!

// ── drag state ──
const THRESHOLD = 90
const dx = ref(0)
const dy = ref(0)
const dragging = ref(false)
const flying = ref(false)
const resetting = ref(false)
let startX = 0
let startY = 0

const progress = computed(() => Math.min(Math.abs(dx.value) / THRESHOLD, 1))

const topStyle = computed(() => ({
  transform: `translate(${dx.value}px, ${dy.value}px) rotate(${dx.value * 0.06}deg)`,
  transition: dragging.value || resetting.value ? 'none' : 'transform .3s ease',
}))

function behindStyle(i: number) {
  // as the top card leaves, each card below slides one slot up the fan
  const p = dragging.value || flying.value ? progress.value : 0
  const from = slot(i)
  const to = slot(i - 1)
  const x = from.x + (to.x - from.x) * p
  const y = from.y + (to.y - from.y) * p
  const r = from.r + (to.r - from.r) * p
  return {
    transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${1 - (i - p) * 0.03})`,
    transition: dragging.value ? 'none' : 'transform .3s ease',
  }
}

const canNext = computed(() => order.value.length > (props.loop ? 1 : 0))
const canPrev = computed(() => order.value.length > 1)

function onPointerDown(e: PointerEvent) {
  if (flying.value) return
  if (props.dragOn === 'touch' && e.pointerType !== 'touch') return
  dragging.value = true
  startX = e.clientX
  startY = e.clientY
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  dx.value = e.clientX - startX
  dy.value = (e.clientY - startY) * 0.4
}

function onPointerUp() {
  if (!dragging.value) return
  dragging.value = false
  if (Math.abs(dx.value) > THRESHOLD) {
    flyOut(dx.value > 0 ? 'right' : 'left')
  } else {
    dx.value = 0
    dy.value = 0
  }
}

/** settle the (new) top card into place without animating across the screen */
function snapReset() {
  resetting.value = true
  dy.value = 0
  flying.value = false
  requestAnimationFrame(() => {
    requestAnimationFrame(() => (resetting.value = false))
  })
}

function flyOut(direction: 'left' | 'right') {
  const top = visible.value[0]
  if (!top || flying.value) return
  flying.value = true
  dx.value = (direction === 'right' ? 1 : -1) * 640
  emit('swipe', top.card, direction)
  window.setTimeout(() => {
    const [head, ...rest] = order.value
    order.value = props.loop && head !== undefined ? [...rest, head] : rest
    if (!order.value.length) emit('empty')
    dx.value = 0
    snapReset()
  }, 300)
}

/** bring the card at the back of the deck back on top, sliding in from the left */
function prev() {
  if (flying.value || !canPrev.value) return
  const last = order.value[order.value.length - 1]
  if (last === undefined) return
  flying.value = true
  resetting.value = true
  dx.value = -640
  order.value = [last, ...order.value.slice(0, -1)]
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      resetting.value = false
      dx.value = 0
      dy.value = 0
      flying.value = false
    })
  })
}

function next() {
  if (canNext.value) flyOut('right')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}
</script>

<template>
  <div class="select-none">
    <div
      class="relative outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
      tabindex="0"
      role="group"
      aria-roledescription="card deck"
      :aria-label="`Photo deck, ${cards.length} cards. Swipe or use the arrows to browse.`"
      @keydown="onKeydown"
    >
      <div
        v-for="(v, i) in visible"
        :key="v.idx"
        class="touch-none"
        :class="[
          i === 0 ? 'relative' : 'absolute inset-0',
          i === 0 && dragOn === 'all' && 'cursor-grab active:cursor-grabbing',
        ]"
        :style="[i === 0 ? topStyle : behindStyle(i), { zIndex: visible.length - i }]"
        v-on="
          i === 0
            ? {
                pointerdown: onPointerDown,
                pointermove: onPointerMove,
                pointerup: onPointerUp,
                pointercancel: onPointerUp,
              }
            : {}
        "
      >
        <SketchBox
          :stroke-width="1.8"
          class="bg-white px-3 pb-4 pt-3 dark:bg-night-800"
          :class="i === 0 ? 'shadow-lifted' : 'shadow-sticky'"
        >
          <UiTape v-if="accent === 'tape'" class="absolute -top-[11px] left-1/2 -translate-x-1/2" />
          <UiPin
            v-else-if="accent === 'pin'"
            class="absolute -top-[9px] left-1/2 -translate-x-1/2"
          />
          <slot :card="v.card" :index="v.idx">
            <img
              v-if="v.card.image"
              :src="v.card.image"
              :alt="v.card.alt ?? v.card.caption ?? ''"
              draggable="false"
              class="pointer-events-none aspect-square w-full object-cover"
            />
            <div
              v-else
              class="flex aspect-square items-center justify-center bg-[repeating-linear-gradient(45deg,#efefe8_0_9px,#f7f7f1_9px_18px)] dark:bg-[repeating-linear-gradient(45deg,#262931_0_9px,#20232a_9px_18px)]"
            >
              <span class="font-mono text-[10px] text-ink-300 dark:text-chalk-500">[ photo ]</span>
            </div>
            <div
              v-if="v.card.caption"
              class="mt-2 font-display text-2xl leading-none"
            >
              {{ v.card.caption }}
            </div>
            <div v-if="v.card.note" class="font-hand text-[13px] text-ink-400 dark:text-chalk-500">
              {{ v.card.note }}
            </div>
          </slot>
        </SketchBox>
      </div>

      <!-- non-loop decks can run out -->
      <SketchBox
        v-if="!visible.length"
        color="#b9b9af"
        :stroke-width="1.5"
        class="flex aspect-square items-center justify-center bg-paper-100 dark:bg-night-800"
      >
        <span class="-rotate-2 font-hand text-[17px] text-ink-400 dark:text-chalk-500">
          that's all!
        </span>
      </SketchBox>
    </div>

    <!-- desktop controls; mobile swipes instead -->
    <div v-if="controls" class="mt-5 hidden justify-center gap-4 md:flex">
      <button
        type="button"
        class="border-none bg-transparent p-0 text-ink transition-transform dark:text-chalk"
        :class="canPrev ? 'cursor-pointer hover:-rotate-6 hover:scale-110' : 'opacity-40'"
        :disabled="!canPrev"
        aria-label="previous card"
        @click="prev"
      >
        <SketchBox
          tag="span"
          shape="ellipse"
          :stroke-width="1.8"
          class="flex h-10 w-10 items-center justify-center font-hand text-xl"
        >
          ←
        </SketchBox>
      </button>
      <button
        type="button"
        class="border-none bg-transparent p-0 text-ink transition-transform dark:text-chalk"
        :class="canNext ? 'cursor-pointer hover:rotate-6 hover:scale-110' : 'opacity-40'"
        :disabled="!canNext"
        aria-label="next card"
        @click="next"
      >
        <SketchBox
          tag="span"
          shape="ellipse"
          :stroke-width="1.8"
          class="flex h-10 w-10 items-center justify-center font-hand text-xl"
        >
          →
        </SketchBox>
      </button>
    </div>
  </div>
</template>
