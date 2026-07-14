import { eq, posts } from '@larevo/db'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)
  const input = await readValidatedBody(event, postInput.parse)
  const db = useDb()

  let slug = input.slug ?? slugify(input.title)
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Title must contain letters or digits' })
  }
  const taken = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
  if (taken) {
    if (input.slug) throw createError({ statusCode: 409, statusMessage: 'Slug already in use' })
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`
  }

  const [post] = await db
    .insert(posts)
    .values({
      title: input.title,
      slug,
      excerpt: input.excerpt ?? null,
      body: input.body,
      status: input.status,
      publishedAt: input.status === 'published' ? new Date() : null,
      authorId: user.id,
    })
    .returning()

  await syncPostTags(post!.id, input.tags)
  setResponseStatus(event, 201)
  return findPost(post!.id)
})
