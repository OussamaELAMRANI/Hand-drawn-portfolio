import { and, bookings, eq, gte, lte } from '@larevo/db'

// keep in sync with CalendarBooking.vue's default `slots` prop — the API
// doesn't know the frontend's slot list, so Google freebusy checks assume this
const DEFAULT_SLOTS = ['09:30', '11:00', '13:00', '14:30', '16:00']

// public: which {date, slot} pairs are already taken in a given month — no
// visitor PII exposed here, just enough to gray out the calendar. Merges our
// own bookings with busy time on any connected Google calendar.
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const now = new Date()
  const year = Number(query.year) || now.getFullYear()
  const month = Number(query.month) || now.getMonth() + 1 // 1-indexed

  const pad = (n: number) => String(n).padStart(2, '0')
  const daysInMonth = new Date(year, month, 0).getDate()
  const start = `${year}-${pad(month)}-01`
  const end = `${year}-${pad(month)}-${pad(daysInMonth)}`

  const bookedRows = await useDb()
    .select({ date: bookings.date, slot: bookings.slot })
    .from(bookings)
    .where(and(eq(bookings.status, 'confirmed'), gte(bookings.date, start), lte(bookings.date, end)))

  const taken = new Set(bookedRows.map((r) => `${r.date}|${r.slot}`))
  const result = [...bookedRows]

  const connections = await useDb().query.googleConnections.findMany()
  if (connections.length > 0) {
    const { bookingTimezone, bookingSlotMinutes } = useRuntimeConfig()
    const timeMin = zonedTimeToUtcIso(start, '00:00', bookingTimezone)
    const timeMax = zonedTimeToUtcIso(end, '23:59', bookingTimezone)
    const busyByConnection = await Promise.all(connections.map((c) => queryFreeBusy(c, timeMin, timeMax)))
    const busyIntervals = busyByConnection
      .flat()
      .map((b) => ({ start: new Date(b.start).getTime(), end: new Date(b.end).getTime() }))

    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${year}-${pad(month)}-${pad(d)}`
      for (const slot of DEFAULT_SLOTS) {
        const key = `${date}|${slot}`
        if (taken.has(key)) continue
        const slotStart = new Date(zonedTimeToUtcIso(date, slot, bookingTimezone)).getTime()
        const slotEnd = slotStart + bookingSlotMinutes * 60_000
        if (busyIntervals.some((b) => slotStart < b.end && slotEnd > b.start)) {
          taken.add(key)
          result.push({ date, slot })
        }
      }
    }
  }

  return result
})
