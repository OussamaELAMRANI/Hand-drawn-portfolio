import { and, eq, ne, tags } from '@larevo/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  if (!isUuid(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid tag id' })
  const input = await readValidatedBody(event, tagInput.parse)

  const name = normalizeTag(input.name)
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Name must contain letters or digits' })
  }
  const db = useDb()
  const taken = await db.query.tags.findFirst({
    where: and(eq(tags.name, name), ne(tags.id, id)),
  })
  if (taken) throw createError({ statusCode: 409, statusMessage: 'Tag already exists' })

  const [updated] = await db
    .update(tags)
    .set({ name })
    .where(eq(tags.id, id))
    .returning()
  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Tag not found' })
  return updated
})
