// resolves the session once per request on the server; the result hydrates
// to the client through useState's payload, so no client re-fetch happens
export default defineNuxtPlugin(async () => {
  const { user, fetched, refresh } = useAuth()
  if (fetched.value) return

  // no session cookie → logged out, skip the API round-trip
  const session = useCookie('larevo_session')
  if (!session.value) {
    user.value = null
    fetched.value = true
    return
  }

  await refresh().catch(() => {})
})
