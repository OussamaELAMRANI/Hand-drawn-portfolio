import { experience } from '@larevo/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { tags: tagNames, ...fields } = await readValidatedBody(event, experienceInput.parse)

  const [created] = await useDb().insert(experience).values(fields).returning()
  await syncExperienceTags(created!.id, tagNames)
  setResponseStatus(event, 201)
  return findExperience(created!.id)
})
