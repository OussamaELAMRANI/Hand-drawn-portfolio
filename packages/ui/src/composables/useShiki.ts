import { ref, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

/**
 * 'dual'  — light + dark theme in one render; tokens carry `--shiki-dark`
 *           CSS vars flipped by a global `.dark .shiki …` rule.
 * 'dark'  — dark theme only, for surfaces that stay dark in both modes
 *           (UiTerminal's #22252B panel).
 */
export type ShikiMode = 'dual' | 'dark'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- typing the shape of a lazily-imported module
type ShikiWebBundle = typeof import('shiki/bundle/web')

// the web bundle is ~heavy, so it loads on first use and only once;
// shiki's shorthand caches its highlighter + loaded langs internally
let shikiModule: Promise<ShikiWebBundle> | null = null
const loadShiki = () => (shikiModule ??= import('shiki/bundle/web'))

function escapeHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Highlights `code` with Shiki (VS Code grammars — full language coverage).
 * `html` starts as an escaped plain <pre> so SSR and the pre-load frame render
 * readable code, then upgrades in place. Unknown languages fall back to plain.
 */
export function useShiki(
    code: MaybeRefOrGetter<string>,
    lang: MaybeRefOrGetter<string> = 'text',
    mode: MaybeRefOrGetter<ShikiMode> = 'dual',
) {
    const html = ref('')
    const ready = ref(false)
    let run = 0

    watchEffect(async () => {
        const source = toValue(code)
        const language = toValue(lang)
        const m = toValue(mode)
        const ticket = ++run

        html.value = `<pre class="shiki"><code>${escapeHtml(source)}</code></pre>`
        ready.value = false

        try {
            const { codeToHtml, bundledLanguages } = await loadShiki()
            const safeLang = language in bundledLanguages ? language : 'text'
            const highlighted = await codeToHtml(
                source,
                m === 'dark'
                    ? { lang: safeLang, theme: 'github-dark' }
                    : {
                        lang: safeLang,
                        themes: { light: 'github-light', dark: 'github-dark' },
                        defaultColor: 'light',
                    },
            )
            if (ticket !== run) return // superseded by a newer run
            html.value = highlighted
            ready.value = true
        } catch {
            // keep the escaped fallback
        }
    })

    return { html, ready }
}
