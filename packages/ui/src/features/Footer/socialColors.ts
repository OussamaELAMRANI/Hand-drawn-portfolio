// Brand stroke colors for the footer's social buttons (outline only — text
// stays neutral ink/chalk, same rule as the skill chips). Ink-colored brands
// (GitHub, Twitter/X) remap to chalk in night mode via SketchBox.
export const SOCIAL_COLORS: Record<string, string> = {
    github: '#2A2A2A',
    linkedin: '#0A66C2',
    twitterx: '#2A2A2A',
    twitter: '#2A2A2A',
    x: '#2A2A2A',
    instagram: '#C13584',
    youtube: '#FF0000',
    dribbble: '#EA4C89',
    email: '#C0577F',
    mail: '#C0577F',
}

/** resolve a social label to its brand stroke hex; unknown labels → ink */
export function socialColor(label: string): string {
    const key = label.toLowerCase().replace(/[^a-z]/g, '')
    return SOCIAL_COLORS[key] ?? '#2A2A2A'
}
