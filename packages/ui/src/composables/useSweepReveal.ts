import { computed, toValue, useId, type MaybeRefOrGetter } from 'vue'
import type { ElementSize } from './useElementSize'

/**
 * Geometry for the angled "sweep" reveal:
 * a clip window rotated parallel to the hachure lines,
 * sliding perpendicular to them when `active` flips.
 *
 * Pure derived state — the template binds the results,
 * CSS transitions animate between the two positions.
 */
export function useSweepReveal(
    size: MaybeRefOrGetter<ElementSize>,
    angleDeg: MaybeRefOrGetter<number>,
    active: MaybeRefOrGetter<boolean>,
) {
    const clipId = useId() // unique per instance, SSR-safe

    const cx = computed(() => toValue(size).w / 2)
    const cy = computed(() => toValue(size).h / 2)

    // diagonal covers the box at any rotation
    const D = computed(() => {
        const { w, h } = toValue(size)
        return Math.ceil(Math.hypot(w, h))
    })

    // window edge parallel to hachure lines
    const windowAngle = computed(() => toValue(angleDeg) - 90)

    const clipWindow = computed(() =>
        toValue(active)
            ? { y: cy.value - D.value / 2, height: D.value } // open
            : { y: cy.value + D.value / 2, height: 0 },      // closed
    )

    return { clipId, cx, cy, D, windowAngle, clipWindow }
}