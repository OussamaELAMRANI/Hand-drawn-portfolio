import { eq, tags } from '@larevo/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  if (!isUuid(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid tag id' })

  const [deleted] = await useDb().delete(tags).where(eq(tags.id, id)).returning()
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Tag not found' })
  return { ok: true }
})
