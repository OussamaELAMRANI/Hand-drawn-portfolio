import { tags } from '@larevo/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const input = await readValidatedBody(event, tagInput.parse)

  const name = normalizeTag(input.name)
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Name must contain letters or digits' })
  }

  const [created] = await useDb()
    .insert(tags)
    .values({ name })
    .onConflictDoNothing()
    .returning()
  if (!created) throw createError({ statusCode: 409, statusMessage: 'Tag already exists' })

  setResponseStatus(event, 201)
  return created
})
