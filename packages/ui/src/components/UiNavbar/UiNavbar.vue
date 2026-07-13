<script setup lang="ts">
import { computed, resolveDynamicComponent } from 'vue'
import type { UiNavbarProps } from './UiNavbar.types'
import SketchBox from '#components/SketchBox/SketchBox.vue'

const props = withDefaults(defineProps<UiNavbarProps>(), {
  brand: 'Oussama',
  brandAccent: '. EL AMRANI',
  brandHref: '#top',
  links: () => [],
  cta: undefined,
  linkComponent: 'a',
})

// resolves globally registered components (e.g. Nuxt's NuxtLink) from a string
const linkIs = computed(() =>
  typeof props.linkComponent === 'string'
    ? resolveDynamicComponent(props.linkComponent)
    : props.linkComponent,
)
</script>

<template>
  <nav
    class="sticky top-0 z-50 border-b-2 border-dashed border-ink-200 bg-paper/80 backdrop-blur-md
           dark:border-night-500 dark:bg-night/80"
  >
    <div class="mx-auto flex max-w-[1120px] items-center justify-between gap-5 px-6 py-3.5">
      <component
        :is="linkIs"
        :href="brandHref"
        class="font-display text-[34px] font-bold leading-none tracking-[.2px] text-ink
               no-underline dark:text-chalk"
      >
        <slot name="brand">{{ brand }}<span class="text-cyan">{{ brandAccent }}</span></slot>
      </component>
      <div class="hidden items-center gap-[26px] font-hand text-lg md:flex">
        <component
          :is="linkIs"
          v-for="l in links"
          :key="l.label"
          :href="l.href"
          class="text-ink no-underline dark:text-chalk"
        >
          {{ l.label }}
        </component>
        <component
          :is="linkIs"
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
        </component>
        <slot name="end" />
      </div>
    </div>
  </nav>
</template>
