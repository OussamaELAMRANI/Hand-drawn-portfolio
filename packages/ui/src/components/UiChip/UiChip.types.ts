export type ChipVariant = 'subtle' | 'sketch'
export type ChipStroke = 'gray' | 'ink' | 'cyan' | 'magenta' | 'violet' | 'amber'

export interface UiChipProps {
    variant?: ChipVariant
    /** sketch variant only: outline + text color. Omit to auto-detect a brand
     *  color from the slot text (see skillColors.ts), falling back to gray */
    stroke?: ChipStroke
    /** sketch variant only: custom outline hex (e.g. a brand color);
     *  overrides `stroke` and auto-detection, coloring the outline only —
     *  text stays ink */
    color?: string
}
