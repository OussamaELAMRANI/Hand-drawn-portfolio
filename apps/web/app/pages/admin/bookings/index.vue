<script setup lang="ts">
import { SketchBox, UiButton, UiInput } from '@larevo/ui'

interface BookingRow {
  id: string
  name: string
  email: string
  message: string | null
  date: string
  slot: string
  read: boolean
}

interface GoogleConnectionRow {
  id: string
  label: string
  email: string
  isPrimary: boolean
}

const { data, refresh } = await useFetch<BookingRow[]>('/api/bookings/admin')
const bookings = computed(() => data.value ?? [])
const { toast } = useAdminToast()

const { data: connectionsData, refresh: refreshConnections } =
  await useFetch<GoogleConnectionRow[]>('/api/google/connections')
const connections = computed(() => connectionsData.value ?? [])
const newConnectionLabel = ref('')

const route = useRoute()
onMounted(() => {
  if (route.query.connected) toast('Google Calendar connected ✓')
  if (route.query.google_error) toast('Google connection failed — try again')
  if (route.query.connected || route.query.google_error) {
    navigateTo({ path: route.path }, { replace: true })
  }
})

// mark-as-read fires after the initial render, so "new" bookings still show
// their unread mark on this visit — only the *next* visit (and the dashboard
// badge) reflects them as read
onMounted(() => {
  if (bookings.value.some((b) => !b.read)) $fetch('/api/bookings/read-all', { method: 'POST' })
})

async function cancel(id: string) {
  await $fetch(`/api/bookings/${id}`, { method: 'DELETE' })
  toast('Booking cancelled')
  await refresh()
}

function connectGoogle() {
  const label = newConnectionLabel.value.trim() || 'Google Calendar'
  window.location.href = `/api/google/connect?label=${encodeURIComponent(label)}`
}

async function setPrimary(id: string) {
  await $fetch(`/api/google/connections/${id}/primary`, { method: 'POST' })
  await refreshConnections()
}

async function disconnectGoogle(id: string) {
  await $fetch(`/api/google/connections/${id}`, { method: 'DELETE' })
  toast('Google account disconnected')
  await refreshConnections()
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <AdminShell title="Bookings" subtitle="Upcoming meeting slots people have grabbed.">
    <SketchBox
      :stroke-width="1.7"
      color="#5FA04E"
      class="mb-6 bg-white px-6 py-5 shadow-sticky dark:bg-night-800"
    >
      <div class="mb-3 font-display text-[24px] font-bold leading-none">Google Calendar</div>
      <div
        v-if="connections.length === 0"
        class="mb-3 font-hand text-[15px] text-ink-400 dark:text-chalk-400"
      >
        Not connected — slots stay based only on this site's own bookings.
      </div>
      <div v-else class="mb-3 flex flex-col gap-2">
        <div
          v-for="c in connections"
          :key="c.id"
          class="flex flex-wrap items-center gap-2.5 rounded-lg border-[1.5px] border-ink-100
                 bg-paper-200 px-3.5 py-2.5 dark:border-night-500 dark:bg-night-700"
        >
          <span class="font-hand text-base">{{ c.label }}</span>
          <span class="font-mono text-[12px] text-ink-400 dark:text-chalk-400">{{ c.email }}</span>
          <span
            v-if="c.isPrimary"
            class="rounded-[3px] bg-cyan px-2 py-0.5 font-mono text-[10px] uppercase text-white"
          >
            primary
          </span>
          <div class="ml-auto flex shrink-0 gap-2">
            <button
              v-if="!c.isPrimary"
              class="cursor-pointer font-hand text-[14px] text-cyan"
              @click="setPrimary(c.id)"
            >
              make primary
            </button>
            <button
              class="cursor-pointer font-hand text-[14px] text-ink-400 hover:text-magenta
                     dark:text-chalk-500"
              @click="disconnectGoogle(c.id)"
            >
              disconnect
            </button>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2.5">
        <UiInput
          v-model="newConnectionLabel"
          placeholder="label, e.g. Work"
          class="!w-44"
          @keydown.enter="connectGoogle"
        />
        <UiButton @click="connectGoogle">+ Connect a Google account</UiButton>
      </div>
    </SketchBox>

    <SketchBox
      v-if="bookings.length === 0"
      color="#c9c9bf"
      :stroke-width="1.6"
      class="bg-white p-11 text-center dark:bg-night-800"
    >
      <div class="font-display text-3xl text-ink-400 dark:text-chalk-500">Nothing here yet.</div>
      <div class="font-hand text-base text-ink-300 dark:text-chalk-400">
        Bookings made through the "Book my time" section show up here.
      </div>
    </SketchBox>

    <div class="flex flex-col gap-3.5">
      <SketchBox
        v-for="booking in bookings"
        :key="booking.id"
        :stroke-width="1.7"
        :color="booking.read ? undefined : '#C0577F'"
        class="flex items-center gap-[18px] bg-white px-[22px] py-[18px] shadow-sticky
               dark:bg-night-800"
      >
        <div class="min-w-0 flex-1">
          <div class="mb-1 flex flex-wrap items-center gap-2.5">
            <span
              v-if="!booking.read"
              class="inline-block h-2 w-2 shrink-0 rounded-full bg-magenta"
              aria-label="unread"
            />
            <span class="font-display text-[22px] font-bold leading-none">{{ booking.name }}</span>
            <span class="font-mono text-[11px] text-ink-300 dark:text-chalk-400">
              {{ formatDate(booking.date) }} · {{ booking.slot }}
            </span>
          </div>
          <div class="text-[13.5px] text-ink-500 dark:text-chalk-500">{{ booking.email }}</div>
          <div
            v-if="booking.message"
            class="mt-1 font-hand text-[14px] text-ink-400 dark:text-chalk-400"
          >
            ✎ {{ booking.message }}
          </div>
        </div>
        <div class="flex shrink-0 gap-2">
          <AdminDeleteButton @confirm="cancel(booking.id)" />
        </div>
      </SketchBox>
    </div>
  </AdminShell>
</template>
