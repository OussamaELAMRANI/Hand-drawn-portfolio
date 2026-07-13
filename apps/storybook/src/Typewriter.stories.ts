import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UiHighlight, UiTypewriter } from '@larevo/ui'

const meta = {
  title: 'UI/Typewriter',
  component: UiTypewriter,
  tags: ['autodocs'],
} satisfies Meta<typeof UiTypewriter>

export default meta
type Story = StoryObj<typeof meta>

/** array form: plain strings and trusted-HTML paragraphs */
export const ParagraphArray: Story = {
  args: {
    startOnVisible: false,
    paragraphs: [
      'First a plain-text paragraph, typed character by character.',
      {
        content:
          'Then an <strong>HTML paragraph</strong> — tags appear <em>intact</em> while the text types.',
        html: true,
        class: 'text-ink-600 dark:text-chalk-600',
      },
      { content: 'A hand-written line, via tag + class.', tag: 'div', class: 'font-hand text-[19px] text-cyan' },
    ],
  },
}

/** slot form: markup and even Vue components keep working while typing */
export const SlotContent: Story = {
  render: () => ({
    components: { UiTypewriter, UiHighlight },
    template: `
      <UiTypewriter :speed="20" :start-on-visible="false">
        <p class="mb-3 font-display text-[28px]">
          I build <UiHighlight class="text-[28px]">solid web products</UiHighlight> &amp; chase good light.
        </p>
        <p class="text-body text-ink-600 dark:text-chalk-600">
          Senior Full-Stack Engineer — <strong>TypeScript / Node.js</strong> on the back.
        </p>
      </UiTypewriter>
    `,
  }),
}
