import { eq, posts } from '@larevo/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  if (!isUuid(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid post id' })

  const [deleted] = await useDb().delete(posts).where(eq(posts.id, id)).returning()
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  return { ok: true }
})
