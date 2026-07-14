import { pgTable, uuid, varchar, pgEnum, timestamp } from 'drizzle-orm/pg-core'
import { timestampable } from './timestamp'

export const userRole = pgEnum('user_role', ['admin', 'editor', 'user'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email').notNull().unique(),
  name: varchar('name'),
  role: userRole('role').notNull().default('user'),
  passwordHash: varchar('password_hash'),
  ...timestampable,
})

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ...timestampable,
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
