import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Footer } from '@larevo/ui'

const meta = {
  title: 'Features/Footer',
  component: Footer,
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomTagline: Story = {
  args: {
    socials: [
      { label: 'GitHub', href: '#' },
      { label: 'Email', href: 'mailto:hi@example.com' },
    ],
    copyright: '© 2026 — all sketches reserved.',
  },
  render: (args) => ({
    components: { Footer },
    setup: () => ({ args }),
    template: `
      <Footer v-bind="args">
        Less slides, more <span class="text-cyan">shipped</span>.
      </Footer>
    `,
  }),
}
