import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CommentCode } from '@larevo/ui'

const meta = {
  title: 'UI/CommentCode',
  component: CommentCode,
  tags: ['autodocs'],
} satisfies Meta<typeof CommentCode>

export default meta
type Story = StoryObj<typeof meta>

/** hand-written code-comment eyebrow; the `//` prefix is built in */
export const Default: Story = {
  render: () => ({
    components: { CommentCode },
    template: `
      <div class="flex flex-col gap-3">
        <CommentCode>hey there, I'm</CommentCode>
        <CommentCode :rotate="-0.8">feature spotlight</CommentCode>
        <CommentCode :rotate="2">tilted the other way</CommentCode>
      </div>
    `,
  }),
}
