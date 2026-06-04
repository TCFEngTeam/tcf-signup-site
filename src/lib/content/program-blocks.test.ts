import { describe, expect, it } from 'vitest'
import { getProgramIntroPreview } from '@/lib/content/program-blocks'

describe('getProgramIntroPreview', () => {
  it('returns paragraph text when the first block is a paragraph', () => {
    expect(
      getProgramIntroPreview([{ type: 'paragraph', text: 'Hello world' }])
    ).toBe('Hello world')
  })

  it('returns the first list item when the first block is a list', () => {
    expect(
      getProgramIntroPreview([{ type: 'list', items: ['First', 'Second'] }])
    ).toBe('First')
  })
})
