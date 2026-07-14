import { jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { timestampable } from './timestamp'

export interface OverviewCard {
  image?: string
  alt?: string
  caption?: string
  note?: string
}

export const overview = pgTable('overview', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  // rich-text document (TipTap JSON), same shape as posts.body
  tagline: jsonb('tagline').notNull(),
  bio: jsonb('bio').notNull(),
  cards: jsonb('cards').$type<OverviewCard[]>().notNull().default([]),
  ...timestampable,
})

export type Overview = typeof overview.$inferSelect
export type NewOverview = typeof overview.$inferInsert
