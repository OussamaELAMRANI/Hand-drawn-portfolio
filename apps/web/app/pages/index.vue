<script setup lang="ts">
import { NuxtLink } from '#components'
import {
  UiNavbar,
  CalendarBooking,
  CodeExpr,
  Experiences,
  Footer,
  HeroMe,
  ReadingProgress,
  Skills,
  Travels,
} from '@larevo/ui'
import type { BookingFormPayload, BookingSlot, NotebookRole } from '@larevo/ui'
import type { ApiExperience, ApiOverview } from '~/types'

useHead({ htmlAttrs: { class: 'scroll-smooth' } })

const { user, isAdmin, logout } = useAuth()
const { public: publicConfig } = useRuntimeConfig()
const { data: overview } = await useFetch<ApiOverview | null>('/api/overview')
const { data: experiences } = await useFetch<ApiExperience[]>('/api/experiences')

const pageTitle = 'Oussama EL AMRANI — Senior Full-Stack Engineer'
// mirrors HeroMe.vue's defaultBio and nuxt.config's site.description — used
// until an admin saves real overview copy
const FALLBACK_DESCRIPTION =
  'Senior Full-Stack Engineer. I ship end-to-end with TypeScript / Node.js on the back, ' +
  'Next.js, Nuxt & Vue on the front, and lean on DDD, Postgres and clean test suites to keep it honest.'
const pageDescription = computed(() => {
  const plain = richTextToPlain(overview.value?.bio)
  if (!plain) return FALLBACK_DESCRIPTION
  if (plain.length <= 155) return plain
  return `${plain.slice(0, 155).replace(/\s+\S*$/, '').trimEnd()}…`
})

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'profile',
  twitterCard: 'summary_large_image',
})
defineOgImageComponent('Default', { title: pageTitle, description: pageDescription })

// the "Engineering Notebook" card shape (period/title/company/blurb) predates
// the API — map the DB record into it here rather than reshaping the component
function toNotebookRole(e: ApiExperience): NotebookRole {
  const blurb = richTextToPlain(e.description)
  return {
    id: e.id,
    period: `${formatMonth(e.startDate) || '—'} — ${formatMonth(e.endDate) || 'now'}`,
    title: e.title,
    company: e.roles.join(' · ') || 'Freelance',
    blurb: blurb.length > 160 ? `${blurb.slice(0, 160).trimEnd()}…` : blurb,
    tags: e.tags,
    description: e.description ?? undefined,
    learned: e.learned ?? undefined,
    startDate: e.startDate,
    endDate: e.endDate,
  }
}

const notebookRoles = computed<NotebookRole[] | undefined>(() =>
  experiences.value?.length ? experiences.value.map(toNotebookRole) : undefined,
)

const bookingTaken = ref<BookingSlot[]>([])
const bookingSubmitting = ref(false)
const bookingError = ref<string | null>(null)
const bookingConfirmed = ref(false)

async function onBookingMonthChange(year: number, month: number) {
  bookingTaken.value = await $fetch<BookingSlot[]>('/api/bookings', { query: { year, month } })
}

async function onBookingSubmit(payload: BookingFormPayload) {
  bookingSubmitting.value = true
  bookingError.value = null
  try {
    await $fetch('/api/bookings', { method: 'POST', body: payload })
    bookingConfirmed.value = true
  } catch (e) {
    bookingError.value =
      (e as { data?: { statusMessage?: string } }).data?.statusMessage ?? 'Something went wrong — try again'
  } finally {
    bookingSubmitting.value = false
  }
}

function onBookingReset() {
  bookingConfirmed.value = false
  bookingError.value = null
}

const navLinks = [
  { label: 'Experience', href: '#experience' },
  { label: 'Code', href: '#code' },
  { label: 'Travels', href: '#travels' },
  { label: 'Blog', href: '/blog' },
  { label: 'Design System', href: '/design-system' },
]
</script>

<template>
  <div>
    <!-- ============ NAV ============ -->
    <UiNavbar
      brand-href="#top"
      :links="navLinks"
      :cta="{ label: 'Hire Me', href: '#book' }"
      :link-component="NuxtLink"
    >
      <template #end>
        <template v-if="user">
          <NuxtLink
            v-if="isAdmin"
            to="/admin"
            class="font-hand text-lg text-cyan underline decoration-wavy underline-offset-4
                   transition-colors hover:text-magenta"
          >
            ✎ Admin
          </NuxtLink>
          <button
            class="cursor-pointer font-hand text-lg text-ink-400 transition-colors
                   hover:text-magenta dark:text-chalk-500"
            @click="logout()"
          >
            logout
          </button>
        </template>
        <NuxtLink
          v-else
          to="/login"
          class="font-hand text-lg text-ink-400 no-underline transition-colors hover:text-cyan
                 dark:text-chalk-500"
        >
          login
        </NuxtLink>
      </template>
    </UiNavbar>
    <ReadingProgress />

    <div id="top" />

    <!-- ============ HERO ============ -->
    <HeroMe
      :name="overview?.name"
      :tagline="overview?.tagline"
      :bio="overview?.bio"
      :cards="overview?.cards"
    />
    <!-- skills row -->
    <Skills />

    <!-- ============ ENGINEERING NOTEBOOK ============ -->
    <Experiences :roles="notebookRoles" />

    <!-- ============ FEATURE SPOTLIGHT ============ -->
    <CodeExpr />

    <!-- ============ TRAVELS ============ -->
    <Travels />

    <!-- ============ BOOK MY TIME ============ -->
    <CalendarBooking
      :taken-slots="bookingTaken"
      :submitting="bookingSubmitting"
      :error="bookingError"
      :confirmed="bookingConfirmed"
      :captcha-site-key="publicConfig.turnstileSiteKey"
      @month-change="onBookingMonthChange"
      @book="onBookingSubmit"
      @reset="onBookingReset"
    />

    <!-- ============ FOOTER ============ -->
    <Footer />
  </div>
</template>
