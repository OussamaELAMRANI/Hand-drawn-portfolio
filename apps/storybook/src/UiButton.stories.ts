import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UiButton } from '@larevo/ui'

const meta = {
  title: 'UI/Button',
  component: UiButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'ghost'] },
  },
  render: (args) => ({
    components: { UiButton },
    setup: () => ({ args }),
    template: '<UiButton v-bind="args">Click me</UiButton>',
  }),
} satisfies Meta<typeof UiButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
