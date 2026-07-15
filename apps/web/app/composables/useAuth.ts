export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: 'admin' | 'editor' | 'user'
}

export function useAuth() {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const fetched = useState<boolean>('auth-fetched', () => false)

  async function refresh() {
    // useRequestFetch forwards the session cookie during SSR
    const { user: current } = await useRequestFetch()<{ user: AuthUser | null }>('/api/auth/me')
    user.value = current
    fetched.value = true
  }

  async function login(email: string, password: string, captchaToken: string) {
    user.value = await $fetch<AuthUser>('/api/auth/login', {
      method: 'POST',
      body: { email, password, captchaToken },
    })
    fetched.value = true
  }

  async function logout(to = '/') {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo(to)
  }

  const isAdmin = computed(() => user.value?.role === 'admin')

  return { user, isAdmin, fetched, refresh, login, logout }
}
