import { eq, or, posts, type Post } from '@larevo/db'

export const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)

interface PostRelations {
  author: { id: string; name: string | null }
  postTags: { tag: { name: string } }[]
}

export type SerializedPost = Omit<Post & PostRelations, 'postTags'> & { tags: string[] }

export function serializePost<T extends PostRelations>({ postTags, ...post }: T) {
  return { ...post, tags: postTags.map((pt) => pt.tag.name) }
}

/** Fetch one post (by id or slug) with author + tags, serialized for the API. */
export async function findPost(idOrSlug: string) {
  const row = await useDb().query.posts.findFirst({
    where: isUuid(idOrSlug)
      ? or(eq(posts.id, idOrSlug), eq(posts.slug, idOrSlug))
      : eq(posts.slug, idOrSlug),
    with: {
      author: { columns: { id: true, name: true } },
      postTags: { with: { tag: { columns: { name: true } } } },
    },
  })
  return row ? serializePost(row) : null
}
