import { desc, sql } from '@larevo/db'

export default defineEventHandler(async () => {
  const rows = await useDb().query.experience.findMany({
    with: { experienceTags: { with: { tag: { columns: { name: true } } } } },
    orderBy: (experience) => [
      sql`${experience.startDate} DESC NULLS LAST`,
      desc(experience.createdAt),
    ],
  })
  return rows.map(serializeExperience)
})
