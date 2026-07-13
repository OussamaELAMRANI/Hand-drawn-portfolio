import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { HeroMe } from '@larevo/ui'

const meta = {
  title: 'Features/HeroMe',
  component: HeroMe,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HeroMe>

export default meta
type Story = StoryObj<typeof meta>

/** the homepage hero: intro copy, CTAs, and the swipeable polaroid deck */
export const Default: Story = {}
