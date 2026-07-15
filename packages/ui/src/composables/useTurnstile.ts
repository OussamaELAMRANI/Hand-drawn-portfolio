import { onMounted, onUnmounted, ref } from 'vue'

interface TurnstileApi {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string
      callback: (token: string) => void
      'error-callback'?: () => void
      'expired-callback'?: () => void
    },
  ) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`)
  if (existing) return new Promise((resolve) => existing.addEventListener('load', () => resolve(), { once: true }))
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = TURNSTILE_SRC
    script.async = true
    script.defer = true
    script.addEventListener('load', () => resolve(), { once: true })
    document.head.appendChild(script)
  })
}

/** Cloudflare Turnstile widget lifecycle: loads the script, renders into the
 *  returned `captchaEl` ref, and exposes the current `token`. No-ops (widget
 *  never renders, token stays empty) when `siteKey` isn't configured,
 *  matching this app's dev-convenience pattern for other optional
 *  integrations. Call `reset()` after a failed submit — tokens are
 *  single-use, so the widget needs a fresh challenge to retry. */
export function useTurnstile(siteKey: string | undefined) {
  const captchaEl = ref<HTMLElement | null>(null)
  const token = ref('')
  const widgetId = ref<string | undefined>()

  function render() {
    if (!captchaEl.value || !window.turnstile || !siteKey) return
    widgetId.value = window.turnstile.render(captchaEl.value, {
      sitekey: siteKey,
      callback: (t) => (token.value = t),
      'error-callback': () => (token.value = ''),
      'expired-callback': () => (token.value = ''),
    })
  }

  function reset() {
    token.value = ''
    if (window.turnstile && widgetId.value) window.turnstile.reset(widgetId.value)
  }

  onMounted(async () => {
    if (!siteKey) return
    await loadTurnstileScript()
    render()
  })
  onUnmounted(() => {
    if (window.turnstile && widgetId.value) window.turnstile.remove(widgetId.value)
  })

  return { captchaEl, token, reset }
}
