export type ChipVariant = 'subtle' | 'sketch'
export type ChipStroke = 'gray' | 'ink' | 'cyan' | 'magenta' | 'violet' | 'amber'

export interface UiChipProps {
    variant?: ChipVariant
    /** sketch variant only: outline + text color */
    stroke?: ChipStroke
    /** sketch variant only: custom outline hex (e.g. a brand color);
     *  overrides `stroke` and colors the outline only — text stays ink */
    color?: string
}
