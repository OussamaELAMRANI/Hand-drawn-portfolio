import type { SwipeCardItem } from '../SwipeDeck/SwipeDeck.types'
import type { JSONContent } from '@tiptap/core'

export interface HeroMeProps {
  name?: string
  /** TipTap JSON doc — the headline sentence under the name */
  tagline?: JSONContent
  /** TipTap JSON doc — the paragraph below the tagline */
  bio?: JSONContent
  /** polaroid deck cards */
  cards?: SwipeCardItem[]
}
