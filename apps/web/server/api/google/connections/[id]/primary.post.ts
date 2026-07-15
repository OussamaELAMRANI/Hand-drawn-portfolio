import { eq, googleConnections, ne } from '@larevo/db'

// admin only: switches which connection new calendar events get created on
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  if (!isUuid(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid connection id' })

  const db = useDb()
  const existing = await db.query.googleConnections.findFirst({ where: eq(googleConnections.id, id) })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Connection not found' })

  await db.update(googleConnections).set({ isPrimary: false }).where(ne(googleConnections.id, id))
  await db.update(googleConnections).set({ isPrimary: true }).where(eq(googleConnections.id, id))

  return { ok: true }
})
