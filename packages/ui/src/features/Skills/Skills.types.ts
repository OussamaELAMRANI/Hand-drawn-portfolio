export interface SkillsProps {
    skills?: string[]
    /** leading label; empty string hides it */
    label?: string
    /** paint each chip's outline with its brand color (see skillColors.ts) */
    colored?: boolean
}
