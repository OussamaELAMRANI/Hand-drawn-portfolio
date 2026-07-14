import { eq, overview } from '@larevo/db'

// singleton resource: creates the row on first save, replaces it in full after
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const input = await readValidatedBody(event, overviewInput.parse)
  const db = useDb()

  const existing = await db.query.overview.findFirst()
  if (existing) {
    const [updated] = await db
      .update(overview)
      .set(input)
      .where(eq(overview.id, existing.id))
      .returning()
    return updated
  }

  const [created] = await db.insert(overview).values(input).returning()
  setResponseStatus(event, 201)
  return created
})
