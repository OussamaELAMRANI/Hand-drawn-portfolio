import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { CalendarBooking } from '@larevo/ui'
import type { BookingFormPayload, BookingSlot } from '@larevo/ui'

const meta = {
  title: 'Features/CalendarBooking',
  component: CalendarBooking,
  tags: ['autodocs'],
} satisfies Meta<typeof CalendarBooking>

export default meta
type Story = StoryObj<typeof meta>

/** current month, weekends + past days disabled, first weekday preselected.
 *  Simulates a backend in-memory so the full pick → submit → confirm loop
 *  (including a couple of pre-taken slots) can be tried without a real API. */
export const Default: Story = {
  render: () => ({
    components: { CalendarBooking },
    setup: () => {
      const submitting = ref(false)
      const error = ref<string | null>(null)
      const confirmed = ref(false)
      const takenSlots = ref<BookingSlot[]>([])

      function onMonthChange(year: number, month: number) {
        const mm = String(month).padStart(2, '0')
        takenSlots.value = [
          { date: `${year}-${mm}-05`, slot: '11:00' },
          { date: `${year}-${mm}-12`, slot: '14:30' },
        ]
      }

      function onBook(_payload: BookingFormPayload) {
        error.value = null
        submitting.value = true
        setTimeout(() => {
          submitting.value = false
          confirmed.value = true
        }, 600)
      }

      function onReset() {
        confirmed.value = false
      }

      return { submitting, error, confirmed, takenSlots, onMonthChange, onBook, onReset }
    },
    template: `
      <CalendarBooking
        :submitting="submitting"
        :error="error"
        :confirmed="confirmed"
        :taken-slots="takenSlots"
        @month-change="onMonthChange"
        @book="onBook"
        @reset="onReset"
      />
    `,
  }),
}

export const CustomSlots: Story = {
  args: {
    title: 'Grab a slot',
    subtitle: '— 15-minute intro calls, afternoons only.',
    meta: 'GMT+1 · 15 min',
    slots: ['13:15', '14:00', '15:30', '17:00'],
    annotation: 'weekdays only!',
  },
}
