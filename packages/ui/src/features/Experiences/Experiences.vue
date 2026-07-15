<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { EngineeringNotebookProps, NotebookRole } from './Experiences.types'
import ExperienceModal from './ExperienceModal.vue'
import SketchBox from '#components/SketchBox/SketchBox.vue'
import Typography from '#components/Typography/Typography.vue'
import UiCard from '#components/UiCard/UiCard.vue'
import UiChip from '#components/UiChip/UiChip.vue'
import UiLink from '#components/UiLink/UiLink.vue'

const props = withDefaults(defineProps<EngineeringNotebookProps>(), {
  title: 'The Engineering Notebook',
  subtitle: '— pages torn from the last few years of shipping.',
  moreHref: '/experience',
  moreLabel: 'read the full story →',
  maxGrid: 4,
  roles: () => [
    {
      period: '2022 — now',
      title: 'Senior Full-Stack Engineer',
      company: 'Freelance · Remote',
      blurb:
        'Architecting TypeScript/Node services and Next.js + Nuxt frontends for product teams. DDD, clean boundaries, high test coverage.',
      tags: ['TypeScript', 'Next.js', 'DDD'],
    },
    {
      period: '2019 — 2022',
      title: 'Full-Stack Developer',
      company: 'Digital Agency',
      blurb:
        'Built and scaled Symfony + Vue apps on Postgres & Redis. Owned CI, caching layers and API design across a dozen client products.',
      tags: ['Symfony', 'Vue.js', 'Redis'],
    },
    {
      period: '2017 — 2019',
      title: 'Web Developer',
      company: 'Product Startup',
      blurb:
        'Shipped Laravel/MySQL backends and my first React frontends. Learned to move fast without breaking the important things.',
      tags: ['Laravel', 'React', 'MySQL'],
    },
    {
      period: '2017 — 2019',
      title: 'Web Developer',
      company: 'Product Startup',
      blurb:
        'Shipped Laravel/MySQL backends and my first React frontends. Learned to move fast without breaking the important things.',
      tags: ['Laravel', 'React', 'MySQL'],
    },
    {
      period: '2017 — 2019',
      title: 'Web Developer',
      company: 'Product Startup',
      blurb:
        'Shipped Laravel/MySQL backends and my first React frontends. Learned to move fast without breaking the important things.',
      tags: ['Laravel', 'React', 'MySQL'],
    },
  ],
})

// long histories slide instead of stacking rows of cards
const asSlider = computed(() => props.roles.length > props.maxGrid)

// ── slider: 3 cards per view on md+ (1 on mobile), stepping one card at a time ──
const visibleCount = ref(3)
const index = ref(0)
const maxIndex = computed(() => Math.max(0, props.roles.length - visibleCount.value))
const canPrev = computed(() => index.value > 0)
const canNext = computed(() => index.value < maxIndex.value)

// the track is viewport-wide, so one card = 100/visibleCount % of it
const trackStyle = computed(() => ({
  transform: `translateX(-${index.value * (100 / visibleCount.value)}%)`,
}))

let mq: MediaQueryList | undefined
function applyViewport() {
  visibleCount.value = (mq?.matches ?? true) ? 3 : 1
  index.value = Math.min(index.value, maxIndex.value)
}
onMounted(() => {
  mq = window.matchMedia('(min-width: 768px)')
  applyViewport()
  mq.addEventListener('change', applyViewport)
})
onUnmounted(() => mq?.removeEventListener('change', applyViewport))

const prev = () => canPrev.value && index.value--
const next = () => canNext.value && index.value++

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}

const sliderLabel = computed(
  () =>
    `Roles, showing ${Math.min(visibleCount.value, props.roles.length)} of ${props.roles.length}. ` +
    'Use the arrows to browse.',
)

// ── expand a note into the morph modal, from wherever it was clicked ──
const expandedRole = ref<NotebookRole | null>(null)
const originRect = ref<DOMRect | null>(null)

function openRole(role: NotebookRole, e: Event) {
  originRect.value = (e.currentTarget as HTMLElement).getBoundingClientRect()
  expandedRole.value = role
}
function closeRole() {
  expandedRole.value = null
}
</script>

<template>
  <section id="experience" class="mx-auto max-w-[1120px] px-6 pb-[30px] pt-[60px]">
    <Typography variant="h2" class="!text-[52px]">{{ title }}</Typography>
    <div class="mb-10 mt-2 flex flex-wrap items-center justify-between gap-4">
      <p class="-rotate-[0.6deg] font-hand text-[19px] text-ink-400 dark:text-chalk-500">
        {{ subtitle }}
      </p>
      <UiLink v-if="moreHref" :href="moreHref" class="whitespace-nowrap font-hand text-lg">
        {{ moreLabel }}
      </UiLink>
    </div>

    <!-- slider when the history outgrows the grid -->
    <div v-if="asSlider">
      <div
        class="overflow-hidden outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
        tabindex="0"
        role="group"
        aria-roledescription="carousel"
        :aria-label="sliderLabel"
        @keydown="onKeydown"
      >
        <div
          class="flex flex-nowrap pb-4 pt-4 transition-transform duration-300 ease-out"
          :style="trackStyle"
        >
          <div
            v-for="(role, i) in roles"
            :key="i"
            class="relative shrink-0 basis-full px-[13px] md:basis-1/3"
            :aria-hidden="i < index || i >= index + visibleCount ? 'true' : undefined"
          >
            <SketchBox
              v-if="role.endDate === null"
              tag="span"
              color="#FCE34B"
              :stroke-width="1.6"
              class="absolute -top-2 z-10 rotate-3 bg-marker px-2.5 py-1 font-hand text-[12.5px] text-ink shadow-sticky"
            >
              I'm now at &#8594;
            </SketchBox>
            <UiCard
              variant="index"
              class="h-full cursor-pointer"
              :stroke-color="role.endDate === null ? '#FCE34B' : undefined"
              role="button"
              tabindex="0"
              :aria-label="`read the full note — ${role.title}`"
              @click="openRole(role, $event)"
              @keydown.enter="openRole(role, $event)"
              @keydown.space.prevent="openRole(role, $event)"
            >
              <div class="mb-1.5 font-mono text-[11.5px] text-cyan">{{ role.period }}</div>
              <div class="font-display text-[30px] leading-[1.05]">{{ role.title }}</div>
              <div class="mb-3 font-hand text-[17px] text-ink-400 dark:text-chalk-500">
                {{ role.company }}
              </div>
              <p class="mb-3 text-[14.5px] text-ink-600 dark:text-chalk-600">{{ role.blurb }}</p>
              <div class="flex flex-wrap gap-1.5">
                <UiChip v-for="tag in role.tags" :key="tag">{{ tag }}</UiChip>
              </div>
            </UiCard>
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-center gap-4">
        <button
          type="button"
          class="border-none bg-transparent p-0 text-ink transition-transform dark:text-chalk"
          :class="canPrev ? 'cursor-pointer hover:-rotate-6 hover:scale-110' : 'opacity-40'"
          :disabled="!canPrev"
          aria-label="previous roles"
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
          aria-label="next roles"
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

    <!-- pinned card grid -->
    <div v-else class="grid gap-[26px] md:grid-cols-3">
      <div v-for="(role, i) in roles" :key="i" class="relative">
        <SketchBox
          v-if="role.endDate === null"
          tag="span"
          color="#FCE34B"
          :stroke-width="1.6"
          class="absolute -top-2 right-7 z-10 rotate-3 bg-marker px-2.5 py-1 font-hand text-[12.5px] text-ink shadow-sticky"
        >
          I'm now at →
        </SketchBox>
        <UiCard
          variant="index"
          class="cursor-pointer"
          :stroke-color="role.endDate === null ? '#FCE34B' : undefined"
          role="button"
          tabindex="0"
          :aria-label="`read the full note — ${role.title}`"
          @click="openRole(role, $event)"
          @keydown.enter="openRole(role, $event)"
          @keydown.space.prevent="openRole(role, $event)"
        >
          <div class="mb-1.5 font-mono text-[11.5px] text-cyan">{{ role.period }}</div>
          <div class="font-display text-[30px] leading-[1.05]">{{ role.title }}</div>
          <div class="mb-3 font-hand text-[17px] text-ink-400 dark:text-chalk-500">
            {{ role.company }}
          </div>
          <p class="mb-3 text-[14.5px] text-ink-600 dark:text-chalk-600">{{ role.blurb }}</p>
          <div class="flex flex-wrap gap-1.5">
            <UiChip v-for="tag in role.tags" :key="tag">{{ tag }}</UiChip>
          </div>
        </UiCard>
      </div>
    </div>

    <ExperienceModal :role="expandedRole" :origin-rect="originRect" @close="closeRole" />
  </section>
</template>
