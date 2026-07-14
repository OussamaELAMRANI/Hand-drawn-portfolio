import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import SketchBoxNodeView from './SketchBoxNodeView.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    sketchBox: {
      toggleSketchBox: (attrs?: { shape?: string; color?: string }) => ReturnType
    }
  }
}

export const SketchBoxNode = Node.create({
  name: 'sketchBox',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      color: { default: '#2A2A2A' },
      shape: { default: 'rect' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-sketch-box]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-sketch-box': '' }), 0]
  },

  addCommands() {
    return {
      toggleSketchBox:
        (attrs) =>
        ({ commands }) =>
          commands.toggleWrap(this.name, attrs),
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(SketchBoxNodeView)
  },
})
