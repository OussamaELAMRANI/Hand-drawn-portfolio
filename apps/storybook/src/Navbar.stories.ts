import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UiNavbar } from '@larevo/ui'

const meta = {
  title: 'UI/Navbar',
  component: UiNavbar,
  tags: ['autodocs'],
} satisfies Meta<typeof UiNavbar>

export default meta
type Story = StoryObj<typeof meta>

const links = [
  { label: 'Experience', href: '#' },
  { label: 'Code', href: '#' },
  { label: 'Travels', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Book Me', href: '#' },
]

export const Full: Story = {
  args: {
    links,
    cta: { label: 'Hire Me', href: '#' },
  },
}

export const BrandOnly: Story = {
  args: {},
}

export const CustomBrand: Story = {
  render: () => ({
    components: { UiNavbar },
    setup: () => ({ links }),
    template: `
      <UiNavbar :links="links">
        <template #brand>the<span class="text-magenta">.studio</span></template>
      </UiNavbar>
    `,
  }),
}
