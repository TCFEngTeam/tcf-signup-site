import { describe, expect, it } from 'vitest'
import { formatContent } from './format'
import { getProgramContent, pagesContent, signupFormContent, siteContent } from './index'

describe('content', () => {
  it('loads site logo and form config', () => {
    expect(siteContent.logo.text).toBe('TCF')
    expect(siteContent.form.submitLabel).toBeTruthy()
  })

  it('loads signup form fields and states list', () => {
    expect(signupFormContent.fields.email).toBe('Email')
    expect(signupFormContent.usStates).toContain('Virginia')
    expect(signupFormContent.currentYearOptions.length).toBeGreaterThan(0)
  })

  it('loads program copy with mixed intro blocks', () => {
    const mhfa = getProgramContent('mhfa')
    expect(mhfa.shortLabel).toBe('MHFA')
    expect(mhfa.listingIntro[0]).toMatchObject({ type: 'paragraph' })
    expect(mhfa.listingIntro.some((block) => block.type === 'list')).toBe(true)
    expect(getProgramContent('qpr').signupNotice.length).toBeGreaterThan(0)
  })

  it('loads page UI strings', () => {
    expect(pagesContent.eventCard.signUp).toBe('Sign up')
    expect(pagesContent.listing.noSessions).toBeTruthy()
    expect(pagesContent.capacity.seatsRemaining).toContain('{count}')
    expect(pagesContent.schedule.dateToBeAnnounced).toBeTruthy()
    expect(pagesContent.success.heading).toBeTruthy()
  })

  it('loads signup API messages', () => {
    expect(signupFormContent.messages.invalidPhone).toBeTruthy()
    expect(signupFormContent.messages.alreadyRegistered).toContain('already registered')
  })

  it('formatContent replaces placeholders', () => {
    expect(formatContent('Back to {program} events', { program: 'MHFA' })).toBe(
      'Back to MHFA events'
    )
  })
})
