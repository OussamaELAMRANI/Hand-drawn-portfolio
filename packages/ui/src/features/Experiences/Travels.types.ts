export interface Trip {
    place: string
    note?: string
    /** image URL; omit for the sketchy photo placeholder */
    image?: string
    alt?: string
}

export interface TravelsProps {
    trips?: Trip[]
    title?: string
    subtitle?: string
    /** "full travel log" link; empty string hides it */
    moreHref?: string
    moreLabel?: string
    /** world-map placeholder banner above the polaroids */
    showMap?: boolean
}
