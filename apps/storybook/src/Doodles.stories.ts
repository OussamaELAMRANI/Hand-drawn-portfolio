import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UiArrow, UiPin, UiTape, UiDivider } from '@larevo/ui'

const meta = {
  title: 'UI/Doodles',
  component: UiArrow,
  tags: ['autodocs'],
} satisfies Meta<typeof UiArrow>

export default meta
type Story = StoryObj<typeof meta>

export const AllDoodles: Story = {
  render: () => ({
    components: { UiArrow, UiPin, UiTape, UiDivider },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:36px;align-items:center;padding:24px;">
        <div style="text-align:center;">
          <UiArrow />
          <div class="font-hand text-[13px] text-ink-400 dark:text-chalk-500">hand arrow</div>
        </div>
        <div style="text-align:center;">
          <UiPin />
          <div class="font-hand text-[13px] text-ink-400 dark:text-chalk-500 mt-1.5">push-pin</div>
        </div>
        <div style="text-align:center;">
          <UiTape />
          <div class="font-hand text-[13px] text-ink-400 dark:text-chalk-500 mt-2.5">tape</div>
        </div>
        <div style="text-align:center;width:90px;">
          <UiDivider />
          <div class="font-hand text-[13px] text-ink-400 dark:text-chalk-500 mt-1.5">dashed divider</div>
        </div>
      </div>
    `,
  }),
}
