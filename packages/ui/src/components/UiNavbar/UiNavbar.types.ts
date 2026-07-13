export interface NavLink {
    label: string
    href: string
}

export interface UiNavbarProps {
    /** brand text before the accent (default slot `brand` overrides both) */
    brand?: string
    /** cyan-tinted suffix of the brand */
    brandAccent?: string
    brandHref?: string
    links?: NavLink[]
    /** magenta-circled call-to-action; omit to hide */
    cta?: NavLink
}