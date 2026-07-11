import { ref, computed, toValue, type MaybeRefOrGetter } from 'vue'

/**
 * The interaction state machine: two booleans (hovered, pressed)
 * plus a sketch seed that re-randomizes on each press ("twitch").
 *
 * Returns handlers ready to spread onto any element:
 *   <button v-on="handlers">
 */
export function usePressable(disabled: MaybeRefOrGetter<boolean> = false) {
    const hovered = ref(false)
    const pressed = ref(false)
    const seed = ref(12)

    const isDisabled = computed(() => toValue(disabled))

    function press() {
        if (isDisabled.value) return
        pressed.value = true
        seed.value = Math.floor(Math.random() * 2 ** 31)
    }

    function release() {
        pressed.value = false
    }

    const handlers = {
        mouseenter: () => (hovered.value = true),
        mouseleave: () => {
            hovered.value = false
            release() // press → drag out → release outside must un-press
        },
        pointerdown: press,
        pointerup: release,
        pointercancel: release, // OS steals touch (scroll/notification)
        keydown: (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') press()
        },
        keyup: (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') release()
        },
    }

    return { hovered, pressed, seed, handlers }
}