import { relations } from 'drizzle-orm'
import { users, sessions } from './user'
import { posts, postTags } from './post'
import { tags } from './tag'
import { experience, experienceTags } from './experience'

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  sessions: many(sessions),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  postTags: many(postTags),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
  experienceTags: many(experienceTags),
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
}))

export const experienceRelations = relations(experience, ({ many }) => ({
  experienceTags: many(experienceTags),
}))

export const experienceTagsRelations = relations(experienceTags, ({ one }) => ({
  experience: one(experience, {
    fields: [experienceTags.experienceId],
    references: [experience.id],
  }),
  tag: one(tags, { fields: [experienceTags.tagId], references: [tags.id] }),
}))