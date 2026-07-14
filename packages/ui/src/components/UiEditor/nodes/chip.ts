import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ChipNodeView from './ChipNodeView.vue'

export const ChipNode = Node.create({
  name: 'chip',
  group: 'inline',
  inline: true,
  content: 'text*',
  marks: '',
  atom: false,

  addAttributes() {
    return {
      variant: { default: 'sketch' },
      // null, not 'gray' — lets UiChip auto-detect a brand color from the
      // chip's text (see UiChip/skillColors.ts) unless the caller overrides it
      stroke: { default: null },
      color: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-chip]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-chip': '' }), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(ChipNodeView)
  },
})
