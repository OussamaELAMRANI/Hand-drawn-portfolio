export type TypographyVariant = 'h1' | 'h2' | 'lead' | 'label' | 'body' | 'mono'

export interface TypographyProps {
    variant?: TypographyVariant
    /** override the variant's semantic tag (e.g. render a lead as a div) */
    as?: string
}
