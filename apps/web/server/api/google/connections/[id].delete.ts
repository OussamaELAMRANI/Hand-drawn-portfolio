import { eq, googleConnections } from '@larevo/db'

// admin only: disconnects a Google account (does not touch bookings already made)
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  if (!isUuid(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid connection id' })

  const [deleted] = await useDb().delete(googleConnections).where(eq(googleConnections.id, id)).returning()
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Connection not found' })

  // promote the oldest remaining connection to primary if we just removed it
  if (deleted.isPrimary) {
    const db = useDb()
    const next = await db.query.googleConnections.findFirst({ orderBy: (t, { asc }) => asc(t.createdAt) })
    if (next) await db.update(googleConnections).set({ isPrimary: true }).where(eq(googleConnections.id, next.id))
  }

  return { ok: true }
})
