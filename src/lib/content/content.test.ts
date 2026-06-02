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

  it('loads program copy', () => {
    expect(getProgramContent('mhfa').shortLabel).toBe('MHFA')
    expect(getProgramContent('qpr').listingIntro.length).toBeGreaterThan(0)
  })

  it('loads page UI strings', () => {
    expect(pagesContent.eventCard.signUp).toBe('Sign up')
    expect(pagesContent.success.heading).toBeTruthy()
  })

  it('formatContent replaces placeholders', () => {
    expect(formatContent('Back to {program} events', { program: 'MHFA' })).toBe(
      'Back to MHFA events'
    )
  })
})
