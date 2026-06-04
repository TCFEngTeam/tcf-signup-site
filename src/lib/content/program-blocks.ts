import type { ProgramContentBlock } from '@/lib/content/types'

/** Plain-text preview of the first block (e.g. program chooser cards). */
export function getProgramIntroPreview(blocks: ProgramContentBlock[]): string {
  const first = blocks[0]
  if (!first) return ''
  if (first.type === 'paragraph') return first.text
  return first.items[0] ?? ''
}
