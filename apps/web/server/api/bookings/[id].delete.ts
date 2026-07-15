import { bookings, eq } from '@larevo/db'

// admin only: cancelling frees the slot back up for booking
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  if (!isUuid(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid booking id' })

  const [deleted] = await useDb().delete(bookings).where(eq(bookings.id, id)).returning()
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Booking not found' })

  // best-effort: the event lives on whichever connection was primary at
  // booking time, which may not be primary anymore — try every connection
  // and let deleteCalendarEvent's 404/410 handling make the rest no-ops
  if (deleted.googleEventId) {
    const connections = await useDb().query.googleConnections.findMany()
    await Promise.allSettled(
      connections.map((c) => deleteCalendarEvent(c, deleted.googleEventId!)),
    )
  }

  return { ok: true }
})
