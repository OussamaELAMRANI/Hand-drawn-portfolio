import type { Component } from 'vue'

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
    /** element/component used for links — pass 'NuxtLink' for client-side
     *  routing (it accepts `href` as an alias of `to`); defaults to 'a' */
    linkComponent?: string | Component
}