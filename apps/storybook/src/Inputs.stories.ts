import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UiInput, UiTextarea, UiSelect } from '@larevo/ui'

const meta = {
  title: 'UI/Form Inputs',
  component: UiInput,
  tags: ['autodocs'],
} satisfies Meta<typeof UiInput>

export default meta
type Story = StoryObj<typeof meta>

export const AllInputs: Story = {
  render: () => ({
    components: { UiInput, UiTextarea, UiSelect },
    template: `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;align-items:start;max-width:820px;padding:16px;">
        <div>
          <div class="font-hand text-[15px] text-ink-600 dark:text-chalk-600 mb-1">Text field</div>
          <UiInput placeholder="you@email.com" />
        </div>
        <div>
          <div class="font-hand text-[15px] text-ink-600 dark:text-chalk-600 mb-1">Select</div>
          <UiSelect :options="['AI', 'Code', 'News']" model-value="AI" />
        </div>
        <div>
          <div class="font-hand text-[15px] text-ink-600 dark:text-chalk-600 mb-1">Filled</div>
          <UiInput model-value="focused state" />
        </div>
        <div style="grid-column:1 / -1;">
          <div class="font-hand text-[15px] text-ink-600 dark:text-chalk-600 mb-1">Textarea</div>
          <UiTextarea placeholder="One or two sentences…" />
        </div>
      </div>
    `,
  }),
}
