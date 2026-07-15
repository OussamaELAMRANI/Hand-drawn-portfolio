import { and, bookings, eq } from '@larevo/db'

// admin only: called when the admin opens /admin/bookings — clears the
// dashboard's unread badge without touching which bookings are confirmed/cancelled
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  await useDb()
    .update(bookings)
    .set({ read: true })
    .where(and(eq(bookings.status, 'confirmed'), eq(bookings.read, false)))

  return { ok: true }
})
