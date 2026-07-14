import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import PinNodeView from './PinNodeView.vue'

export const PinNode = Node.create({
  name: 'pin',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      color: { default: '#C0577F' },
      size: { default: 16 },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-pin]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-pin': '' })]
  },

  addNodeView() {
    return VueNodeViewRenderer(PinNodeView)
  },
})
