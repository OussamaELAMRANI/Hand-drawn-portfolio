import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface UseDarkModeOptions {
    /** follow live OS scheme changes while the user has no explicit choice
     *  (no `localStorage.theme`); writes the `dark` class, which stays the
     *  single source of truth. Enable on ONE global instance (DarkModeToggle),
     *  not in every component. */
    syncSystem?: boolean
}

/**
 * Reactive night-mode flag driven by the `dark` class on <html>
 * (Tailwind `darkMode: 'class'`). SSR-safe: observation starts on mount,
 * so the server render always uses the light palette.
 */
export function useDarkMode(options: UseDarkModeOptions = {}) {
    const isDark = ref(false)
    let observer: MutationObserver | null = null
    let mq: MediaQueryList | null = null
    let onSystemChange: ((e: MediaQueryListEvent) => void) | null = null

    onMounted(() => {
        const root = document.documentElement
        const update = () => (isDark.value = root.classList.contains('dark'))
        update()
        observer = new MutationObserver(update)
        observer.observe(root, { attributes: true, attributeFilter: ['class'] })

        if (options.syncSystem) {
            mq = window.matchMedia('(prefers-color-scheme: dark)')
            onSystemChange = (e) => {
                let stored: string | null = null
                try {
                    stored = localStorage.getItem('theme')
                } catch {
                    // storage unavailable — treat as "no explicit choice"
                }
                if (stored === 'dark' || stored === 'light') return
                root.classList.toggle('dark', e.matches)
            }
            mq.addEventListener('change', onSystemChange)
        }
    })

    onBeforeUnmount(() => {
        observer?.disconnect()
        if (mq && onSystemChange) mq.removeEventListener('change', onSystemChange)
    })

    return { isDark }
}
