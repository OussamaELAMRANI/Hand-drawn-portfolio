// admin only: kicks off the OAuth flow to connect a Google account
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  if (!isGoogleConfigured()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Google OAuth is not configured (missing NUXT_GOOGLE_CLIENT_ID/SECRET)',
    })
  }

  const label = String(getQuery(event).label ?? 'Google Calendar').trim().slice(0, 50) || 'Google Calendar'
  const state = crypto.randomUUID()
  setCookie(event, 'google_oauth_state', JSON.stringify({ state, label }), {
    httpOnly: true,
    maxAge: 600,
    sameSite: 'lax',
    path: '/',
  })

  return sendRedirect(event, buildGoogleAuthUrl(state))
})
