import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import rough from 'roughjs'
import type { ElementSize } from './useElementSize'

export type SketchShape = 'rect' | 'pill' | 'ellipse'

/** Every fill style rough.js supports (see the rough.js wiki). */
export type RoughFillStyle =
    | 'hachure'
    | 'solid'
    | 'zigzag'
    | 'cross-hatch'
    | 'dots'
    | 'dashed'
    | 'zigzag-line'

export interface RoughShapeOptions {
    size: MaybeRefOrGetter<ElementSize>
    shape: MaybeRefOrGetter<SketchShape>
    seed: MaybeRefOrGetter<number>
    roughness?: MaybeRefOrGetter<number>
    // outline
    stroke: MaybeRefOrGetter<string>
    strokeWidth: MaybeRefOrGetter<number>
    // fill ('none' disables the fill layer)
    fill: MaybeRefOrGetter<string>
    fillStyle?: MaybeRefOrGetter<RoughFillStyle>
    fillWeight?: MaybeRefOrGetter<number>
    hachureAngle?: MaybeRefOrGetter<number>
    padding?: number
}

/**
 * Rough.js as a pure calculator: turns reactive shape options into
 * reactive arrays of path data ({ d, stroke, strokeWidth }).
 * No DOM access → SSR-safe by construction, trivially unit-testable.
 */
export function useRoughShape(options: RoughShapeOptions) {
    const gen = rough.generator()
    const PAD = options.padding ?? 4

    function drawable(opts: object) {
        const { w, h } = toValue(options.size)
        const iw = w - PAD * 2
        const ih = h - PAD * 2

        switch (toValue(options.shape)) {
            case 'ellipse':
                return gen.ellipse(w / 2, h / 2, iw, ih, { bowing: 1.2, ...opts })
            case 'pill': {
                const r = Math.min(ih / 2, iw / 2)
                const d = [
                    `M ${PAD + r} ${PAD}`,
                    `L ${PAD + iw - r} ${PAD}`,
                    `A ${r} ${r} 0 0 1 ${PAD + iw - r} ${PAD + ih}`,
                    `L ${PAD + r} ${PAD + ih}`,
                    `A ${r} ${r} 0 0 1 ${PAD + r} ${PAD}`,
                    'Z',
                ].join(' ')
                return gen.path(d, { bowing: 1.4, ...opts })
            }
            default:
                return gen.rectangle(PAD, PAD, iw, ih, { bowing: 1.4, ...opts })
        }
    }

    const outlinePaths = computed(() => {
        if (!toValue(options.size).w) return []
        return gen.toPaths(
            drawable({
                seed: toValue(options.seed),
                stroke: toValue(options.stroke),
                strokeWidth: toValue(options.strokeWidth),
                roughness: toValue(options.roughness) ?? 1.8,
            }),
        )
    })

    const fillPaths = computed(() => {
        const fill = toValue(options.fill)
        if (!toValue(options.size).w || fill === 'none') return []
        const fillStyle = toValue(options.fillStyle) ?? 'zigzag'
        const roughness = toValue(options.roughness) ?? 1.8
        // each dot is a ~1.4px ellipse sketched with the fill roughness — anything
        // wild turns them into merged blobs, so dots get tight, single-pass circles
        const dots = fillStyle === 'dots'
        return gen.toPaths(
            drawable({
                seed: toValue(options.seed),
                fill,
                fillStyle,
                fillWeight: toValue(options.fillWeight) ?? 1.4,
                hachureGap: dots ? 7 : 5,
                hachureAngle: toValue(options.hachureAngle) ?? -41,
                stroke: 'none',
                disableMultiStroke: dots,
                // scribble slightly wilder than the border
                roughness: dots ? Math.min(roughness, 1) : roughness + 0.4,
            }),
        )
    })

    return { outlinePaths, fillPaths }
}