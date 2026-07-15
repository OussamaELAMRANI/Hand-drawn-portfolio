import type { JSONContent } from '../../components/UiEditor/UiEditor.types'

export interface NotebookRole {
    id?: string
    period: string
    title: string
    company: string
    blurb: string
    tags: string[]
    /** full write-up (TipTap JSON) shown in the expanded note; falls back to blurb */
    description?: JSONContent
    /** "what I learned" callout shown in the expanded note, when present */
    learned?: string
    startDate?: string | null
    endDate?: string | null
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
