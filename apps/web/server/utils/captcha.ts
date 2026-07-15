interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
}

/** verifies a Cloudflare Turnstile token server-side; no-ops (passes) when
 *  turnstileSecretKey isn't configured, matching this app's dev-convenience
 *  pattern for other optional integrations (Google Calendar, Resend) */
export async function verifyCaptcha(token: string, remoteIp?: string): Promise<boolean> {
  const { turnstileSecretKey } = useRuntimeConfig()
  if (!turnstileSecretKey) return true
  if (!token) return false

  const body = new URLSearchParams({ secret: turnstileSecretKey, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })
  const data = (await res.json()) as TurnstileVerifyResponse
  return data.success
}
