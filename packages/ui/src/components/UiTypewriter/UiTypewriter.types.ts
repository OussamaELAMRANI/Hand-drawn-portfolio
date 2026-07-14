export interface TypewriterParagraph {
    /** plain text, or an HTML string when `html` is true */
    content: string
    /** render `content` with v-html — only pass trusted markup */
    html?: boolean
    /** wrapper tag (default 'p') — ignored when `html` is true, always renders as <p> */
    tag?: string
    /** classes for the wrapper */
    class?: string
}

export interface UiTypewriterProps {
    /** paragraphs to type; ignored when the default slot is used instead */
    paragraphs?: (string | TypewriterParagraph)[]
    /** ms per character */
    speed?: number
    /** extra pause between paragraphs, ms */
    paragraphPause?: number
    /** wait until scrolled into view before typing */
    startOnVisible?: boolean
    /** show the blinking caret while typing */
    cursor?: boolean
}
