import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Typography } from '@larevo/ui'

// token swatches straight from DesignSystem.dc.html §01 + §11
const COLORS = [
  { name: 'Paper', hex: '#FDFDFD', use: 'background' },
  { name: 'Ink', hex: '#2A2A2A', use: 'primary text' },
  { name: 'Graphite', hex: '#3A3A3A', use: 'body text' },
  { name: 'Faded ink', hex: '#7A7A70', use: 'muted / captions' },
  { name: 'Marker yellow', hex: '#FCE34B', use: 'highlight · primary fill' },
  { name: 'Cyan', hex: '#0E93A8', use: 'links · accents' },
  { name: 'Sky fill', hex: '#6FD3E0', use: 'tape · secondary fill' },
  { name: 'Magenta', hex: '#C0577F', use: 'CTA · destructive · AI' },
  { name: 'Violet', hex: '#8A6BCF', use: 'category · News' },
  { name: 'Amber', hex: '#C98A2B', use: 'category · Career' },
  { name: 'Dot grid', hex: '#DCDCD4', use: 'paper texture' },
  { name: 'Terminal', hex: '#22252B', use: 'code surface' },
]

const SHADOWS = [
  { name: 'Sticky note', cls: 'shadow-sticky', value: '5px 7px 0 rgba(42,42,42,.10)' },
  { name: 'Lifted card', cls: 'shadow-lifted', value: '7px 9px 0 rgba(42,42,42,.12)' },
  { name: 'Terminal', cls: 'shadow-terminal', value: '8px 10px 0 rgba(42,42,42,.14)' },
]

const meta = {
  title: 'Foundations/Tokens',
  component: Typography,
  tags: ['autodocs'],
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const Colors: Story = {
  render: () => ({
    setup: () => ({ colors: COLORS }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;">
        <div v-for="c in colors" :key="c.hex"
             class="bg-white dark:bg-night-800 p-3 shadow-sticky rounded">
          <div :style="{ background: c.hex }"
               style="height:78px;border-radius:6px;border:1px solid rgba(42,42,42,0.10);"></div>
          <div class="font-hand text-[17px] mt-2 leading-none text-ink dark:text-chalk">{{ c.name }}</div>
          <div class="font-mono text-[11.5px] text-ink-400 dark:text-chalk-500">{{ c.hex }}</div>
          <div class="text-xs text-ink-500 dark:text-chalk-500 mt-0.5">{{ c.use }}</div>
        </div>
      </div>
    `,
  }),
}

export const Elevation: Story = {
  render: () => ({
    setup: () => ({ shadows: SHADOWS }),
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:26px;">
        <div v-for="s in shadows" :key="s.name" :class="s.cls"
             class="bg-white dark:bg-night-800 border-[1.5px] border-[#ecece4] dark:border-night-600 rounded-lg px-6 py-5">
          <div class="font-hand text-lg text-ink dark:text-chalk">{{ s.name }}</div>
          <div class="font-mono text-[11px] text-ink-400 dark:text-chalk-500 mt-1">{{ s.value }}</div>
        </div>
      </div>
    `,
  }),
}
