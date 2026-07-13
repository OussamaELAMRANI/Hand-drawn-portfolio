<script setup lang="ts">
import CommentCode from '#components/CommentCode/CommentCode.vue'
import UiButton from '#components/UiButton/UiButton.vue'
import UiHighlight from '#components/UiHighlight/UiHighlight.vue'
import UiLink from '#components/UiLink/UiLink.vue'
import UiTypewriter from '#components/UiTypewriter/UiTypewriter.vue'
import { SwipeDeck, type SwipeCardItem } from '../SwipeDeck'

const heroCards: SwipeCardItem[] = [
  { caption: 'code · coffee · airports', note: '— the daily loop' },
  { caption: 'Lisbon', note: 'shipped from a rooftop' },
  { caption: 'Marrakech', note: 'home base & mint tea' },
  { caption: 'Bali', note: 'standups at sunrise' },
]
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
        Oussama <span class="whitespace-nowrap">EL AMRANI</span><span class="text-magenta">.</span>
      </h1>
      <UiTypewriter :speed="18">
        <p class="mb-[22px] max-w-[30ch] font-display text-[32px] leading-[1.15]">
          I build <UiHighlight class="text-[32px]">solid web products</UiHighlight> &amp; chase
          good light in far-off places.
        </p>
        <p class="mb-[30px] max-w-[52ch] text-body text-ink-600 dark:text-chalk-600">
          Senior Full-Stack Engineer. I ship end-to-end with
          <strong>TypeScript / Node.js</strong> on the back,
          <strong>Next.js, Nuxt &amp; Vue</strong> on the front, and lean on
          <strong>DDD</strong>, Postgres and clean test suites to keep it honest.
        </p>
      </UiTypewriter>
      <div class="flex flex-wrap items-center gap-[18px]">
        <UiButton href="#code" variant="sketch">See my work →</UiButton>
        <UiLink href="#book" class="font-hand text-[19px]">or book a chat</UiLink>
      </div>
    </div>

    <!-- polaroid deck -->
    <div class="justify-self-center">
      <SwipeDeck :cards="heroCards" class="w-[270px]" />
    </div>
  </section>
</template>
