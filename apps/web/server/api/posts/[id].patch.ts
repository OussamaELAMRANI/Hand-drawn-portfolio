import { and, eq, ne, posts } from '@larevo/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  if (!isUuid(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid post id' })
  const input = await readValidatedBody(event, postPatch.parse)
  const db = useDb()

  const existing = await db.query.posts.findFirst({ where: eq(posts.id, id) })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Post not found' })

  if (input.slug && input.slug !== existing.slug) {
    const taken = await db.query.posts.findFirst({
      where: and(eq(posts.slug, input.slug), ne(posts.id, id)),
    })
    if (taken) throw createError({ statusCode: 409, statusMessage: 'Slug already in use' })
  }

  const { tags: tagNames, ...fields } = input
  // drizzle throws on an empty .set(), so a tags-only patch skips the update
  if (Object.keys(fields).length > 0) {
    await db
      .update(posts)
      .set({
        ...fields,
        // first transition to published stamps the publication date
        ...(fields.status === 'published' && !existing.publishedAt
          ? { publishedAt: new Date() }
          : {}),
      })
      .where(eq(posts.id, id))
  }

  if (tagNames) await syncPostTags(id, tagNames)
  return findPost(id)
})
