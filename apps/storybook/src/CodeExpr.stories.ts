import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CodeExpr } from '@larevo/ui'

const meta = {
  title: 'Features/CodeExpr',
  component: CodeExpr,
  tags: ['autodocs'],
} satisfies Meta<typeof CodeExpr>

export default meta
type Story = StoryObj<typeof meta>

/** the "from sketch to shipped" spotlight: wireframe card + typed terminal */
export const Default: Story = {}

export const CustomSnippet: Story = {
  args: {
    eyebrow: 'how it works',
    title: 'Sketch, then ship',
    codeTitle: '~/app/server.ts',
    lang: 'ts',
    code: `import { createServer } from '@core/http'

const server = createServer({ port: 3000 })
server.listen(() => console.log('ready'))`,
  },
}
