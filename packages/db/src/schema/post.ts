import { pgTable, jsonb, text, timestamp, uuid, pgEnum, primaryKey } from 'drizzle-orm/pg-core'
import { timestampable } from './timestamp'
import { users } from './user'
import { tags } from './tag'
import { experience } from './experience'

export const postStatus = pgEnum('post_status', ['draft', 'published'])

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  // rich-text document (TipTap JSON), not plain text
  body: jsonb('body').notNull(),
  status: postStatus('status').notNull().default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id),
  ...timestampable,
})

export const postTags = pgTable(
  'post_tags',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })],
)

export type Post = typeof posts.$inferSelect
export type PostTags = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert