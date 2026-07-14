import { desc, eq, posts } from '@larevo/db'

// public: published posts only — admins also see drafts
export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  const rows = await useDb().query.posts.findMany({
    where: user?.role === 'admin' ? undefined : eq(posts.status, 'published'),
    orderBy: [desc(posts.createdAt)],
    with: {
      author: { columns: { id: true, name: true } },
      postTags: { with: { tag: { columns: { name: true } } } },
    },
  })
  return rows.map(serializePost)
})
