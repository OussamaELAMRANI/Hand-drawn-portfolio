import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UiBadge, UiChip, UiPill, UiHighlight } from '@larevo/ui'

const CHIPS = ['TypeScript', 'Node.js', 'Next.js', 'Vue.js', 'PostgreSQL', 'Redis', 'AWS', 'DDD']

const meta = {
  title: 'UI/Tags & Badges',
  component: UiBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['ai', 'code', 'news', 'career'] },
  },
} satisfies Meta<typeof UiBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Badge: Story = {
  args: { variant: 'ai' },
  render: (args) => ({
    components: { UiBadge },
    setup: () => ({ args }),
    template: '<UiBadge v-bind="args">AI</UiBadge>',
  }),
}

export const CategoryBadges: Story = {
  render: () => ({
    components: { UiBadge },
    template: `
      <div style="display:flex;gap:8px;">
        <UiBadge variant="ai">AI</UiBadge>
        <UiBadge variant="code">Code</UiBadge>
        <UiBadge variant="news">News</UiBadge>
        <UiBadge variant="career">Career</UiBadge>
      </div>
    `,
  }),
}

export const StackChips: Story = {
  render: () => ({
    components: { UiChip },
    setup: () => ({ chips: CHIPS }),
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        <UiChip v-for="c in chips" :key="c">{{ c }}</UiChip>
      </div>
    `,
  }),
}

export const SketchChips: Story = {
  render: () => ({
    components: { UiChip },
    setup: () => ({ chips: CHIPS }),
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:12px;">
        <UiChip v-for="c in chips" :key="c" variant="sketch">{{ c }}</UiChip>
      </div>
    `,
  }),
}

export const SketchChipStrokes: Story = {
  render: () => ({
    components: { UiChip },
    setup: () => ({ strokes: ['gray', 'ink', 'cyan', 'magenta', 'violet', 'amber'] }),
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:12px;">
        <UiChip v-for="s in strokes" :key="s" variant="sketch" :stroke="s">{{ s }}</UiChip>
      </div>
    `,
  }),
}

export const FilterPills: Story = {
  render: () => ({
    components: { UiPill },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:10px;">
        <UiPill active>All</UiPill>
        <UiPill>AI</UiPill>
        <UiPill>Code</UiPill>
      </div>
    `,
  }),
}

export const HighlighterMark: Story = {
  render: () => ({
    components: { UiHighlight },
    template: `
      <p class="text-[17px] text-ink dark:text-chalk">
        <UiHighlight>marked like a real highlighter</UiHighlight>
      </p>
    `,
  }),
}
