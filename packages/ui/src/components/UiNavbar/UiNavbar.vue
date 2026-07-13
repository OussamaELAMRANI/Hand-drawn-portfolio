<script setup lang="ts">
import type { UiNavbarProps } from './UiNavbar.types'
import SketchBox from '#components/SketchBox/SketchBox.vue'

withDefaults(defineProps<UiNavbarProps>(), {
  brand: 'Oussama',
  brandAccent: '.el',
  brandHref: '#top',
  links: () => [],
  cta: undefined,
})
</script>

<template>
  <nav
    class="sticky top-0 z-50 border-b-2 border-dashed border-ink-200 bg-paper/80 backdrop-blur-md
           dark:border-night-500 dark:bg-night/80"
  >
    <div class="mx-auto flex max-w-[1120px] items-center justify-between gap-5 px-6 py-3.5">
      <a
        :href="brandHref"
        class="font-display text-[34px] font-bold leading-none tracking-[.2px] text-ink
               no-underline dark:text-chalk"
      >
        <slot name="brand">{{ brand }}<span class="text-cyan">{{ brandAccent }}</span></slot>
      </a>
      <div class="hidden items-center gap-[26px] font-hand text-lg md:flex">
        <a
          v-for="l in links"
          :key="l.label"
          :href="l.href"
          class="text-ink no-underline dark:text-chalk"
        >
          {{ l.label }}
        </a>
        <a
          v-if="cta"
          :href="cta.href"
          class="no-underline transition-transform hover:-rotate-2 hover:scale-105"
        >
          <SketchBox
            tag="span"
            shape="ellipse"
            color="#C0577F"
            :stroke-width="2.4"
            class="inline-block px-5 py-[9px] font-hand text-lg text-magenta"
          >
            {{ cta.label }}
          </SketchBox>
        </a>
        <slot name="end" />
      </div>
    </div>
  </nav>
</template>