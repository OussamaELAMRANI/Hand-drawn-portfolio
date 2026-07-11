import type { RoughFillStyle, SketchShape } from '#composables/useRoughShape'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'sketch'
export type ButtonReveal = 'fade' | 'sweep'

export interface UiButtonProps {
    href?: string
    variant?: ButtonVariant
    shape?: SketchShape
    reveal?: ButtonReveal
    fillStyle?: RoughFillStyle
    hachureAngle?: number
    roughness?: number
    animate?: boolean
    disabled?: boolean
}
