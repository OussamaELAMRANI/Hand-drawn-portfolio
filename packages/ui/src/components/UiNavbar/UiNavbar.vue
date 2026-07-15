<script setup lang="ts">
import { computed, ref, resolveDynamicComponent } from 'vue'
import type { UiNavbarProps } from './UiNavbar.types'
import SketchBox from '#components/SketchBox/SketchBox.vue'

const props = withDefaults(defineProps<UiNavbarProps>(), {
  brand: 'Oussama',
  brandAccent: '. EL AMRANI',
  // '/' works from any page; pages that want the homepage's scroll-to-top
  // anchor (e.g. '#top') pass brandHref explicitly
  brandHref: '/',
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

const mobileOpen = ref(false)
const closeMobile = () => (mobileOpen.value = false)
</script>

<template>
  <nav
    class="sticky top-0 z-50 border-b-2 border-dashed border-ink-200 bg-paper/80 backdrop-blur-md
           dark:border-night-500 dark:bg-night/80"
    @keydown.escape="closeMobile"
  >
    <div class="mx-auto flex max-w-[1120px] items-center justify-between gap-5 px-6 py-3.5">
      <component
        :is="linkIs"
        :href="brandHref"
        class="font-display text-[34px] font-bold leading-none tracking-[.2px] text-ink
               no-underline dark:text-chalk"
        @click="closeMobile"
      >
        <slot name="brand">{{ brand }}<span class="text-cyan">{{ brandAccent }}</span></slot>
      </component>

      <!-- desktop links -->
      <div class="hidden items-center gap-[26px] font-hand text-lg md:flex">
        <component
          :is="linkIs"
          v-for="l in links"
          :key="l.label"
          :href="l.href"
          class="text-ink no-underline dark:text-chalk"
          :class="l.class"
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

      <!-- mobile toggle -->
      <button
        type="button"
        class="relative flex h-9 w-9 shrink-0 cursor-pointer flex-col items-center
               justify-center gap-[5px] border-none bg-transparent p-0 md:hidden"
        :aria-expanded="mobileOpen"
        aria-label="toggle menu"
        @click="mobileOpen = !mobileOpen"
      >
        <span
          class="h-[2px] w-6 bg-ink transition-transform duration-200 dark:bg-chalk"
          :class="mobileOpen ? 'translate-y-[7px] rotate-45' : ''"
        />
        <span
          class="h-[2px] w-6 bg-ink transition-opacity duration-200 dark:bg-chalk"
          :class="mobileOpen ? 'opacity-0' : ''"
        />
        <span
          class="h-[2px] w-6 bg-ink transition-transform duration-200 dark:bg-chalk"
          :class="mobileOpen ? '-translate-y-[7px] -rotate-45' : ''"
        />
      </button>
    </div>

    <!-- mobile panel -->
    <div
      v-if="mobileOpen"
      class="flex flex-col gap-4 border-t-2 border-dashed border-ink-200 bg-paper px-6 py-5
             font-hand text-lg md:hidden dark:border-night-500 dark:bg-night"
    >
      <component
        :is="linkIs"
        v-for="l in links"
        :key="l.label"
        :href="l.href"
        class="text-ink no-underline dark:text-chalk"
        :class="l.class"
        @click="closeMobile"
      >
        {{ l.label }}
      </component>
      <component
        :is="linkIs"
        v-if="cta"
        :href="cta.href"
        class="self-start no-underline"
        @click="closeMobile"
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
      <div class="flex flex-col gap-3 border-t border-dashed border-ink-100 pt-3 dark:border-night-500">
        <slot name="end" />
      </div>
    </div>
  </nav>
</template>
