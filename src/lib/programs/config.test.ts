import { describe, expect, it } from 'vitest'
import { hubspotConfig } from '@/lib/hubspot/config'
import {
  getProgramPipelineConfig,
  getProgramRegistrationCloseHours,
  getTrainingProgram,
  isTrainingProgramId,
} from '@/lib/programs/config'

describe('trainingPrograms', () => {
  it('recognizes program ids', () => {
    expect(isTrainingProgramId('mhfa')).toBe(true)
    expect(isTrainingProgramId('qpr')).toBe(true)
    expect(isTrainingProgramId('qpa')).toBe(false)
  })

  it('returns program copy for QPR', () => {
    const qpr = getTrainingProgram('qpr')
    expect(qpr?.shortLabel).toBe('QPR')
    expect(qpr?.listingIntro.length).toBeGreaterThan(0)
    expect(qpr?.successNextSteps.some((step) => step.includes('1-hour'))).toBe(true)
  })

  it('reads pipeline settings from config/hubspot.json', () => {
    expect(getProgramPipelineConfig('mhfa')).toEqual(hubspotConfig.programs.mhfa)
    expect(getProgramPipelineConfig('qpr')).toEqual(hubspotConfig.programs.qpr)
  })

  it('reads registration close hours per program', () => {
    expect(getProgramRegistrationCloseHours('mhfa')).toBe(48)
    expect(getProgramRegistrationCloseHours('qpr')).toBe(24)
  })
})
