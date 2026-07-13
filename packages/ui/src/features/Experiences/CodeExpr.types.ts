export interface CodeExprProps {
    /** hand-written eyebrow above the title (the leading `//` is added automatically) */
    eyebrow?: string
    title?: string
    /** "all projects" link; empty string hides it */
    moreHref?: string
    moreLabel?: string
    /** code rendered in the terminal (Shiki-highlighted) */
    code?: string
    codeTitle?: string
    lang?: string
    /** caption inside the wireframe sketch card */
    wireframeLabel?: string
}
