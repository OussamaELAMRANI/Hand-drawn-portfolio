import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Reactive night-mode flag driven by the `dark` class on <html>
 * (Tailwind `darkMode: 'class'`). SSR-safe: observation starts on mount,
 * so the server render always uses the light palette.
 */
export function useDarkMode() {
    const isDark = ref(false)
    let observer: MutationObserver | null = null

    onMounted(() => {
        const root = document.documentElement
        const update = () => (isDark.value = root.classList.contains('dark'))
        update()
        observer = new MutationObserver(update)
        observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    })

    onBeforeUnmount(() => observer?.disconnect())

    return { isDark }
}
