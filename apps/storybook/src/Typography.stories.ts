import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Typography } from '@larevo/ui'

const meta = {
  title: 'UI/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'lead', 'label', 'body', 'mono'],
    },
    as: { control: 'text' },
  },
  render: (args) => ({
    components: { Typography },
    setup: () => ({ args }),
    template: '<Typography v-bind="args">The quick brown fox jumps over the lazy dog</Typography>',
  }),
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const H1: Story = {
  args: { variant: 'h1' },
}

export const H2: Story = {
  args: { variant: 'h2' },
}

export const Lead: Story = {
  args: { variant: 'lead' },
}

export const Label: Story = {
  args: { variant: 'label' },
}

export const Body: Story = {
  args: { variant: 'body' },
}

export const Mono: Story = {
  args: { variant: 'mono' },
}

export const Specimen: Story = {
  render: () => ({
    components: { Typography },
    template: `
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <Typography variant="h1">The big hello</Typography>
        <Typography variant="h2">Section heading</Typography>
        <Typography variant="lead">A handwritten lead line</Typography>
        <Typography variant="label">UI label / caption</Typography>
        <Typography variant="body">Readable body copy…</Typography>
        <Typography variant="mono">const ship = () => deploy(app);</Typography>
      </div>
    `,
  }),
}
