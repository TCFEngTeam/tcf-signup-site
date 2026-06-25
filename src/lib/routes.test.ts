import { describe, expect, it } from 'vitest'
import {
  EMBED_TRAININGS_PATH,
  OPPORTUNITIES_PATH,
  embedTrainingsProgramPath,
  legacyTrainingRedirects,
  trainingsEventPath,
  trainingsEventSuccessPath,
  trainingsProgramPath,
  trainingsUnregisterConfirmPath,
  trainingsUnregisterPath,
} from '@/lib/routes'

describe('trainings routes', () => {
  it('exposes opportunities path', () => {
    expect(OPPORTUNITIES_PATH).toBe('/opportunities')
  })

  it('builds embed trainings paths', () => {
    expect(EMBED_TRAININGS_PATH).toBe('/embed/trainings')
    expect(embedTrainingsProgramPath('mhfa')).toBe('/embed/trainings/mhfa')
  })

  it('builds program and event paths', () => {
    expect(trainingsProgramPath('mhfa')).toBe('/trainings/mhfa')
    expect(trainingsEventPath('qpr', '123')).toBe('/trainings/qpr/events/123')
    expect(trainingsEventSuccessPath('mhfa', '123', '?waitlist=1')).toBe(
      '/trainings/mhfa/events/123/success?waitlist=1'
    )
  })

  it('builds unregister paths', () => {
    expect(trainingsUnregisterPath()).toBe('/trainings/unregister')
    expect(trainingsUnregisterConfirmPath('abc')).toBe(
      '/trainings/unregister/confirm?token=abc'
    )
  })

  it('maps legacy program URLs to trainings paths', () => {
    const redirects = legacyTrainingRedirects()

    expect(redirects.find((r) => r.source === '/mhfa')?.destination).toBe('/trainings/mhfa')
    expect(redirects.find((r) => r.source === '/qpr')?.destination).toBe('/trainings/qpr')
    expect(redirects.find((r) => r.source === '/mhfa/events/:id')?.destination).toBe(
      '/trainings/mhfa/events/:id'
    )
    expect(redirects.find((r) => r.source === '/unregister')?.destination).toBe(
      '/trainings/unregister'
    )
    expect(redirects.every((r) => r.permanent)).toBe(true)
  })
})
