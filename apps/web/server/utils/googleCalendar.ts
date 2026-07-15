import { eq, googleConnections, type GoogleConnection } from '@larevo/db'

const SCOPE = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email'

function config() {
  const { googleClientId, googleClientSecret, googleRedirectUri } = useRuntimeConfig()
  return { clientId: googleClientId, clientSecret: googleClientSecret, redirectUri: googleRedirectUri }
}

export function isGoogleConfigured(): boolean {
  const { clientId, clientSecret } = config()
  return !!clientId && !!clientSecret
}

/** state is the admin's session id — the callback re-checks the admin session
 *  itself, so this is just a lightweight CSRF guard, not the auth boundary */
export function buildGoogleAuthUrl(state: string): string {
  const { clientId, redirectUri } = config()
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent', // forces a refresh_token on every connect, not just the first
    state,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
}

async function fetchGoogleEmail(accessToken: string): Promise<string> {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Failed to fetch Google userinfo: ${await res.text()}`)
  const data = (await res.json()) as { email: string }
  return data.email
}

/** exchanges an OAuth code for tokens and upserts the connection row.
 *  Throws if Google rejects the code or no refresh_token comes back (happens
 *  if the account was already connected without `prompt=consent`) */
export async function exchangeGoogleCode(code: string, label: string) {
  const { clientId, clientSecret, redirectUri } = config()
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  if (!res.ok) throw new Error(`Google token exchange failed: ${await res.text()}`)
  const tokens = (await res.json()) as TokenResponse
  if (!tokens.refresh_token) {
    throw new Error('Google did not return a refresh token — disconnect the app at myaccount.google.com/permissions and try again')
  }

  const email = await fetchGoogleEmail(tokens.access_token)
  const tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000)
  const db = useDb()

  const existing = await db.query.googleConnections.findFirst({
    where: eq(googleConnections.email, email),
  })
  if (existing) {
    const [updated] = await db
      .update(googleConnections)
      .set({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token, tokenExpiresAt })
      .where(eq(googleConnections.id, existing.id))
      .returning()
    return updated!
  }

  const isFirst = (await db.query.googleConnections.findMany()).length === 0
  const [created] = await db
    .insert(googleConnections)
    .values({
      label,
      email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiresAt,
      isPrimary: isFirst,
    })
    .returning()
  return created!
}

/** refreshes the access token if it's expired (or about to), persisting the
 *  new one — Google refresh tokens don't rotate, so we keep reusing it */
export async function getValidAccessToken(connection: GoogleConnection): Promise<string> {
  if (connection.tokenExpiresAt.getTime() > Date.now() + 60_000) return connection.accessToken

  const { clientId, clientSecret } = config()
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: connection.refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) throw new Error(`Google token refresh failed for ${connection.email}: ${await res.text()}`)
  const tokens = (await res.json()) as TokenResponse
  const tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000)

  await useDb()
    .update(googleConnections)
    .set({ accessToken: tokens.access_token, tokenExpiresAt })
    .where(eq(googleConnections.id, connection.id))

  return tokens.access_token
}

interface BusyInterval {
  start: string
  end: string
}

/** busy blocks on this connection's primary calendar, in [timeMin, timeMax) */
export async function queryFreeBusy(
  connection: GoogleConnection,
  timeMin: string,
  timeMax: string,
): Promise<BusyInterval[]> {
  const accessToken = await getValidAccessToken(connection)
  const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: 'primary' }] }),
  })
  if (!res.ok) {
    console.error(`[google] freebusy query failed for ${connection.email}:`, await res.text())
    return []
  }
  const data = (await res.json()) as { calendars: Record<string, { busy: BusyInterval[] }> }
  return data.calendars.primary?.busy ?? []
}

interface CreateEventOptions {
  summary: string
  description?: string
  startIso: string
  endIso: string
  timeZone: string
  attendeeEmail: string
}

/** creates the event with a Google Meet link and the visitor as an attendee;
 *  returns the event id (for later cancellation) and the Meet link */
export async function createCalendarEvent(
  connection: GoogleConnection,
  opts: CreateEventOptions,
): Promise<{ eventId: string; meetLink?: string }> {
  const accessToken = await getValidAccessToken(connection)
  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary: opts.summary,
        description: opts.description,
        start: { dateTime: opts.startIso, timeZone: opts.timeZone },
        end: { dateTime: opts.endIso, timeZone: opts.timeZone },
        attendees: [{ email: opts.attendeeEmail }],
        conferenceData: {
          createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } },
        },
      }),
    },
  )
  if (!res.ok) throw new Error(`Google event creation failed: ${await res.text()}`)
  const event = (await res.json()) as { id: string; hangoutLink?: string }
  return { eventId: event.id, meetLink: event.hangoutLink }
}

export async function deleteCalendarEvent(connection: GoogleConnection, eventId: string) {
  const accessToken = await getValidAccessToken(connection)
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?sendUpdates=all`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } },
  )
  // 410 Gone means it's already deleted — treat as success
  if (!res.ok && res.status !== 410 && res.status !== 404) {
    console.error(`[google] failed to delete event ${eventId}:`, await res.text())
  }
}

/** UTC offset (minutes) of `timeZone` at the instant `date` represents */
function tzOffsetMinutes(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  return (asUtc - date.getTime()) / 60_000
}

/** converts a 'YYYY-MM-DD' + 'HH:mm' wall-clock time in `timeZone` to a UTC ISO string */
export function zonedTimeToUtcIso(date: string, time: string, timeZone: string): string {
  const [year, month, day] = date.split('-').map(Number) as [number, number, number]
  const [hour, minute] = time.split(':').map(Number) as [number, number]
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute)
  const offsetMinutes = tzOffsetMinutes(new Date(utcGuess), timeZone)
  return new Date(utcGuess - offsetMinutes * 60_000).toISOString()
}
