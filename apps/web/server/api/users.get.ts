import { users } from '@larevo/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return useDb()
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
})
