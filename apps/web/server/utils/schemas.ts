import { z } from 'zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD')

// TipTap document — structure is editor-owned, we only pin the root node type
export const richDoc = z.looseObject({ type: z.literal('doc') })

// patch schemas derive from the default-free bases: `.partial()` keeps
// `.default()`s, which would silently reset omitted fields on PATCH
const postBase = z.object({
  title: z.string().trim().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase words separated by dashes')
    .optional(),
  excerpt: z.string().trim().max(500).nullish(),
  body: richDoc,
  status: z.enum(['draft', 'published']),
  tags: z.array(z.string().trim().min(1)).max(20),
})
export const postInput = postBase.extend({
  status: postBase.shape.status.default('draft'),
  tags: postBase.shape.tags.default([]),
})
export const postPatch = postBase.partial()

const experienceBase = z.object({
  title: z.string().trim().min(1),
  roles: z.array(z.string().trim().min(1)).max(10),
  description: z.string().trim().nullish(),
  tags: z.array(z.string().trim().min(1)).max(20),
  learned: z.string().trim().nullish(),
  startDate: isoDate.nullish(),
  endDate: isoDate.nullish(),
})
export const experienceInput = experienceBase.extend({
  roles: experienceBase.shape.roles.default([]),
  tags: experienceBase.shape.tags.default([]),
})
export const experiencePatch = experienceBase.partial()

export const tagInput = z.object({
  name: z.string().trim().min(1).max(50),
})

const overviewCard = z.object({
  image: z.string().trim().optional(),
  alt: z.string().trim().optional(),
  caption: z.string().trim().optional(),
  note: z.string().trim().optional(),
})

// PUT-only resource — always replaced in full, so no separate patch schema
export const overviewInput = z.object({
  name: z.string().trim().min(1),
  tagline: richDoc,
  bio: richDoc,
  cards: z.array(overviewCard).max(12).default([]),
})

export const loginInput = z.object({
  email: z.email().transform((v) => v.toLowerCase()),
  password: z.string().min(1),
})

export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
