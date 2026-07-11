import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

export interface ElementSize {
    w: number
    h: number
}

/**
 * Tracks an element's BORDER-box size (padding included) reactively.
 *
 * Why border box: decorative layers (like a sketch SVG with inset-0)
 * cover the full padded area — measuring contentRect was the source
 * of our "tiny sketch in the corner" bug.
 */
export function useElementSize(target: Ref<HTMLElement | null>) {
    const size = ref<ElementSize>({ w: 0, h: 0 })
    let observer: ResizeObserver | null = null
    let frame = 0

    onMounted(() => {
        observer = new ResizeObserver(([entry]) => {
            if (!entry) return
            // defer the update one frame: writing the ref synchronously makes Vue
            // mutate the SVG inside this callback, which re-triggers observation in
            // the same layout pass and fires the "ResizeObserver loop completed with
            // undelivered notifications" error (surfaced as an overlay by Vite dev)
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                const box = entry.borderBoxSize?.[0]
                if (box) {
                    size.value = { w: Math.round(box.inlineSize), h: Math.round(box.blockSize) }
                } else {
                    // fallback for older browsers
                    const r = (entry.target as HTMLElement).getBoundingClientRect()
                    size.value = { w: Math.round(r.width), h: Math.round(r.height) }
                }
            })
        })
        if (target.value) observer.observe(target.value)
    })

    onBeforeUnmount(() => {
        cancelAnimationFrame(frame)
        observer?.disconnect()
    })

    return { size }
}