import { describe, expect, it } from 'vitest'
import {
  trainingsEventPath,
  trainingsEventSuccessPath,
  trainingsProgramPath,
  trainingsUnregisterConfirmPath,
  trainingsUnregisterPath,
} from '@/lib/routes'

describe('trainings routes', () => {
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
