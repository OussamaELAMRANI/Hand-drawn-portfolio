// guards every /admin route in one place (no per-page definePageMeta needed)
// and bounces already-authenticated admins from /login straight to the studio
export default defineNuxtRouteMiddleware(async (to) => {
  const needsAdmin = to.path === '/admin' || to.path.startsWith('/admin/')
  const isLoginPage = to.path === '/login'
  if (!needsAdmin && !isLoginPage) return

  const { user, fetched, refresh } = useAuth()
  if (!fetched.value) await refresh().catch(() => {})
  const isAdmin = user.value?.role === 'admin'

  if (needsAdmin && !isAdmin) return navigateTo('/login')
  if (isLoginPage && isAdmin) return navigateTo('/admin')
})
