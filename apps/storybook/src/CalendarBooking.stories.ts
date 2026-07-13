import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarBooking } from '@larevo/ui'

const meta = {
  title: 'Features/CalendarBooking',
  component: CalendarBooking,
  tags: ['autodocs'],
} satisfies Meta<typeof CalendarBooking>

export default meta
type Story = StoryObj<typeof meta>

/** current month, weekends disabled, first weekday preselected */
export const Default: Story = {}

export const CustomSlots: Story = {
  args: {
    title: 'Grab a slot',
    subtitle: '— 15-minute intro calls, afternoons only.',
    meta: 'GMT+1 · 15 min',
    slots: ['13:15', '14:00', '15:30', '17:00'],
    annotation: 'weekdays only!',
  },
}
