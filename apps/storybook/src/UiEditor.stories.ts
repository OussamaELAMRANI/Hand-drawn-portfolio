import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { UiEditor } from '@larevo/ui'
import type { JSONContent } from '@larevo/ui'

// exercises every mark and custom node the toolbar can insert
const SAMPLE_DOC: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Try the toolbar — ' },
        { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
        { type: 'text', text: ', or ' },
        { type: 'text', text: 'highlighted', marks: [{ type: 'highlight' }] },
        { type: 'text', text: ' text, plus ' },
        {
          type: 'chip',
          attrs: { variant: 'sketch', stroke: null },
          content: [{ type: 'text', text: 'TypeScript' }],
        },
        { type: 'text', text: ' ' },
        { type: 'badge', attrs: { variant: 'ai' }, content: [{ type: 'text', text: 'AI' }] },
        { type: 'text', text: ' ' },
        { type: 'pill', attrs: { active: true }, content: [{ type: 'text', text: 'Active' }] },
        { type: 'text', text: ' ' },
        { type: 'tape', attrs: {} },
        { type: 'text', text: ' ' },
        { type: 'pin', attrs: {} },
      ],
    },
    {
      type: 'sketchBox',
      attrs: { color: '#0E93A8', shape: 'rect' },
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'A sketch box wraps a whole block of content.' }],
        },
      ],
    },
  ],
}

const meta = {
  title: 'UI/Rich Text Editor',
  component: UiEditor,
  tags: ['autodocs'],
  argTypes: {
    editable: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof UiEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  render: () => ({
    components: { UiEditor },
    setup: () => ({ content: ref<JSONContent | null>(null) }),
    template: '<UiEditor v-model="content" style="max-width: 640px" />',
  }),
}

export const WithContent: Story = {
  render: () => ({
    components: { UiEditor },
    setup: () => ({ content: ref<JSONContent | null>(SAMPLE_DOC) }),
    template: '<UiEditor v-model="content" style="max-width: 640px" />',
  }),
}

/** `editable: false` renders the document read-only with no toolbar chrome —
 *  this is how the public site (HeroMe, blog posts) displays saved content */
export const ReadOnly: Story = {
  render: () => ({
    components: { UiEditor },
    setup: () => ({ content: ref<JSONContent | null>(SAMPLE_DOC) }),
    template: '<UiEditor :model-value="content" :editable="false" style="max-width: 640px" />',
  }),
}
