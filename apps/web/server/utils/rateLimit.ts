interface RateLimitEntry {
  count: number
  resetAt: number
}

const WINDOW_MS = 24 * 60 * 60 * 1000

// in-memory, per-server-instance — same caveat as smtpTransport/useDb: on
// serverless this resets on cold start and isn't shared across instances, so
// it's a first line of defense against casual spam rather than a hard cap.
// Swap for a shared store (Upstash/Redis) if that stops being good enough.
const hits = new Map<string, RateLimitEntry>()

/** true if `ip` is still under the configured max for the rolling 24h
 *  window (NUXT_BOOKING_RATE_LIMIT_MAX, default 5), and records this call as
 *  a hit. Unknown IPs (no proxy header in dev) are always allowed — there's
 *  nothing to key a bucket on. */
export function checkRateLimit(ip: string | undefined): boolean {
  if (!ip) return true

  const { bookingRateLimitMax } = useRuntimeConfig()
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= bookingRateLimitMax) return false

  entry.count += 1
  return true
}
