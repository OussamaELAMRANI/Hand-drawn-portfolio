import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UiLink } from '@larevo/ui'

const meta = {
  title: 'UI/Link',
  component: UiLink,
  tags: ['autodocs'],
} satisfies Meta<typeof UiLink>

export default meta
type Story = StoryObj<typeof meta>

export const Wavy: Story = {
  render: () => ({
    components: { UiLink },
    template: `
      <div class="flex flex-col gap-3 text-[17px] text-ink-600 dark:text-chalk-600">
        <div>Default wavy underline: <UiLink href="#">read the case study</UiLink> — hover to see it shift to magenta.</div>
        <div>Inline in a sentence, links stay <UiLink href="#">legible and quiet</UiLink> against the body text.</div>
        <div class="font-hand"><UiLink href="#">← back home</UiLink></div>
      </div>
    `,
  }),
}
