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
import type { BookingFormPayload, BookingSlot, NotebookRole } from '@larevo/ui'
import type { ApiExperience, ApiOverview } from '~/types'

useHead({
  title: 'Oussama.elamrani — Senior Full-Stack Engineer',
  htmlAttrs: { class: 'scroll-smooth' },
})

const { user, isAdmin, logout } = useAuth()
const { data: overview } = await useFetch<ApiOverview | null>('/api/overview')
const { data: experiences } = await useFetch<ApiExperience[]>('/api/experiences')

// the "Engineering Notebook" card shape (period/title/company/blurb) predates
// the API — map the DB record into it here rather than reshaping the component
function formatYear(d: string | null) {
  return d ? new Date(d).getFullYear().toString() : undefined
}

function toNotebookRole(e: ApiExperience): NotebookRole {
  const blurb = richTextToPlain(e.description)
  return {
    id: e.id,
    period: `${formatYear(e.startDate) ?? '—'} — ${formatYear(e.endDate) ?? 'now'}`,
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
      @month-change="onBookingMonthChange"
      @book="onBookingSubmit"
      @reset="onBookingReset"
    />

    <!-- ============ FOOTER ============ -->
    <Footer />
  </div>
</template>
