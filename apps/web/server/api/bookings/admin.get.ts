import { asc, bookings, eq } from '@larevo/db'

// admin only: full upcoming booking list, including visitor PII
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  return useDb()
    .select()
    .from(bookings)
    .where(eq(bookings.status, 'confirmed'))
    .orderBy(asc(bookings.date), asc(bookings.slot))
})
