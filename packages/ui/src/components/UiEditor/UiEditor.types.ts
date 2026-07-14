import type { JSONContent } from '@tiptap/vue-3'

export type { JSONContent }

export interface UiEditorProps {
    /** TipTap JSON document */
    modelValue?: JSONContent | null
    placeholder?: string
    /** false renders the document read-only with no chrome (preview / blog view) */
    editable?: boolean
}
