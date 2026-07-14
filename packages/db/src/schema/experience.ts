import { date, pgTable, primaryKey, text, uuid, varchar } from 'drizzle-orm/pg-core'
import { timestampable } from './timestamp'
import { tags } from './tag'

export const experience = pgTable('experiences', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title').notNull(),
  roles: text('roles').array().notNull().default([]),
  description: text('description'),
  learned: text('learned'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  ...timestampable,
})

export const experienceTags = pgTable(
  'experience_tags',
  {
    experienceId: uuid('experience_id')
      .notNull()
      .references(() => experience.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.experienceId, t.tagId] })],
)

export type Experience = typeof experience.$inferSelect
export type NewExperience = typeof experience.$inferInsert
export type ExperienceTags = typeof experienceTags.$inferSelect