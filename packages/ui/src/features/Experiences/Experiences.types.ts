export interface NotebookRole {
    period: string
    title: string
    company: string
    blurb: string
    tags: string[]
}

export interface EngineeringNotebookProps {
    roles?: NotebookRole[]
    title?: string
    subtitle?: string
    /** "read more" link; empty string hides it */
    moreHref?: string
    moreLabel?: string
    /** render as a slider (3 per view, stepping by one) when there are more roles than this */
    maxGrid?: number
}
