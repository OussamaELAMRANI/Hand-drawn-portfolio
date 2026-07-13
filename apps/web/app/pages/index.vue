<script setup lang="ts">
import { NuxtLink } from '#components'
import {
  UiNavbar,
  CalendarBooking,
  CodeExpr,
  Experiences,
  Footer,
  HeroMe,
  Skills,
  Travels,
} from '@larevo/ui'

useHead({
  title: 'Oussama.elamrani — Senior Full-Stack Engineer',
  htmlAttrs: { class: 'scroll-smooth' },
})

const navLinks = [
  { label: 'Experience', href: '#experience' },
  { label: 'Code', href: '#code' },
  { label: 'Travels', href: '#travels' },
  { label: 'Blog', href: '/blog' },
  { label: 'Design System', href: '/design-system' },
  { label: 'Book Me', href: '#book' },
]
</script>

<template>
  <div>
    <!-- ============ NAV ============ -->
    <UiNavbar
      :links="navLinks"
      :cta="{ label: 'Hire Me', href: '#book' }"
      :link-component="NuxtLink"
    />

    <div id="top" />

    <!-- ============ HERO ============ -->
    <HeroMe />
    <!-- skills row -->
    <Skills />

    <!-- ============ ENGINEERING NOTEBOOK ============ -->
    <Experiences />

    <!-- ============ FEATURE SPOTLIGHT ============ -->
    <CodeExpr />

    <!-- ============ TRAVELS ============ -->
    <Travels />

    <!-- ============ BOOK MY TIME ============ -->
    <CalendarBooking />

    <!-- ============ FOOTER ============ -->
    <Footer />
  </div>
</template>
