export type CardVariant = 'index' | 'polaroid' | 'callout'

export interface UiCardProps {
    variant?: CardVariant
    /** overrides the variant's default sketch stroke color, e.g. to flag a card as current */
    strokeColor?: string
}
