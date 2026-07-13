import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Skills } from '@larevo/ui'

const meta = {
  title: 'Features/Skills',
  component: Skills,
  tags: ['autodocs'],
} satisfies Meta<typeof Skills>

export default meta
type Story = StoryObj<typeof meta>

/** full default stack, brand-colored chip outlines via the skill → color map */
export const BrandColored: Story = {}

/** same chips with the neutral gray sketch stroke */
export const Neutral: Story = {
  args: { colored: false },
}

export const CustomList: Story = {
  args: {
    label: 'this project:',
    skills: ['Nuxt.js', 'Vue.js', 'TypeScript', 'Tailwind', 'Storybook', 'Vitest'],
  },
}
