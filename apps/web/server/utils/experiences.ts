import type { Experience } from '@larevo/db'

interface ExperienceRelations {
  experienceTags: { tag: { name: string } }[]
}

export type SerializedExperience = Omit<Experience & ExperienceRelations, 'experienceTags'> & {
  tags: string[]
}

export function serializeExperience<T extends ExperienceRelations>({
  experienceTags,
  ...experience
}: T) {
  return { ...experience, tags: experienceTags.map((et) => et.tag.name) }
}

/** Fetch one experience with tags, serialized for the API. */
export async function findExperience(id: string) {
  const row = await useDb().query.experience.findFirst({
    where: (experience, { eq }) => eq(experience.id, id),
    with: { experienceTags: { with: { tag: { columns: { name: true } } } } },
  })
  return row ? serializeExperience(row) : null
}
