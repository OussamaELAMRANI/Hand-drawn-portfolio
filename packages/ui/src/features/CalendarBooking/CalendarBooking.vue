<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { BookingSelection, CalendarBookingProps } from './CalendarBooking.types'
import SketchBox from '#components/SketchBox/SketchBox.vue'
import Typography from '#components/Typography/Typography.vue'
import UiArrow from '#components/UiArrow/UiArrow.vue'

const props = withDefaults(defineProps<CalendarBookingProps>(), {
  title: 'Book my time',
  subtitle: '— recruiters & clients: grab a 30-min intro. Pick a day, pick a slot, done.',
  meta: 'GMT+1 · 30 min',
  slots: () => ['09:30', '11:00', '13:00', '14:30', '16:00'],
  annotation: 'pick a free day!',
})

const emit = defineEmits<{ select: [selection: BookingSelection] }>()

// ── current month, weekends unavailable ──
const today = new Date()
const year = today.getFullYear()
const month = today.getMonth()
const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
const dowLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// default to the first weekday on/after today
function firstBookableDay(): number {
  const daysIn = new Date(year, month + 1, 0).getDate()
  for (let d = today.getDate(); d <= daysIn; d++) {
    const dow = new Date(year, month, d).getDay()
    if (dow !== 0 && dow !== 6) return d
  }
  return today.getDate()
}
const selectedDay = ref(firstBookableDay())
const selectedSlot = ref(1)

interface CalendarCell {
  day: number | null
  weekend: boolean
}

const calendarWeeks = computed<CalendarCell[][]>(() => {
  const firstDow = new Date(year, month, 1).getDay()
  const daysIn = new Date(year, month + 1, 0).getDate()
  const cells: CalendarCell[] = []
  for (let i = 0; i < firstDow; i++) cells.push({ day: null, weekend: false })
  for (let d = 1; d <= daysIn; d++) {
    const dow = new Date(year, month, d).getDay()
    cells.push({ day: d, weekend: dow === 0 || dow === 6 })
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, weekend: false })
  const weeks: CalendarCell[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
})

const selectedSummary = computed(() => {
  const date = new Date(year, month, selectedDay.value)
  const wk = date.toLocaleDateString('en-US', { weekday: 'short' })
  const mo = date.toLocaleDateString('en-US', { month: 'short' })
  return `You picked ${wk}, ${mo} ${selectedDay.value} · ${props.slots[selectedSlot.value]}`
})

watch([selectedDay, selectedSlot], ([day, slot]) => {
  const label = props.slots[slot]
  if (label) emit('select', { date: new Date(year, month, day), slot: label })
})
</script>

<template>
  <section id="book" class="mx-auto max-w-[1120px] px-6 pb-10 pt-[60px]">
    <Typography variant="h2" class="!text-[52px]">{{ title }}</Typography>
    <p
      class="mb-[30px] mt-2 -rotate-[0.5deg] font-hand text-[19px] text-ink-400 dark:text-chalk-500"
    >
      {{ subtitle }}
    </p>

    <SketchBox
      :stroke-width="2.1"
      class="grid gap-[38px] bg-white p-[30px] shadow-lifted md:grid-cols-[1.15fr_0.85fr] dark:bg-night-800"
    >
      <!-- calendar -->
      <div>
        <div class="mb-4 flex items-center justify-between">
          <div class="font-display text-[32px]">{{ monthLabel }}</div>
          <div class="font-mono text-xs text-ink-300 dark:text-chalk-500">{{ meta }}</div>
        </div>
        <div
          class="mb-1.5 grid grid-cols-7 gap-1.5 text-center font-hand text-sm text-ink-300 dark:text-chalk-500"
        >
          <div v-for="d in dowLabels" :key="d">{{ d }}</div>
        </div>
        <div class="flex flex-col gap-1.5">
          <div v-for="(week, wi) in calendarWeeks" :key="wi" class="grid grid-cols-7 gap-1.5">
            <button
              v-for="(cell, ci) in week"
              :key="ci"
              type="button"
              :disabled="cell.day === null || cell.weekend"
              class="flex aspect-square items-center justify-center border-none bg-transparent font-hand text-base transition-[background,transform] duration-150 [border-radius:50%_48%_52%_50%/50%_52%_48%_50%]"
              :class="[
                cell.weekend
                  ? 'cursor-not-allowed text-ink-100 dark:text-night-500'
                  : cell.day !== null && 'cursor-pointer',
                cell.day !== null && cell.day === selectedDay
                  ? 'scale-[1.06] -rotate-3 bg-sky font-bold text-[#2A2A2A]'
                  : !cell.weekend && 'hover:bg-paper-300 dark:hover:bg-night-700',
              ]"
              @click="cell.day !== null && !cell.weekend && (selectedDay = cell.day)"
            >
              {{ cell.day ?? '' }}
            </button>
          </div>
        </div>
      </div>

      <!-- slots -->
      <div class="relative">
        <div class="pointer-events-none absolute -left-[92px] top-6 hidden h-[60px] w-20 md:block">
          <UiArrow color="#C0577F" :stroke-width="2" />
        </div>
        <div
          class="absolute -left-[118px] -top-2 hidden w-[110px] -rotate-6 text-center font-hand text-base text-magenta md:block"
        >
          {{ annotation }}
        </div>
        <div class="mb-3 font-display text-[28px]">Available slots</div>
        <div class="flex flex-col gap-2.5">
          <button
            v-for="(slot, i) in slots"
            :key="slot"
            type="button"
            class="cursor-pointer rounded-lg border-[1.5px] px-4 py-[11px] text-left font-hand text-base transition-all duration-150"
            :class="
              i === selectedSlot
                ? '-rotate-1 border-ink bg-marker font-bold text-[#2A2A2A]'
                : `border-ink-100 bg-white text-ink hover:border-ink-200
                   dark:border-night-500 dark:bg-night-700 dark:text-chalk`
            "
            @click="selectedSlot = i"
          >
            {{ slot }}{{ i === selectedSlot ? '  ✓' : '' }}
          </button>
        </div>
        <div
          class="mt-5 inline-block -rotate-1 bg-marker px-3 py-1.5 font-hand text-base text-[#2A2A2A]"
        >
          {{ selectedSummary }}
        </div>
      </div>
    </SketchBox>
  </section>
</template>
