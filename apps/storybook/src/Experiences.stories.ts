import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Experiences } from '@larevo/ui'

const meta = {
  title: 'Features/Experiences',
  component: Experiences,
  tags: ['autodocs'],
} satisfies Meta<typeof Experiences>

export default meta
type Story = StoryObj<typeof meta>

const longHistory = [
  {
    period: '2024 — now',
    title: 'Staff Engineer',
    company: 'Scale-up · Remote',
    blurb: 'Platform architecture across six squads; paved-road tooling and golden paths.',
    tags: ['TypeScript', 'AWS', 'DDD'],
  },
  {
    period: '2022 — 2024',
    title: 'Senior Full-Stack Engineer',
    company: 'Freelance · Remote',
    blurb: 'TypeScript/Node services and Next.js + Nuxt frontends for product teams.',
    tags: ['TypeScript', 'Next.js', 'DDD'],
  },
  {
    period: '2019 — 2022',
    title: 'Full-Stack Developer',
    company: 'Digital Agency',
    blurb: 'Scaled Symfony + Vue apps on Postgres & Redis across a dozen client products.',
    tags: ['Symfony', 'Vue.js', 'Redis'],
  },
  {
    period: '2017 — 2019',
    title: 'Web Developer',
    company: 'Product Startup',
    blurb: 'Laravel/MySQL backends and my first React frontends.',
    tags: ['Laravel', 'React', 'MySQL'],
  },
  {
    period: '2016 — 2017',
    title: 'Junior Developer',
    company: 'Web Studio',
    blurb: 'WordPress themes, jQuery widgets, and the fundamentals.',
    tags: ['PHP', 'jQuery'],
  },
]

/** up to `maxGrid` (4) roles: the pinned index-card grid */
export const Grid: Story = {
  args: { roles: longHistory.slice(0, 3) },
}

/** more than `maxGrid` roles: the grid becomes a slider — 3 per view, arrows step one card */
export const Slider: Story = {
  args: { roles: longHistory },
}
