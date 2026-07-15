import type { JSONContent } from '@tiptap/vue-3'

export type { JSONContent }

/** TipTap-backed rich text editor with a toolbar for marks (bold/italic/highlight)
 *  and custom nodes (chip/badge/pill/tape/pin/sketchBox); reads/writes TipTap JSON. */
export interface UiEditorProps {
    /** TipTap JSON document */
    modelValue?: JSONContent | null
    placeholder?: string
    /** false renders the document read-only with no chrome (preview / blog view) */
    editable?: boolean
}
