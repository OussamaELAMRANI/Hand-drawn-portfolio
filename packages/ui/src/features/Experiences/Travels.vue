<script setup lang="ts">
import type { TravelsProps } from './Travels.types'
import SketchBox from '#components/SketchBox/SketchBox.vue'
import Typography from '#components/Typography/Typography.vue'
import UiCard from '#components/UiCard/UiCard.vue'
import UiLink from '#components/UiLink/UiLink.vue'

withDefaults(defineProps<TravelsProps>(), {
  trips: () => [
    { place: 'Lisbon', note: 'shipped from a rooftop' },
    { place: 'Marrakech', note: 'home base & mint tea' },
    { place: 'Bali', note: 'standups at sunrise' },
    { place: 'Tokyo', note: 'best wifi on earth' },
  ],
  title: 'Travels & Adventures',
  subtitle: '— remote work means the office moves. Perspective ships with the code.',
  moreHref: '/travels',
  moreLabel: 'full travel log →',
  showMap: true,
})
</script>

<template>
  <section id="travels" class="mx-auto max-w-[1120px] px-6 pb-10 pt-[60px]">
    <Typography variant="h2" class="!text-[52px]">{{ title }}</Typography>
    <div class="mb-[34px] mt-2 flex flex-wrap items-center justify-between gap-4">
      <p class="-rotate-[0.5deg] font-hand text-[19px] text-ink-400 dark:text-chalk-500">
        {{ subtitle }}
      </p>
      <UiLink v-if="moreHref" :href="moreHref" class="whitespace-nowrap font-hand text-lg">
        {{ moreLabel }}
      </UiLink>
    </div>

    <SketchBox
      v-if="showMap"
      color="#b9b9af"
      :stroke-width="1.6"
      class="mb-9 bg-paper-100 p-[22px] dark:bg-night-800"
    >
      <div
        class="flex aspect-[16/5.2] items-center justify-center
               bg-[repeating-linear-gradient(-45deg,#eef0ea_0_12px,#f6f7f2_12px_24px)]
               dark:bg-[repeating-linear-gradient(-45deg,#262931_0_12px,#20232a_12px_24px)]"
      >
        <span class="px-4 text-center font-mono text-xs text-ink-300 dark:text-chalk-500">
          [ world map sketch — pins: {{ trips.map((t) => t.place).join(' · ') }} ]
        </span>
      </div>
    </SketchBox>

    <div class="grid grid-cols-2 gap-[22px] md:grid-cols-4">
      <UiCard v-for="trip in trips" :key="trip.place" variant="polaroid">
        <img
          v-if="trip.image"
          :src="trip.image"
          :alt="trip.alt ?? trip.place"
          class="aspect-square w-full object-cover"
        />
        <div
          v-else
          class="flex aspect-square items-center justify-center
                 bg-[repeating-linear-gradient(45deg,#efefe8_0_9px,#f7f7f1_9px_18px)]
                 dark:bg-[repeating-linear-gradient(45deg,#262931_0_9px,#20232a_9px_18px)]"
        >
          <span class="font-mono text-[10px] text-ink-300 dark:text-chalk-500">[ photo ]</span>
        </div>
        <div class="mt-2 font-display text-2xl leading-none">{{ trip.place }}</div>
        <div v-if="trip.note" class="font-hand text-[13px] text-ink-400 dark:text-chalk-500">
          {{ trip.note }}
        </div>
      </UiCard>
    </div>
  </section>
</template>
