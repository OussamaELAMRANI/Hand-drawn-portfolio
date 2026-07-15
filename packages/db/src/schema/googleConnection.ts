import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { timestampable } from './timestamp'

// one row per connected Google account (e.g. "Work", "Personal") — freebusy
// checks merge across every row here; events get created on the isPrimary one
export const googleConnections = pgTable('google_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: varchar('label').notNull(),
  email: varchar('email').notNull().unique(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  tokenExpiresAt: timestamp('token_expires_at', { withTimezone: true }).notNull(),
  isPrimary: boolean('is_primary').notNull().default(false),
  ...timestampable,
})

export type GoogleConnection = typeof googleConnections.$inferSelect
export type NewGoogleConnection = typeof googleConnections.$inferInsert
