<script setup lang="ts">
import { SketchBox } from '@larevo/ui'
import type { ApiPost, ApiExperience } from '~/types'

interface BookingRow {
  id: string
  read: boolean
}

const { data: postsData } = await useFetch<ApiPost[]>('/api/posts')
const { data: experiencesData } = await useFetch<ApiExperience[]>('/api/experiences')
const { data: tagsData } = await useFetch<{ name: string }[]>('/api/tags')
const { data: bookingsData } = await useFetch<BookingRow[]>('/api/bookings/admin')

const posts = computed(() => postsData.value ?? [])
const bookings = computed(() => bookingsData.value ?? [])
const unreadBookings = computed(() => bookings.value.filter((b) => !b.read).length)

const stats = computed(() => [
  {
    label: 'Posts',
    count: posts.value.length,
    color: '#C0577F',
    to: '/admin/posts',
    tilt: '-rotate-[1.5deg]',
  },
  {
    label: 'Published',
    count: posts.value.filter((p) => p.status === 'published').length,
    color: '#0E93A8',
    to: '/admin/posts',
    tilt: 'rotate-[1.2deg]',
  },
  {
    label: 'Experiences',
    count: experiencesData.value?.length ?? 0,
    color: '#8A6BCF',
    to: '/admin/experiences',
    tilt: '-rotate-[0.8deg]',
  },
  {
    label: 'Tags',
    count: tagsData.value?.length ?? 0,
    color: '#C98A2B',
    to: '/admin/tags',
    tilt: 'rotate-[1.6deg]',
  },
  {
    label: 'Bookings',
    count: bookings.value.length,
    color: '#5FA04E',
    to: '/admin/bookings',
    tilt: 'rotate-[0.9deg]',
    badge: unreadBookings.value,
  },
])

const recent = computed(() => posts.value.slice(0, 5))

const statusColor = (status: ApiPost['status']) =>
  status === 'published' ? '#0E93A8' : '#C98A2B'
</script>

<template>
  <AdminShell title="Dashboard" subtitle="Everything on your site, in one place.">
    <div class="mb-7 grid grid-cols-2 gap-[18px] xl:grid-cols-4">
      <NuxtLink v-for="s in stats" :key="s.label" :to="s.to">
        <SketchBox
          :stroke-width="1.8"
          class="bg-white px-5 py-[18px] shadow-sticky transition-transform duration-200
                 ease-out hover:-translate-y-1 hover:rotate-0 dark:bg-night-800"
          :class="s.tilt"
        >
          <span
            v-if="s.badge"
            class="absolute -right-2.5 -top-2.5 flex h-6 min-w-6 items-center justify-center
                   rounded-full bg-magenta px-1.5 font-mono text-[11px] font-bold text-white
                   shadow-sticky"
          >
            {{ s.badge }}
          </span>
          <div
            class="font-display text-5xl font-bold leading-[0.85]"
            :style="{ color: s.color }"
          >
            {{ s.count }}
          </div>
          <div class="mt-1 font-hand text-base text-ink-600 dark:text-chalk-600">
            {{ s.label }}
          </div>
        </SketchBox>
      </NuxtLink>
    </div>

    <div class="grid items-start gap-[22px] lg:grid-cols-[1.3fr_0.7fr]">
      <SketchBox
        :stroke-width="1.8"
        class="bg-white px-6 py-[22px] shadow-sticky dark:bg-night-800"
      >
        <div class="mb-3 font-display text-[28px] font-bold leading-none">Recent posts</div>
        <div v-if="recent.length === 0" class="py-4 font-hand text-ink-400 dark:text-chalk-400">
          No posts yet — write the first one!
        </div>
        <NuxtLink
          v-for="post in recent"
          :key="post.id"
          :to="`/admin/posts/${post.id}`"
          class="flex items-center gap-3 border-b border-dashed border-ink-100 py-[11px]
                 last:border-b-0 dark:border-night-500"
        >
          <span
            class="rounded-[3px] px-2 py-0.5 font-mono text-[10px] uppercase text-white"
            :style="{ backgroundColor: statusColor(post.status) }"
          >
            {{ post.status }}
          </span>
          <span class="flex-1 truncate text-[15px]">{{ post.title }}</span>
          <span class="font-mono text-[11px] text-ink-300 dark:text-chalk-400">
            {{ formatMonth(post.createdAt) }}
          </span>
        </NuxtLink>
      </SketchBox>

      <SketchBox
        :stroke-width="1.8"
        color="#0E93A8"
        class="bg-white px-6 py-[22px] shadow-sticky dark:bg-night-800"
      >
        <div class="mb-3 font-display text-[28px] font-bold leading-none">Quick add</div>
        <div class="flex flex-col gap-2.5">
          <NuxtLink
            to="/admin/posts/new"
            class="rounded-lg border-[1.5px] border-ink-100 bg-paper-200 px-3.5 py-[11px]
                   font-hand text-base transition-colors duration-150 hover:border-ink
                   hover:bg-marker hover:text-ink dark:border-night-500 dark:bg-night-700
                   dark:hover:bg-marker"
          >
            + New post
          </NuxtLink>
          <NuxtLink
            to="/admin/experiences?new=1"
            class="rounded-lg border-[1.5px] border-ink-100 bg-paper-200 px-3.5 py-[11px]
                   font-hand text-base transition-colors duration-150 hover:border-ink
                   hover:bg-marker hover:text-ink dark:border-night-500 dark:bg-night-700
                   dark:hover:bg-marker"
          >
            + New experience
          </NuxtLink>
        </div>
      </SketchBox>
    </div>
  </AdminShell>
</template>
