export type CardVariant = 'index' | 'polaroid' | 'callout'
export type CardAccent = 'pin' | 'tape' | 'none'

export interface UiCardProps {
    variant?: CardVariant
    /** overrides the variant's default top decoration (index: pin, polaroid: tape, callout: none) */
    accent?: CardAccent
    /** overrides the variant's default sketch stroke color, e.g. to flag a card as current */
    strokeColor?: string
}
