import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { SwipeDeck } from '@larevo/ui'

const meta = {
  title: 'Features/SwipeDeck',
  component: SwipeDeck,
  tags: ['autodocs'],
} satisfies Meta<typeof SwipeDeck>

export default meta
type Story = StoryObj<typeof meta>

const trips = [
  { caption: 'Lisbon', note: 'shipped from a rooftop' },
  { caption: 'Marrakech', note: 'home base & mint tea' },
  { caption: 'Bali', note: 'standups at sunrise' },
  { caption: 'Tokyo', note: 'best wifi on earth' },
]

export const Loop: Story = {
  args: { cards: trips },
  render: (args) => ({
    components: { SwipeDeck },
    setup: () => ({ args }),
    template: `
      <div class="p-10">
        <SwipeDeck v-bind="args" class="w-[270px]" />
        <p class="mt-6 font-hand text-[15px] text-ink-400 dark:text-chalk-500">
          desktop: arrows below (or ←/→ keys) · mobile: swipe the top card — cards loop to the back
        </p>
      </div>
    `,
  }),
}

export const WithImages: Story = {
  args: {
    cards: trips.map((t, i) => ({
      ...t,
      image: `https://picsum.photos/seed/larevo-${i}/540/540`,
    })),
  },
  render: (args) => ({
    components: { SwipeDeck },
    setup: () => ({ args }),
    template: `<div class="p-10"><SwipeDeck v-bind="args" class="w-[270px]" /></div>`,
  }),
}

export const NoLoop: Story = {
  args: { cards: trips, loop: false },
  render: (args) => ({
    components: { SwipeDeck },
    setup: () => ({ args }),
    template: `
      <div class="p-10">
        <SwipeDeck v-bind="args" class="w-[270px]" />
        <p class="mt-6 font-hand text-[15px] text-ink-400 dark:text-chalk-500">
          loop off — the deck runs out
        </p>
      </div>
    `,
  }),
}
