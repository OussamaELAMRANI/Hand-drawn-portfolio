import { asc, eq, experienceTags, ilike, postTags, sql, tags } from '@larevo/db'

// ?q= turns the listing into ranked autocomplete search: exact match > prefix > substring
export default defineEventHandler(async (event) => {
  const q = getQuery(event).q?.toString().trim().replace(/^#/, '').toLowerCase() ?? ''

  const base = useDb()
    .select({
      id: tags.id,
      name: tags.name,
      // distinct: the two left joins would otherwise multiply each other's rows
      postCount: sql<number>`count(distinct ${postTags.postId})::int`,
      experienceCount: sql<number>`count(distinct ${experienceTags.experienceId})::int`,
    })
    .from(tags)
    .leftJoin(postTags, eq(postTags.tagId, tags.id))
    .leftJoin(experienceTags, eq(experienceTags.tagId, tags.id))
    .groupBy(tags.id)

  if (!q) return base.orderBy(asc(tags.name))

  const escaped = q.replace(/[\\%_]/g, (m) => `\\${m}`)
  return base
    .where(ilike(tags.name, `%${escaped}%`))
    .orderBy(
      sql`(${tags.name} = ${q}) DESC`,
      sql`(${tags.name} ILIKE ${escaped + '%'}) DESC`,
      asc(tags.name),
    )
    .limit(12)
})
