export interface SwipeCardItem {
    /** image URL; omit for the sketchy photo placeholder */
    image?: string
    alt?: string
    caption?: string
    note?: string
}

export interface SwipeDeckProps {
    cards: SwipeCardItem[]
    /** send swiped cards to the back of the deck (default) instead of discarding them */
    loop?: boolean
    /** how many cards peek out behind the top one */
    depth?: number
    /** show the prev/next buttons (they only render on md+ screens) */
    controls?: boolean
    /** top decoration on each card */
    accent?: 'tape' | 'pin' | 'none'
    /** which pointers may drag-swipe: touch only (default — desktop uses the buttons) or all */
    dragOn?: 'touch' | 'all'
}
