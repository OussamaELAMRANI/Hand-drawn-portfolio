import type { JSONContent } from '@larevo/ui'
import type { SwipeCardItem } from '@larevo/ui/features/SwipeDeck'

export interface ApiPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: JSONContent
  status: 'draft' | 'published'
  publishedAt: string | null
  author: { id: string; name: string | null }
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ApiExperience {
  id: string
  title: string
  roles: string[]
  description: string | null
  tags: string[]
  learned: string | null
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiOverview {
  id: string
  name: string
  tagline: JSONContent
  bio: JSONContent
  cards: SwipeCardItem[]
  createdAt: string
  updatedAt: string
}
