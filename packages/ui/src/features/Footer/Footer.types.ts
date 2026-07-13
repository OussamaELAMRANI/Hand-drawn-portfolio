export interface FooterSocial {
    label: string
    href: string
    /** custom outline hex; defaults to the built-in social → brand-color map */
    color?: string
}

export interface FooterProps {
    socials?: FooterSocial[]
    copyright?: string
}
