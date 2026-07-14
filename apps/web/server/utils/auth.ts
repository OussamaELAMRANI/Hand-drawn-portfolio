import type { H3Event } from 'h3'
import { eq, sessions, type User } from '@larevo/db'

const SESSION_COOKIE = 'larevo_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 days

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type PublicUser = Pick<User, 'id' | 'email' | 'name' | 'role'>

export function toPublicUser(user: User): PublicUser {
  return { id: user.id, email: user.email, name: user.name, role: user.role }
}

export async function createSession(event: H3Event, userId: string) {
  const [session] = await useDb()
    .insert(sessions)
    .values({ userId, expiresAt: new Date(Date.now() + SESSION_TTL_MS) })
    .returning()
  setCookie(event, SESSION_COOKIE, session!.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  })
}

export async function clearSession(event: H3Event) {
  const token = getCookie(event, SESSION_COOKIE)
  if (token && UUID_RE.test(token)) {
    await useDb().delete(sessions).where(eq(sessions.id, token))
  }
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

/** Resolve the session cookie to its user (cached per request). Null when logged out. */
export async function getSessionUser(event: H3Event): Promise<User | null> {
  if (event.context.sessionUser !== undefined) return event.context.sessionUser

  let user: User | null = null
  const token = getCookie(event, SESSION_COOKIE)
  if (token && UUID_RE.test(token)) {
    const session = await useDb().query.sessions.findFirst({
      where: eq(sessions.id, token),
      with: { user: true },
    })
    if (session && session.expiresAt > new Date()) user = session.user
    else if (session) await useDb().delete(sessions).where(eq(sessions.id, session.id))
  }

  event.context.sessionUser = user
  return user
}

export async function requireAuth(event: H3Event): Promise<User> {
  const user = await getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  return user
}

export async function requireRole(event: H3Event, ...roles: User['role'][]): Promise<User> {
  const user = await requireAuth(event)
  if (!roles.includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }
  return user
}

export function requireAdmin(event: H3Event): Promise<User> {
  return requireRole(event, 'admin')
}

declare module 'h3' {
  interface H3EventContext {
    sessionUser?: User | null
  }
}
