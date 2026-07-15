<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { BookingFormPayload, CalendarBookingProps } from './CalendarBooking.types'
import SketchBox from '#components/SketchBox/SketchBox.vue'
import Typography from '#components/Typography/Typography.vue'
import UiArrow from '#components/UiArrow/UiArrow.vue'
import UiButton from '#components/UiButton/UiButton.vue'
import UiInput from '#components/UiInput/UiInput.vue'
import UiTextarea from '#components/UiTextarea/UiTextarea.vue'

const props = withDefaults(defineProps<CalendarBookingProps>(), {
  title: 'Book my time',
  subtitle: '— recruiters & clients: grab a 30-min intro. Pick a day, pick a slot, done.',
  meta: 'GMT+1 · 30 min',
  // a full working day, 9am – 7pm, in 30-min increments (last start 18:30 so
  // the intro ends by 7pm)
  slots: () => [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30',
  ],
  annotation: 'pick a free day!',
  takenSlots: () => [],
  submitting: false,
  error: null,
  confirmed: false,
})

const emit = defineEmits<{
  /** fired on mount and whenever the visitor navigates months — month is 1-indexed */
  'month-change': [year: number, month: number]
  book: [payload: BookingFormPayload]
  reset: []
}>()

const pad = (n: number) => String(n).padStart(2, '0')
const dowLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const today = new Date()
today.setHours(0, 0, 0, 0)

const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-indexed, matches Date()

const monthLabel = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  }),
)

const canGoPrev = computed(
  () =>
    viewYear.value > today.getFullYear() ||
    (viewYear.value === today.getFullYear() && viewMonth.value > today.getMonth()),
)
const isCurrentMonthView = computed(
  () => viewYear.value === today.getFullYear() && viewMonth.value === today.getMonth(),
)

function firstBookableDay(y: number, m: number): number {
  const isCurrentMonth = y === today.getFullYear() && m === today.getMonth()
  const startDay = isCurrentMonth ? today.getDate() : 1
  const daysIn = new Date(y, m + 1, 0).getDate()
  for (let d = startDay; d <= daysIn; d++) {
    if (new Date(y, m, d).getDay() !== 0) return d
  }
  return startDay
}

const selectedDay = ref(firstBookableDay(viewYear.value, viewMonth.value))
const selectedSlot = ref(1)

function goToMonth(y: number, m: number) {
  viewYear.value = y
  viewMonth.value = m
  selectedDay.value = firstBookableDay(y, m)
}
function goPrev() {
  if (!canGoPrev.value) return
  const d = new Date(viewYear.value, viewMonth.value - 1, 1)
  goToMonth(d.getFullYear(), d.getMonth())
}
function goNext() {
  const d = new Date(viewYear.value, viewMonth.value + 1, 1)
  goToMonth(d.getFullYear(), d.getMonth())
}
function goToday() {
  goToMonth(today.getFullYear(), today.getMonth())
}

watch([viewYear, viewMonth], ([y, m]) => emit('month-change', y, m + 1), { immediate: true })

interface CalendarCell {
  day: number | null
  closed: boolean
  past: boolean
}

const calendarWeeks = computed<CalendarCell[][]>(() => {
  const y = viewYear.value
  const m = viewMonth.value
  const firstDow = new Date(y, m, 1).getDay()
  const daysIn = new Date(y, m + 1, 0).getDate()
  const cells: CalendarCell[] = []
  for (let i = 0; i < firstDow; i++) cells.push({ day: null, closed: false, past: false })
  for (let d = 1; d <= daysIn; d++) {
    const dow = new Date(y, m, d).getDay()
    cells.push({ day: d, closed: dow === 0, past: new Date(y, m, d) < today })
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, closed: false, past: false })
  const weeks: CalendarCell[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
})

const selectedDateIso = computed(
  () => `${viewYear.value}-${pad(viewMonth.value + 1)}-${pad(selectedDay.value)}`,
)

const takenForSelectedDay = computed(
  () => new Set(props.takenSlots.filter((t) => t.date === selectedDateIso.value).map((t) => t.slot)),
)

const availableSlotCount = computed(
  () => props.slots.filter((s) => !takenForSelectedDay.value.has(s)).length,
)

const selectedSlotLabel = computed(() => props.slots[selectedSlot.value])

const selectedSummary = computed(() => {
  const date = new Date(viewYear.value, viewMonth.value, selectedDay.value)
  const wk = date.toLocaleDateString('en-US', { weekday: 'short' })
  const mo = date.toLocaleDateString('en-US', { month: 'short' })
  return `You picked ${wk}, ${mo} ${selectedDay.value} · ${selectedSlotLabel.value}`
})

const formName = ref('')
const formEmail = ref('')
const formMessage = ref('')

const emailLooksValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.value.trim()))
const canSubmit = computed(
  () =>
    !props.submitting &&
    formName.value.trim().length > 0 &&
    emailLooksValid.value &&
    !!selectedSlotLabel.value &&
    !takenForSelectedDay.value.has(selectedSlotLabel.value),
)

function submit() {
  if (!canSubmit.value || !selectedSlotLabel.value) return
  emit('book', {
    date: selectedDateIso.value,
    slot: selectedSlotLabel.value,
    name: formName.value.trim(),
    email: formEmail.value.trim(),
    message: formMessage.value.trim() || undefined,
  })
}

function bookAnother() {
  formName.value = ''
  formEmail.value = ''
  formMessage.value = ''
  emit('reset')
}
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
          <div class="flex items-center gap-2.5">
            <button
              type="button"
              :disabled="!canGoPrev"
              class="cursor-pointer border-none bg-transparent font-hand text-xl leading-none
                     text-ink-400 transition-transform duration-150 hover:-translate-x-0.5
                     disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-x-0
                     dark:text-chalk-500"
              aria-label="previous month"
              @click="goPrev"
            >
              ‹
            </button>
            <div class="font-display text-[32px]">{{ monthLabel }}</div>
            <button
              type="button"
              class="cursor-pointer border-none bg-transparent font-hand text-xl leading-none
                     text-ink-400 transition-transform duration-150 hover:translate-x-0.5
                     dark:text-chalk-500"
              aria-label="next month"
              @click="goNext"
            >
              ›
            </button>
            <button
              v-if="!isCurrentMonthView"
              type="button"
              class="cursor-pointer rounded-full border-[1.5px] border-ink-100 px-2.5 py-0.5
                     font-hand text-[13px] text-ink-400 transition-colors duration-150
                     hover:border-ink hover:text-ink dark:border-night-500 dark:text-chalk-500
                     dark:hover:text-chalk"
              @click="goToday"
            >
              today
            </button>
          </div>
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
              :disabled="cell.day === null || cell.closed || cell.past"
              class="flex aspect-square items-center justify-center border-none font-hand text-base transition-[background,transform] duration-150 [border-radius:50%_48%_52%_50%/50%_52%_48%_50%]"
              :class="[
                cell.closed || cell.past
                  ? 'cursor-not-allowed text-ink-200 dark:text-night-500'
                  : cell.day !== null && 'cursor-pointer',
                cell.day !== null && cell.day === selectedDay
                  ? 'scale-[1.06] -rotate-3 bg-sky font-bold text-[#2A2A2A]'
                  : 'bg-transparent',
                cell.day !== null && cell.day !== selectedDay && !cell.closed && !cell.past
                  ? 'hover:bg-paper-300 dark:hover:bg-night-700'
                  : '',
              ]"
              @click="cell.day !== null && !cell.closed && !cell.past && (selectedDay = cell.day)"
            >
              {{ cell.day ?? '' }}
            </button>
          </div>
        </div>
      </div>

      <!-- slots + booking form, or confirmation -->
      <div class="relative">
        <template v-if="!confirmed">
          <div class="pointer-events-none absolute -left-[92px] top-6 hidden h-[60px] w-20 md:block">
            <UiArrow color="#C0577F" :stroke-width="2" />
          </div>
          <div
            class="absolute -left-[118px] -top-2 hidden w-[110px] -rotate-6 text-center font-hand text-base text-magenta md:block"
          >
            {{ annotation }}
          </div>
          <div class="mb-3 flex items-baseline justify-between">
            <div class="font-display text-[28px]">Available slots</div>
            <div class="font-mono text-[11px] text-ink-400 dark:text-chalk-500">
              {{ availableSlotCount }} available
            </div>
          </div>
          <div
            class="grid max-h-[280px] grid-cols-2 gap-2 overflow-y-auto rounded-lg border-[1.5px]
                   border-dashed border-ink-100 p-2.5 sm:grid-cols-3 dark:border-night-500"
          >
            <button
              v-for="(slot, i) in slots"
              :key="slot"
              type="button"
              :disabled="takenForSelectedDay.has(slot)"
              class="cursor-pointer rounded-lg border-[1.5px] px-2 py-2 text-center font-hand
                     text-base leading-none transition-all duration-150
                     disabled:cursor-not-allowed disabled:opacity-40"
              :class="
                i === selectedSlot
                  ? '-rotate-1 border-ink bg-marker font-bold text-[#2A2A2A]'
                  : `border-ink-100 bg-white text-ink hover:border-ink-200
                     dark:border-night-500 dark:bg-night-700 dark:text-chalk`
              "
              @click="selectedSlot = i"
            >
              {{ slot }}
              <span v-if="takenForSelectedDay.has(slot)" class="block text-[11px]">booked</span>
              <span v-else-if="i === selectedSlot">  ✓</span>
            </button>
          </div>

          <SketchBox
            color="#0E93A8"
            :stroke-width="1.8"
            class="mt-5 flex flex-col gap-2.5 bg-sky/10 p-4 dark:bg-night-700"
          >
            <UiInput v-model="formName" placeholder="Your name" />
            <UiInput v-model="formEmail" type="email" placeholder="you@company.com" />
            <UiTextarea v-model="formMessage" :rows="2" placeholder="What are we dealing with ?" />
            <p v-if="error" class="font-hand text-[15px] text-magenta">{{ error }}</p>
            <UiButton :disabled="!canSubmit" @click="submit">
              {{ submitting ? 'booking…' : 'Confirm booking' }}
            </UiButton>
          </SketchBox>

          <div
            class="mt-4 inline-block -rotate-1 bg-marker px-3 py-1.5 font-hand text-base text-[#2A2A2A]"
          >
            {{ selectedSummary }}
          </div>
        </template>

        <template v-else>
          <div class="flex h-full flex-col items-start justify-center gap-3 py-8">
            <div class="font-display text-[32px]">You're booked! ✓</div>
            <p class="font-hand text-lg text-ink-500 dark:text-chalk-500">
              {{ selectedSummary }} — a confirmation email is on its way.
            </p>
            <button
              type="button"
              class="cursor-pointer font-hand text-[17px] text-cyan underline decoration-wavy
                     underline-offset-4"
              @click="bookAnother"
            >
              book another slot
            </button>
          </div>
        </template>
      </div>
    </SketchBox>
  </section>
</template>
