export interface UiTagInputProps {
    /** selected tags */
    modelValue?: string[]
    /** autocomplete candidates for the current query (parent fetches on @query) */
    suggestions?: string[]
    placeholder?: string
    /** offer a "create" row when the typed text matches no suggestion */
    allowCreate?: boolean
    /** rendered before each tag/suggestion, e.g. '#' for hashtags */
    prefix?: string
}
