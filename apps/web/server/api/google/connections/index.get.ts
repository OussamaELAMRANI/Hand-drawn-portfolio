import { asc, googleConnections } from '@larevo/db'

// admin only: connection metadata — never the tokens
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  return useDb()
    .select({
      id: googleConnections.id,
      label: googleConnections.label,
      email: googleConnections.email,
      isPrimary: googleConnections.isPrimary,
    })
    .from(googleConnections)
    .orderBy(asc(googleConnections.createdAt))
})
