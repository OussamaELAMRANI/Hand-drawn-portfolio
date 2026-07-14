import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import PillNodeView from './PillNodeView.vue'

export const PillNode = Node.create({
  name: 'pill',
  group: 'inline',
  inline: true,
  content: 'text*',
  marks: '',
  atom: false,

  addAttributes() {
    return {
      active: { default: false },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-pill]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-pill': '' }), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(PillNodeView)
  },
})
