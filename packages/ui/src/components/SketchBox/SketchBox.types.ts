import type { SketchShape } from '#composables/useRoughShape'

export interface SketchBoxProps {
    tag?: string
    shape?: SketchShape
    /** stroke color in light mode */
    color?: string
    /** stroke color in night mode; defaults to the design system's neutral remap */
    darkColor?: string
    strokeWidth?: number
    roughness?: number
}
