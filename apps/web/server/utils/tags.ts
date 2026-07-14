import { eq, tags, inArray, postTags, experienceTags } from '@larevo/db'

export function normalizeTag(name: string): string {
  return slugify(name.replace(/^#/, ''))
}

/** Upsert tags by name and return their ids. */
async function upsertTags(names: string[]): Promise<string[]> {
  const db = useDb()
  const normalized = [...new Set(names.map(normalizeTag).filter(Boolean))]
  if (normalized.length === 0) return []

  await db
    .insert(tags)
    .values(normalized.map((name) => ({ name })))
    .onConflictDoNothing()
  const rows = await db
    .select({ id: tags.id })
    .from(tags)
    .where(inArray(tags.name, normalized))
  return rows.map(({ id }) => id)
}

/** Replace a post's tag links, creating missing tags on the fly. */
export async function syncPostTags(postId: string, names: string[]) {
  const db = useDb()
  await db.delete(postTags).where(eq(postTags.postId, postId))
  const ids = await upsertTags(names)
  if (ids.length === 0) return
  await db.insert(postTags).values(ids.map((tagId) => ({ postId, tagId })))
}

/** Replace an experience's tag links, creating missing tags on the fly. */
export async function syncExperienceTags(experienceId: string, names: string[]) {
  const db = useDb()
  await db.delete(experienceTags).where(eq(experienceTags.experienceId, experienceId))
  const ids = await upsertTags(names)
  if (ids.length === 0) return
  await db.insert(experienceTags).values(ids.map((tagId) => ({ experienceId, tagId })))
}
