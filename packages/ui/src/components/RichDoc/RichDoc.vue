<script lang="ts">
import { defineComponent, h, type PropType, type VNode } from 'vue'
import type { JSONContent } from '@tiptap/core'
import UiChip from '../UiChip/UiChip.vue'
import UiBadge from '../UiBadge/UiBadge.vue'
import UiPill from '../UiPill/UiPill.vue'
import UiTape from '../UiTape/UiTape.vue'
import UiPin from '../UiPin/UiPin.vue'
import SketchBox from '../SketchBox/SketchBox.vue'

type Child = VNode | string
type Mark = NonNullable<JSONContent['marks']>[number]

const MARK_TAGS: Record<string, string> = {
  bold: 'strong',
  italic: 'em',
  strike: 's',
  code: 'code',
}

function wrapMark(mark: Mark, children: Child[]): Child[] {
  if (mark.type === 'link') {
    return [
      h(
        'a',
        {
          href: String(mark.attrs?.href ?? ''),
          target: mark.attrs?.target || undefined,
          rel: mark.attrs?.rel || undefined,
        },
        children,
      ),
    ]
  }
  if (mark.type === 'highlight') {
    return [
      h('mark', { class: 'inline-block -rotate-1 bg-marker px-2 py-px text-[#2A2A2A]' }, children),
    ]
  }
  const tag = MARK_TAGS[mark.type]
  return tag ? [h(tag, children)] : children
}

// inline content within a paragraph — text (with marks) and the small
// inline component nodes. Anything else (shouldn't appear here) is flattened.
function renderInline(node: JSONContent): Child[] {
  if (node.type === 'text') {
    return (node.marks ?? []).reduce<Child[]>((acc, mark) => wrapMark(mark, acc), [
      node.text ?? '',
    ])
  }

  const children = (node.content ?? []).flatMap(renderInline)

  switch (node.type) {
    case 'chip':
      return [
        h(
          UiChip,
          { variant: node.attrs?.variant, stroke: node.attrs?.stroke, color: node.attrs?.color },
          () => children,
        ),
      ]
    case 'badge':
      return [h(UiBadge, { variant: node.attrs?.variant }, () => children)]
    case 'pill':
      return [h(UiPill, { active: node.attrs?.active }, () => children)]
    case 'tape':
      return [
        h(UiTape, {
          width: node.attrs?.width,
          height: node.attrs?.height,
          angle: node.attrs?.angle,
        }),
      ]
    case 'pin':
      return [h(UiPin, { color: node.attrs?.color, size: node.attrs?.size })]
    default:
      return children
  }
}

// block-level content — everything StarterKit's toolbar in UiEditor can
// produce (paragraph, heading, bulletList/orderedList/listItem, blockquote,
// codeBlock, horizontalRule) plus the sketchBox container. `paragraph` takes
// an optional {tag, class} override so only the top-level call site can
// customize it; paragraphs nested inside a sketchBox/list/quote always
// render as plain <p>
function renderBlock(node: JSONContent, paragraphTag = 'p', paragraphClass?: string): VNode[] {
  if (node.type === 'sketchBox') {
    const inner = (node.content ?? []).flatMap((child) => renderBlock(child))
    return [h(SketchBox, { color: node.attrs?.color, shape: node.attrs?.shape, class: 'p-4' }, () => inner)]
  }
  if (node.type === 'paragraph') {
    const inline = (node.content ?? []).flatMap(renderInline)
    return inline.length ? [h(paragraphTag, { class: paragraphClass }, inline)] : []
  }
  if (node.type === 'heading') {
    const inline = (node.content ?? []).flatMap(renderInline)
    return inline.length ? [h(`h${node.attrs?.level ?? 2}`, inline)] : []
  }
  if (node.type === 'bulletList' || node.type === 'orderedList') {
    const isBullet = node.type === 'bulletList'
    const items = (node.content ?? []).flatMap((child) => renderBlock(child))
    const start = !isBullet ? node.attrs?.start : undefined
    // paragraphClass goes on the list itself (not the nested <li>/<p>) since
    // color/font-size are inherited CSS properties — this keeps list text
    // matching the surrounding prose at each call site without threading the
    // class through every nested render call
    const attrs = {
      class: [isBullet ? 'list-disc' : 'list-decimal', 'space-y-1.5 pl-5 marker:text-cyan', paragraphClass],
      ...(start && start !== 1 ? { start } : {}),
    }
    return items.length ? [h(isBullet ? 'ul' : 'ol', attrs, items)] : []
  }
  if (node.type === 'listItem') {
    return [h('li', { class: 'pl-1' }, (node.content ?? []).flatMap((child) => renderBlock(child)))]
  }
  if (node.type === 'blockquote') {
    const inner = (node.content ?? []).flatMap((child) => renderBlock(child))
    return inner.length ? [h('blockquote', inner)] : []
  }
  if (node.type === 'codeBlock') {
    const code = (node.content ?? []).flatMap(renderInline)
    return [h('pre', h('code', code))]
  }
  if (node.type === 'horizontalRule') return [h('hr')]
  return []
}

/**
 * Renders a TipTap JSON doc as real Vue content, not a serialized HTML string —
 * so custom component nodes (chip/badge/pill/tape/pin/sketchBox) render as the
 * actual live components rather than a hand-duplicated approximation (SketchBox
 * in particular draws its border with roughjs, which can't be reproduced as a
 * plain HTML string). Safe for SSR since it's just normal Vue rendering (unlike
 * TipTap's own `generateHTML`, which needs a browser `document`).
 *
 * Top-level paragraphs use `tag`/`paragraphClass`; blank ones (e.g. a trailing
 * empty paragraph from the editor) are dropped. Paragraphs nested inside a
 * sketchBox render as a plain paragraph tag.
 */
export default defineComponent({
  name: 'RichDoc',
  props: {
    doc: { type: Object as PropType<JSONContent | null | undefined>, default: null },
    tag: { type: String, default: 'p' },
    paragraphClass: { type: String, default: undefined },
  },
  setup(props) {
    return () =>
      (props.doc?.content ?? []).flatMap((node) => renderBlock(node, props.tag, props.paragraphClass))
  },
})
</script>
