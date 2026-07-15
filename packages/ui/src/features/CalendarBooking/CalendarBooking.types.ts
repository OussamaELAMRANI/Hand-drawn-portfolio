export interface BookingSlot {
  /** 'YYYY-MM-DD' */
  date: string
  slot: string
}

export interface BookingFormPayload {
  /** 'YYYY-MM-DD' */
  date: string
  slot: string
  name: string
  email: string
  message?: string
  /** Cloudflare Turnstile token — empty when the widget isn't configured */
  captchaToken: string
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
  /** already-booked date+slot pairs for the currently displayed month */
  takenSlots?: BookingSlot[]
  /** true while a booking submission is in flight */
  submitting?: boolean
  /** error from the last submission attempt (e.g. a slot taken meanwhile) */
  error?: string | null
  /** true once the current booking has been confirmed */
  confirmed?: boolean
  /** Cloudflare Turnstile site key; the CAPTCHA widget doesn't render without it */
  captchaSiteKey?: string
}
