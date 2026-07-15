import { sql } from 'drizzle-orm'
import { boolean, date, pgEnum, pgTable, text, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { timestampable } from './timestamp'

export const bookingStatus = pgEnum('booking_status', ['confirmed', 'cancelled'])

export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull(),
    message: text('message'),
    date: date('date').notNull(),
    slot: varchar('slot').notNull(),
    status: bookingStatus('status').notNull().default('confirmed'),
    // cleared when an admin opens /admin/bookings — drives the dashboard's unread badge
    read: boolean('read').notNull().default(false),
    // id of the event created on the primary Google connection's calendar, if
    // any — lets cancellation clean up the calendar event too
    googleEventId: varchar('google_event_id'),
    ...timestampable,
  },
  // a cancelled booking frees its slot back up, so the uniqueness only
  // applies among still-confirmed rows — guards against a race between two
  // people submitting the same slot at once
  (t) => [
    uniqueIndex('bookings_date_slot_confirmed_idx')
      .on(t.date, t.slot)
      .where(sql`${t.status} = 'conf' ||
      'irmed'`),
  ],
)

export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
