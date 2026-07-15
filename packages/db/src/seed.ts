import { hashPassword } from './password'
import { experience, experienceTags, tags, users } from './schema'
import { createDb, sql } from './index'

const db = createDb(
  process.env.DATABASE_URL!!
)

const password = process.env.SEED_ADMIN_PASSWORD
if (!password) {
  console.error('SEED_ADMIN_PASSWORD is not set (add it to packages/db/.env)')
  process.exit(1)
}
const passwordHash = await hashPassword(password)

const [admin] = await db
  .insert(users)
  .values({
    email: 'oussama1elamrani@gmail.com',
    name: 'Oussama ELAMRANI',
    role: 'admin',
    passwordHash,
  })
  .onConflictDoUpdate({ target: users.email, set: { role: 'admin', passwordHash } })
  .returning({ id: users.id, email: users.email, role: users.role })

console.log('admin user ready:', admin)

const dummyExperiences = [
  {
    title: 'Senior Full-Stack Engineer',
    roles: ['Freelance', 'Remote'],
    description:
      'Architecting TypeScript/Node services and Next.js + Nuxt frontends for product teams. ' +
      'Own the boundary between design system and app code, push for DDD-flavored modules and ' +
      'high test coverage on anything that touches money or auth.',
    learned:
      'That a well-drawn module boundary saves more time in review than any lint rule — once ' +
      'the domain layer stopped importing framework code, onboarding new contractors got a lot faster.',
    startDate: '2022-03-01',
    endDate: null,
    tagNames: ['TypeScript', 'Next.js', 'Nuxt', 'DDD'],
  },
  {
    title: 'Full-Stack Developer',
    roles: ['Digital Agency', 'On-site'],
    description:
      'Built and scaled Symfony + Vue apps on Postgres & Redis for a dozen client products. ' +
      'Owned CI pipelines, caching layers and API design, and mentored two junior devs through ' +
      'their first production incidents.',
    learned:
      'Cache invalidation is a people problem before it is a code problem — most of the stale-data ' +
      'bugs traced back to two teams disagreeing on what a cache key should represent.',
    startDate: '2019-06-01',
    endDate: '2022-02-28',
    tagNames: ['Symfony', 'Vue.js', 'Redis', 'PostgreSQL'],
  },
  {
    title: 'Web Developer',
    roles: ['Product Startup'],
    description:
      'Shipped Laravel/MySQL backends and my first React frontends for an early-stage SaaS. ' +
      'Learned to move fast without breaking the important things, under a founder who reviewed ' +
      'every PR personally.',
    learned:
      'Ship the boring version first. The feature that took two days to "do right" almost always ' +
      'got redesigned within a month anyway once real users touched it.',
    startDate: '2017-09-01',
    endDate: '2019-05-31',
    tagNames: ['Laravel', 'React', 'MySQL'],
  },
  {
    title: 'Backend Engineer — Payments',
    roles: ['Contract'],
    description:
      'Rebuilt a checkout service migrating from a monolith to isolated Node workers behind a ' +
      'message queue, with idempotency keys and reconciliation jobs to keep ledgers honest.',
    learned:
      'Idempotency is not a nice-to-have on payment endpoints — it is the difference between a ' +
      'retried request and a customer charged twice.',
    startDate: '2021-01-01',
    endDate: '2021-08-31',
    tagNames: ['Node.js', 'PostgreSQL', 'RabbitMQ'],
  },
  {
    title: 'Junior Developer',
    roles: ['First job', 'On-site'],
    description:
      'Started out fixing bugs in a legacy PHP admin panel, then graduated to small features. ' +
      'Learned Git, code review etiquette, and how to read a stack trace without panicking.',
    learned:
      'Asking "why" about an existing pattern before changing it saved me from breaking things I ' +
      "didn't know were load-bearing more than once.",
    startDate: '2016-09-01',
    endDate: '2017-08-31',
    tagNames: ['PHP', 'jQuery', 'MySQL'],
  },
]

const [experienceCountRow] = await db
  .select({ count: sql<number>`count(*)::int` })
  .from(experience)
const experienceCount = experienceCountRow?.count ?? 0

if (experienceCount > 0) {
  console.log(`experiences already seeded (${experienceCount} rows), skipping`)
} else {
  for (const { tagNames, ...values } of dummyExperiences) {
    const [row] = await db.insert(experience).values(values).returning({ id: experience.id })
    const tagIds = await Promise.all(
      tagNames.map(async (name) => {
        const [tag] = await db
          .insert(tags)
          .values({ name })
          .onConflictDoUpdate({ target: tags.name, set: { name } })
          .returning({ id: tags.id })
        return tag!.id
      }),
    )
    await db.insert(experienceTags).values(tagIds.map((tagId) => ({ experienceId: row!.id, tagId })))
  }
  console.log(`seeded ${dummyExperiences.length} experiences`)
}

process.exit(0)
