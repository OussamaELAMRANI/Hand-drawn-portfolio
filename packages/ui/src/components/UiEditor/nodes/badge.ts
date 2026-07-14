import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import BadgeNodeView from './BadgeNodeView.vue'

export const BadgeNode = Node.create({
  name: 'badge',
  group: 'inline',
  inline: true,
  content: 'text*',
  marks: '',
  atom: false,

  addAttributes() {
    return {
      variant: { default: 'code' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-badge]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-badge': '' }), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(BadgeNodeView)
  },
})
