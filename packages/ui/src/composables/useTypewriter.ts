import { onBeforeUnmount, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

export interface UseTypewriterOptions {
    /** ms per character */
    speed?: MaybeRefOrGetter<number>
    /** extra pause between text blocks, ms */
    paragraphPause?: MaybeRefOrGetter<number>
    /** toggle the `data-typing` attribute on the element being typed
     *  (consumers style the caret via `[data-typing]::after`) */
    cursor?: MaybeRefOrGetter<boolean>
    /** wait until the root scrolls into view before typing */
    startOnVisible?: MaybeRefOrGetter<boolean>
    onDone?: () => void
}

interface Entry {
    node: Text
    full: string
}

/**
 * The typing engine behind UiTypewriter: walks the text nodes under `root`,
 * empties them, and refills character by character — markup and components
 * keep their structure while only the visible characters accumulate.
 *
 * Call `arm()` once the content is present in the DOM (mount, or after an
 * async render like Shiki). Honors `prefers-reduced-motion` by skipping
 * straight to done.
 */
export function useTypewriter(
    root: Ref<HTMLElement | null>,
    options: UseTypewriterOptions = {},
) {
    const done = ref(false)
    const typing = ref(false)
    let entries: Entry[] = []
    let started = false
    let stopped = false
    let io: IntersectionObserver | undefined

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

    function collect(el: HTMLElement): Entry[] {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
        const out: Entry[] = []
        let n: Node | null
        while ((n = walker.nextNode())) {
            const t = n as Text
            if (t.data.trim()) out.push({ node: t, full: t.data })
        }
        return out
    }

    async function type() {
        if (typing.value || done.value || stopped) return
        typing.value = true
        const speed = () => toValue(options.speed) ?? 24
        for (const e of entries) {
            const holder = e.node.parentElement
            if (toValue(options.cursor) ?? true) holder?.setAttribute('data-typing', '')
            for (let i = 1; i <= e.full.length; i++) {
                if (stopped) return
                e.node.data = e.full.slice(0, i)
                const ch = e.full[i - 1]
                await sleep(ch === '.' || ch === '!' || ch === '?' ? speed() * 6 : speed())
            }
            holder?.removeAttribute('data-typing')
            if (stopped) return
            await sleep(toValue(options.paragraphPause) ?? 260)
        }
        typing.value = false
        done.value = true
        options.onDone?.()
    }

    /** clear the text under `root` and start typing — the "observed" moment */
    function begin() {
        const el = root.value
        if (!el || stopped) return
        entries = collect(el)
        entries.forEach((e) => (e.node.data = ''))
        void type()
    }

    /** schedule the effect; returns false when there was nothing to arm.
     *  Content is only touched once the client observes it: in-view elements
     *  clear pre-paint and type right away, below-fold content stays fully
     *  readable until it first scrolls into view. */
    function arm(): boolean {
        const el = root.value
        if (!el || started) return false
        started = true
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            done.value = true
            options.onDone?.()
            return true
        }
        if (!(toValue(options.startOnVisible) ?? true)) {
            begin()
            return true
        }
        const r = el.getBoundingClientRect()
        const inView =
            r.top < window.innerHeight && r.bottom > 0 && (r.width > 0 || r.height > 0)
        if (inView) {
            begin()
            return true
        }
        io = new IntersectionObserver(
            (ents) => {
                if (ents.some((e) => e.isIntersecting)) {
                    io?.disconnect()
                    begin()
                }
            },
            { threshold: 0.2 },
        )
        io.observe(el)
        return true
    }

    onBeforeUnmount(() => {
        stopped = true
        io?.disconnect()
    })

    return { arm, typing, done }
}
