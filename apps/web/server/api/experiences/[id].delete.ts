import { eq, experience } from '@larevo/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  if (!isUuid(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid experience id' })

  const [deleted] = await useDb().delete(experience).where(eq(experience.id, id)).returning()
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Experience not found' })
  return { ok: true }
})
