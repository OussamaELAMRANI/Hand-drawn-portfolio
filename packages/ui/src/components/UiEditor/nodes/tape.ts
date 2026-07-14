import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TapeNodeView from './TapeNodeView.vue'

export const TapeNode = Node.create({
  name: 'tape',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      width: { default: 76 },
      height: { default: 22 },
      angle: { default: -5 },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-tape]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-tape': '' })]
  },

  addNodeView() {
    return VueNodeViewRenderer(TapeNodeView)
  },
})
