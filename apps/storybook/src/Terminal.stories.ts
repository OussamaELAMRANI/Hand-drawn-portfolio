import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UiTerminal } from '@larevo/ui'

const meta = {
  title: 'UI/Terminal',
  component: UiTerminal,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    lang: { control: 'text' },
    code: { control: 'text' },
  },
} satisfies Meta<typeof UiTerminal>

export default meta
type Story = StoryObj<typeof meta>

const CODE = `export async function deploy(app) {
  const build = await pipeline.build(app);
  await pipeline.test(build);
  return { url: app.url, ok: true };
}`

export const CodeBlock: Story = {
  args: { title: '~/deploy.ts' },
  render: (args) => ({
    components: { UiTerminal },
    setup: () => ({ args, code: CODE }),
    template: '<div style="padding:16px;"><UiTerminal v-bind="args">{{ code }}</UiTerminal></div>',
  }),
}

export const Highlighted: Story = {
  args: { title: '~/deploy.ts', lang: 'typescript', code: CODE },
  render: (args) => ({
    components: { UiTerminal },
    setup: () => ({ args }),
    template: '<div style="padding:16px;"><UiTerminal v-bind="args" /></div>',
  }),
}

/** the code types itself in (character by character) once scrolled into view */
export const Typewriter: Story = {
  args: { title: '~/deploy.ts', lang: 'typescript', code: CODE, typewriter: true },
  render: (args) => ({
    components: { UiTerminal },
    setup: () => ({ args }),
    template: '<div style="padding:16px;"><UiTerminal v-bind="args" /></div>',
  }),
}

export const HighlightedVue: Story = {
  args: {
    title: '~/UiButton.vue',
    lang: 'vue',
    code: `<script setup lang="ts">
const props = defineProps<{ variant?: 'sketch' | 'primary' }>()
</script>

<template>
  <button :class="variant">{{ variant }}</button>
</template>`,
  },
  render: (args) => ({
    components: { UiTerminal },
    setup: () => ({ args }),
    template: '<div style="padding:16px;"><UiTerminal v-bind="args" /></div>',
  }),
}
