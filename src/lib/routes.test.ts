import { describe, expect, it } from 'vitest'
import {
  EMBED_TRAININGS_PATH,
  OPPORTUNITIES_PATH,
  embedTrainingsProgramPath,
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
})
