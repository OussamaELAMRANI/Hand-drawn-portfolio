import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Travels } from '@larevo/ui'

const meta = {
  title: 'Features/Travels',
  component: Travels,
  tags: ['autodocs'],
} satisfies Meta<typeof Travels>

export default meta
type Story = StoryObj<typeof meta>

/** default trips, map banner, and polaroid grid */
export const Default: Story = {}

export const NoMap: Story = {
  args: { showMap: false },
}

export const WithImages: Story = {
  args: {
    trips: [
      { place: 'Lisbon', note: 'shipped from a rooftop', image: 'https://picsum.photos/seed/lisbon/540/540' },
      { place: 'Marrakech', note: 'home base & mint tea', image: 'https://picsum.photos/seed/marrakech/540/540' },
      { place: 'Bali', note: 'standups at sunrise', image: 'https://picsum.photos/seed/bali/540/540' },
      { place: 'Tokyo', note: 'best wifi on earth', image: 'https://picsum.photos/seed/tokyo/540/540' },
    ],
  },
}
