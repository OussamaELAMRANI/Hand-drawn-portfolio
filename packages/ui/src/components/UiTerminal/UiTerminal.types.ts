export interface UiTerminalProps {
    title?: string
    /** code to syntax-highlight; when set it replaces the plain slot */
    code?: string
    /** any Shiki language id (ts, vue, bash, py, rust, …) */
    lang?: string
}
