<script setup lang="ts">
import type { FooterProps } from './Footer.types'
import { socialColor } from './socialColors'
import SketchBox from '#components/SketchBox/SketchBox.vue'
import Typography from '#components/Typography/Typography.vue'

withDefaults(defineProps<FooterProps>(), {
  socials: () => [
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Twitter / X', href: '#' },
  ],
  copyright: '© 2026 Oussama EL AMRANI — hand-drawn, hand-shipped.',
})
</script>

<template>
  <footer class="mx-auto max-w-[1120px] px-6 pb-[70px] pt-[50px] text-center">
    <div class="border-t-2 border-dashed border-ink-200 pt-9 dark:border-night-500">
      <div v-if="socials.length" class="mb-[22px] flex flex-wrap justify-center gap-4">
        <a
          v-for="s in socials"
          :key="s.label"
          :href="s.href"
          class="no-underline transition-transform duration-150 ease-out hover:-translate-y-0.5
                 hover:-rotate-2"
        >
          <SketchBox
            tag="span"
            :color="s.color ?? socialColor(s.label)"
            :stroke-width="2"
            class="inline-block px-[18px] py-2 font-hand text-base text-ink dark:text-chalk"
          >
            {{ s.label }}
          </SketchBox>
        </a>
      </div>
      <Typography variant="lead" as="div">
        <slot>Built with coffee <span class="text-magenta">&amp;</span> code.</slot>
      </Typography>
      <div class="mt-2 font-mono text-[11px] text-ink-300 dark:text-chalk-500">
        {{ copyright }}
      </div>
    </div>
  </footer>
</template>
