import { eq, experience } from '@larevo/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  if (!isUuid(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid experience id' })
  const { tags: tagNames, ...fields } = await readValidatedBody(event, experiencePatch.parse)
  const db = useDb()

  // drizzle throws on an empty .set(), so a tags-only patch skips the update
  const [updated] = Object.keys(fields).length
    ? await db.update(experience).set(fields).where(eq(experience.id, id)).returning()
    : await db.select().from(experience).where(eq(experience.id, id))
  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Experience not found' })

  if (tagNames) await syncExperienceTags(id, tagNames)
  return findExperience(id)
})
