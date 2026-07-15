import type { JSONContent } from '@larevo/ui'

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatMonth(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// flattens a TipTap JSON doc down to its bare text, e.g. for card blurbs and
// blank-doc checks — no marks/formatting, just the words in document order
export function richTextToPlain(doc: JSONContent | null | undefined): string {
  if (!doc) return ''
  const walk = (node: JSONContent): string =>
    (node.text ?? '') + (node.content ?? []).map(walk).join(' ')
  return walk(doc).replace(/\s+/g, ' ').trim()
}
