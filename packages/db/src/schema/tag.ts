import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { timestampable } from './timestamp'

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull().unique(),
  icon: varchar('icon'),
  ...timestampable
})

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert
