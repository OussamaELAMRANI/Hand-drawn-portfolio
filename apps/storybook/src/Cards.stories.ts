import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UiCard } from '@larevo/ui'

const meta = {
  title: 'UI/Card',
  component: UiCard,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['index', 'polaroid', 'callout'] },
  },
} satisfies Meta<typeof UiCard>

export default meta
type Story = StoryObj<typeof meta>

export const IndexCard: Story = {
  args: {
    variant: 'polaroid',
  },

  render: () => ({
    components: { UiCard },
    template: `
      <div style="max-width:320px;padding:20px;">
        <UiCard variant="index">
          <div class="font-mono text-[11.5px] text-cyan">pinned index card</div>
          <div class="font-display text-[30px] leading-none text-ink dark:text-chalk">Card title</div>
          <p class="text-sm text-ink-600 dark:text-chalk-600 mt-2 mb-0">
            Rough border, offset shadow, a push-pin and a slight tilt that straightens on hover.
          </p>
        </UiCard>
      </div>
    `,
  }),
}

export const Polaroid: Story = {
  render: () => ({
    components: { UiCard },
    template: `
      <div style="max-width:260px;padding:20px;">
        <UiCard variant="polaroid">
          <div class="aspect-square flex items-center justify-center
                      bg-[repeating-linear-gradient(45deg,#efefe8_0_10px,#f7f7f1_10px_20px)]
                      dark:bg-[repeating-linear-gradient(45deg,#23262d_0_10px,#262931_10px_20px)]">
            <span class="font-mono text-[10px] text-ink-400 dark:text-chalk-500">[ photo ]</span>
          </div>
          <div class="font-display text-[26px] mt-2 leading-none text-ink dark:text-chalk">Polaroid</div>
          <div class="font-hand text-[13px] text-ink-500 dark:text-chalk-500">taped photo card</div>
        </UiCard>
      </div>
    `,
  }),
}

export const Callout: Story = {
  render: () => ({
    components: { UiCard },
    template: `
      <div style="max-width:340px;padding:20px;">
        <UiCard variant="callout">
          <div class="font-hand text-base text-magenta mb-1">✎ callout / note</div>
          <p class="m-0 text-[15px] text-ink-600 dark:text-chalk-600">
            For rules, tips and asides — tinted background with a colored sketchy border.
          </p>
        </UiCard>
      </div>
    `,
  }),
}

export const AllCards: Story = {
  render: () => ({
    components: { UiCard },
    template: `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:20px;">
        <UiCard variant="index">
          <div class="font-mono text-[11.5px] text-cyan">pinned index card</div>
          <div class="font-display text-[30px] leading-none text-ink dark:text-chalk">Card title</div>
        </UiCard>
        <UiCard variant="polaroid">
          <div class="font-display text-[26px] leading-none text-ink dark:text-chalk">Polaroid</div>
          <div class="font-hand text-[13px] text-ink-500 dark:text-chalk-500">taped photo card</div>
        </UiCard>
        <UiCard variant="callout">
          <div class="font-hand text-base text-magenta">✎ callout / note</div>
        </UiCard>
      </div>
    `,
  }),
}
