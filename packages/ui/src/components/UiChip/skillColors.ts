// Brand stroke colors for stack chips (outline only — UiChip keeps the text
// neutral ink/chalk). Bright brand hexes are darkened so a 1.4px stroke stays
// visible on paper, per the design-system page (JS #F7DF1E → #D4B106).
export const SKILL_COLORS: Record<string, string> = {
    typescript: '#3178C6',
    javascript: '#D4B106',
    'node.js': '#5FA04E',
    react: '#149ECA',
    'vue.js': '#42B883',
    'next.js': '#2A2A2A',
    'nuxt.js': '#00A063',
    php: '#777BB4',
    symfony: '#2A2A2A',
    laravel: '#FF2D20',
    postgresql: '#336791',
    mysql: '#00758F',
    redis: '#DC382D',
    ddd: '#8A6BCF',
    vitest: '#6E9F18',
    vite: '#646CFF',
    aws: '#FF9900',
    vercel: '#2A2A2A',
    // Node.js certifications
    jsnad: '#5FA04E',
    jsnsd: '#5FA04E',
}

const ALIASES: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    node: 'node.js',
    nodejs: 'node.js',
    vue: 'vue.js',
    next: 'next.js',
    nuxt: 'nuxt.js',
    postgres: 'postgresql',
}

/** resolve a skill label to its brand stroke hex; undefined → neutral gray stroke */
export function skillColor(skill: string): string | undefined {
    const key = skill.trim().toLowerCase()
    return SKILL_COLORS[ALIASES[key] ?? key]
}
