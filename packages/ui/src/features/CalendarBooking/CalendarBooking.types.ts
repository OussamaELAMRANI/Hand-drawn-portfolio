export interface BookingSelection {
    /** the picked date (local time, at midnight) */
    date: Date
    /** slot label, e.g. '11:00' */
    slot: string
}

export interface CalendarBookingProps {
    title?: string
    subtitle?: string
    /** meta line next to the month, e.g. timezone + duration */
    meta?: string
    /** offered time-of-day slots */
    slots?: string[]
    /** hand-written annotation next to the slots column */
    annotation?: string
}
