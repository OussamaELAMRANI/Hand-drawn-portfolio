<script setup lang="ts">
import { NuxtLink } from '#components'
import {
  Footer,
  ReadingProgress,
  RichDoc,
  SketchBox,
  Skills,
  Typography,
  UiButton,
  UiCard,
  UiChip,
  UiDivider,
  UiLink,
  UiNavbar,
} from '@larevo/ui'
import type { ApiExperience } from '~/types'

useHead({ htmlAttrs: { class: 'scroll-smooth' } })

const pageTitle = 'Experience — Oussama EL AMRANI'
const pageDescription =
  'Work history and engineering experience of Oussama EL AMRANI, Senior Full-Stack Engineer — ' +
  'TypeScript, Node.js, Nuxt & Vue.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
defineOgImageComponent('Default', { title: pageTitle, description: pageDescription })

const { user, isAdmin, logout } = useAuth()
const { data: experiences } = await useFetch<ApiExperience[]>('/api/experiences')

// newest role first — matches how a work history is normally read
const sortedExperiences = computed(() =>
  [...(experiences.value ?? [])].sort((a, b) => (b.startDate ?? '').localeCompare(a.startDate ?? '')),
)

// only stats derivable from real data — no fabricated "40+ projects" style copy
const stats = computed(() => {
  const rows = sortedExperiences.value
  const items: { num: string; label: string }[] = []

  const starts = rows.map((e) => e.startDate).filter((d): d is string => !!d)
  if (starts.length) {
    const earliest = starts.reduce((a, b) => (a < b ? a : b))
    const years = Math.floor((Date.now() - new Date(earliest).getTime()) / (365.25 * 24 * 3600 * 1000))
    if (years > 0) items.push({ num: `${years}+`, label: 'years shipping' })
  }
  if (rows.length) items.push({ num: String(rows.length), label: 'roles held' })
  const techCount = new Set(rows.flatMap((e) => e.tags)).size
  if (techCount) items.push({ num: String(techCount), label: 'technologies used' })

  return items
})

const certs = [
  { name: 'JSNAD', by: 'OpenJS · Node App Dev' },
  { name: 'JSNSD', by: 'OpenJS · Node Security' },
  { name: 'AWS Cloud', by: 'Practitioner' },
]

const navLinks = [
  { label: 'Experience', href: '/experience', class: 'rounded-sm bg-marker px-1.5 py-0.5 -rotate-1' },
  { label: 'Code', href: '/#code' },
  { label: 'Travels', href: '/#travels' },
  { label: 'Blog', href: '/blog' },
  { label: 'Design System', href: '/design-system' },
]
</script>

<template>
  <div>
    <!-- ============ NAV ============ -->
    <UiNavbar
      :links="navLinks"
      :cta="{ label: 'Hire Me', href: '/#book' }"
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

    <!-- ============ HEADER ============ -->
    <header class="mx-auto max-w-[1120px] px-6 pb-5 pt-14">
      <UiLink href="/" class="font-hand text-[17px]">← back home</UiLink>
      <Typography variant="h1" class="!text-[64px] !leading-none mb-1.5 mt-3.5">
        The full work history
      </Typography>
      <p class="-rotate-[0.5deg] font-hand text-[19px] text-ink-400 dark:text-chalk-500">
        — {{ sortedExperiences.length }} role{{ sortedExperiences.length === 1 ? '' : 's' }},
        newest first.
      </p>
    </header>

    <!-- ============ STATS ============ -->
    <section
      v-if="stats.length"
      class="mx-auto grid max-w-[1120px] grid-cols-2 gap-5 px-6 pb-3 pt-6 sm:grid-cols-3"
    >
      <UiCard v-for="s in stats" :key="s.label" variant="index" accent="tape" class="!rotate-0 text-center">
        <div class="font-display text-[44px] leading-[0.9] text-cyan">{{ s.num }}</div>
        <div class="mt-1.5 font-hand text-[16px] text-ink-600 dark:text-chalk-600">
          {{ s.label }}
        </div>
      </UiCard>
    </section>

    <!-- ============ SKILLS ============ -->
    <Skills />

    <!-- ============ TIMELINE ============ -->
    <section class="mx-auto max-w-[1120px] px-6 pb-5 pt-10">
      <Typography variant="h2" class="!text-[40px] mb-7">Timeline</Typography>

      <p v-if="!sortedExperiences.length" class="font-hand text-lg text-ink-400 dark:text-chalk-500">
        No experiences yet.
      </p>

      <div v-else class="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_260px]">
        <!-- cards: left -->
        <div
          class="flex flex-col gap-8 border-l-[3px] border-dashed border-ink-200 pl-8
                 dark:border-night-500"
        >
          <div v-for="e in sortedExperiences" :key="e.id" class="relative">
            <span
              class="absolute -left-[38px] top-2 h-[18px] w-[18px] rounded-full bg-magenta
                     shadow-[0_2px_3px_rgba(0,0,0,0.2)]"
            />
            <span v-if="e.endDate === null" class="absolute -top-2 right-7 z-10">
              <SketchBox
                tag="span"
                color="#FCE34B"
                :stroke-width="1.6"
                class="rotate-3 bg-marker px-2.5 py-1 font-hand text-[12.5px] text-ink shadow-sticky"
              >
                I'm now at →
              </SketchBox>
            </span>
            <UiCard
              variant="index"
              accent="tape"
              :stroke-color="e.endDate === null ? '#FCE34B' : undefined"
              class="!rotate-0"
            >
              <details v-if="richTextToPlain(e.description) || e.learned" class="group">
                <summary
                  class="-mx-3 -mt-3 flex cursor-pointer select-none list-none items-start
                         justify-between gap-3 rounded-md px-3 pt-3 pb-2 transition-colors
                         hover:bg-marker/25 dark:hover:bg-chalk/10
                         [&::-webkit-details-marker]:hidden"
                >
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-baseline justify-between gap-3">
                      <div class="font-display text-[32px] leading-none">{{ e.title }}</div>
                      <div class="font-mono text-[12px] text-cyan">
                        {{ formatMonth(e.startDate) || '—' }} — {{ formatMonth(e.endDate) || 'now' }}
                      </div>
                    </div>
                    <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-hand text-[17px] text-ink-400 dark:text-chalk-500">
                      <span>{{ e.roles.join(' · ') || 'Freelance' }}</span>
                      <span class="text-[13px] text-ink-300 group-open:hidden dark:text-chalk-500">
                        — tap for details
                      </span>
                      <span class="hidden text-[13px] text-ink-300 group-open:inline dark:text-chalk-500">
                        — tap to collapse
                      </span>
                    </div>
                  </div>

                  <SketchBox
                    tag="span"
                    shape="ellipse"
                    :stroke-width="1.6"
                    class="flex h-9 w-9 shrink-0 items-center justify-center text-base
                           transition-transform duration-200 group-open:rotate-90"
                  >
                    ▸
                  </SketchBox>
                </summary>

                <RichDoc
                  v-if="richTextToPlain(e.description)"
                  :doc="e.description"
                  paragraph-class="mb-3 mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-chalk-600"
                />

                <UiCard v-if="e.learned" variant="callout" accent="none" class="!rotate-0 mt-3">
                  <div class="mb-1 font-hand text-[15px] text-magenta">what I learned</div>
                  <p class="text-[14.5px] leading-relaxed text-ink-700 dark:text-chalk-700">
                    {{ e.learned }}
                  </p>
                </UiCard>
              </details>

              <div v-else class="flex flex-wrap items-baseline justify-between gap-3">
                <div class="font-display text-[32px] leading-none">{{ e.title }}</div>
                <div class="font-mono text-[12px] text-cyan">
                  {{ formatMonth(e.startDate) || '—' }} — {{ formatMonth(e.endDate) || 'now' }}
                </div>
              </div>
              <div
                v-if="!richTextToPlain(e.description) && !e.learned"
                class="mt-1 font-hand text-[17px] text-ink-400 dark:text-chalk-500"
              >
                {{ e.roles.join(' · ') || 'Freelance' }}
              </div>

              <div v-if="e.tags.length" class="mt-4 flex flex-wrap gap-1.5">
                <UiChip v-for="tag in e.tags" :key="tag">{{ tag }}</UiChip>
              </div>
            </UiCard>
          </div>
        </div>

        <!-- certs + booking: right, sticky -->
        <aside class="flex flex-col gap-6 lg:sticky lg:top-24">
          <UiCard variant="index" accent="tape" class="!rotate-0">
            <div class="mb-2 font-display text-[32px] leading-none">Certs</div>
            <UiDivider class="mb-3" />
            <div class="flex flex-col gap-3">
              <div v-for="c in certs" :key="c.name">
                <div class="font-display text-[20px] leading-none">{{ c.name }}</div>
                <div class="mt-0.5 font-mono text-[11px] text-cyan">{{ c.by }}</div>
              </div>
            </div>
          </UiCard>

          <UiButton href="/#book" class="w-full text-center">Book a chat →</UiButton>
        </aside>
      </div>
    </section>

    <!-- ============ FOOTER ============ -->
    <Footer />
  </div>
</template>
