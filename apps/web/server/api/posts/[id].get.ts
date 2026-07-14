// accepts a post id (uuid) or slug; drafts are admin-only
export default defineEventHandler(async (event) => {
  const idOrSlug = getRouterParam(event, 'id')!
  const post = await findPost(idOrSlug)

  if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  if (post.status !== 'published') {
    const user = await getSessionUser(event)
    if (user?.role !== 'admin') {
      throw createError({ statusCode: 404, statusMessage: 'Post not found' })
    }
  }
  return post
})
