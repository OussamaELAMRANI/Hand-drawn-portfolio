<script lang="ts">
import type { JSONContent } from '../../components/UiEditor/UiEditor.types'
import type { SwipeCardItem } from '../SwipeDeck/SwipeDeck.types'

// `defineProps()` defaults are hoisted out of setup(), so these live in a
// plain <script> block (true module scope) instead of <script setup>.
export const defaultTagline: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'I build ' },
        { type: 'text', text: 'solid web products', marks: [{ type: 'highlight' }] },
        { type: 'text', text: ' & chase good light in far-off places.' },
      ],
    },
  ],
}

export const defaultBio: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Senior Full-Stack Engineer. I ship end-to-end with ' },
        { type: 'text', text: 'TypeScript / Node.js', marks: [{ type: 'bold' }] },
        { type: 'text', text: ' on the back, ' },
        { type: 'text', text: 'Next.js, Nuxt & Vue', marks: [{ type: 'bold' }] },
        { type: 'text', text: ' on the front, and lean on ' },
        { type: 'text', text: 'DDD', marks: [{ type: 'bold' }] },
        { type: 'text', text: ', Postgres and clean test suites to keep it honest.' },
      ],
    },
  ],
}

export const defaultCards: SwipeCardItem[] = [
  { caption: 'code · coffee · airports', note: '— the daily loop' },
  { caption: 'Lisbon', note: 'shipped from a rooftop' },
  { caption: 'Marrakech', note: 'home base & mint tea' },
  { caption: 'Bali', note: 'standups at sunrise' },
]
</script>

<script setup lang="ts">
import CommentCode from '#components/CommentCode/CommentCode.vue'
import UiButton from '#components/UiButton/UiButton.vue'
import UiLink from '#components/UiLink/UiLink.vue'
import UiTypewriter from '#components/UiTypewriter/UiTypewriter.vue'
import RichDoc from '#components/RichDoc/RichDoc.vue'
import { SwipeDeck } from '../SwipeDeck'
import type { HeroMeProps } from './HeroMe.types'

withDefaults(defineProps<HeroMeProps>(), {
  name: 'Oussama EL AMRANI',
  tagline: () => defaultTagline,
  bio: () => defaultBio,
  cards: () => defaultCards,
})
</script>

<template>
  <section
    class="mx-auto grid max-w-[1120px] items-center gap-14 px-6 pb-10 pt-20 md:grid-cols-[1.3fr_0.9fr]"
  >
    <div>
      <CommentCode :rotate="-1.5">hey there, I'm</CommentCode>
      <h1
        class="mb-[18px] mt-2 font-display text-[56px] font-bold leading-[0.98] tracking-[.5px] md:text-[72px]"
      >
        {{ name }}<span class="text-magenta">.</span>
      </h1>
      <UiTypewriter :speed="18">
        <RichDoc
          :doc="tagline"
          paragraph-class="mb-[22px] max-w-[30ch] font-display text-[32px] leading-[1.15]"
        />
        <RichDoc
          :doc="bio"
          paragraph-class="mb-[30px] max-w-[52ch] text-body text-ink-600 dark:text-chalk-600"
        />
      </UiTypewriter>
      <div class="flex flex-wrap items-center gap-[18px]">
        <UiButton href="#code" variant="sketch">See my work →</UiButton>
        <UiLink href="#book" class="font-hand text-[19px]">or book a chat</UiLink>
      </div>
    </div>

    <!-- polaroid deck -->
    <div class="justify-self-center">
      <SwipeDeck :cards="cards" class="w-[270px]" />
    </div>
  </section>
</template>
