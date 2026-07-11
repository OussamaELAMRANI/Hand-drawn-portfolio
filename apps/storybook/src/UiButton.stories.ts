import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UiButton } from '@larevo/ui'

const meta = {
  title: 'UI/Button',
  component: UiButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['sketch', 'primary', 'secondary', 'danger', 'ghost'],
    },
    shape: { control: 'select', options: ['rect', 'pill', 'ellipse'] },
    reveal: { control: 'select', options: ['fade', 'sweep'] },
    fillStyle: {
      control: 'select',
      options: ['hachure', 'solid', 'zigzag', 'cross-hatch', 'dots', 'dashed', 'zigzag-line'],
    },
    hachureAngle: { control: { type: 'range', min: -90, max: 90, step: 1 } },
    roughness: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
    animate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
  },
  render: (args) => ({
    components: { UiButton },
    setup: () => ({ args }),
    template: '<UiButton v-bind="args">Click me</UiButton>',
  }),
} satisfies Meta<typeof UiButton>

export default meta
type Story = StoryObj<typeof meta>

export const Sketch: Story = {
  args: { variant: 'sketch' },
}

export const Primary: Story = {
  args: { variant: 'primary' },
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Danger: Story = {
  args: { variant: 'danger' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const SweepReveal: Story = {
  args: { variant: 'sketch', reveal: 'sweep' },
}

export const Pill: Story = {
  args: { variant: 'sketch', shape: 'pill' },
}

export const FillStyles: Story = {
  render: () => ({
    components: { UiButton },
    setup: () => ({
      styles: ['hachure', 'solid', 'zigzag', 'cross-hatch', 'dots', 'dashed', 'zigzag-line'],
    }),
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
        <UiButton v-for="s in styles" :key="s" :fill-style="s">{{ s }}</UiButton>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const AsLink: Story = {
  args: { href: 'https://example.com', variant: 'primary' },
}
