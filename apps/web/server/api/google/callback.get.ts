// admin only: Google redirects here after consent
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)
  const code = query.code as string | undefined
  const returnedState = query.state as string | undefined
  const raw = getCookie(event, 'google_oauth_state')
  deleteCookie(event, 'google_oauth_state')

  if (query.error) {
    return sendRedirect(event, `/admin/bookings?google_error=${encodeURIComponent(String(query.error))}`)
  }
  if (!code || !raw) {
    throw createError({ statusCode: 400, statusMessage: 'Missing OAuth code or state' })
  }

  const { state, label } = JSON.parse(raw) as { state: string; label: string }
  if (state !== returnedState) {
    throw createError({ statusCode: 400, statusMessage: 'OAuth state mismatch' })
  }

  try {
    await exchangeGoogleCode(code, label)
  } catch (e) {
    console.error('[google] OAuth callback failed:', e)
    return sendRedirect(event, '/admin/bookings?google_error=connect_failed')
  }

  return sendRedirect(event, '/admin/bookings?connected=1')
})
