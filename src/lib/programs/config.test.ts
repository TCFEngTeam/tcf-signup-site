import { afterEach, describe, expect, it } from 'vitest'
import {
  getProgramPipelineConfig,
  getTrainingProgram,
  isTrainingProgramId,
} from '@/lib/programs/config'

describe('trainingPrograms', () => {
  afterEach(() => {
    delete process.env.HUBSPOT_MHFA_PIPELINE_STAGE
    delete process.env.HUBSPOT_MHFA_PIPELINE_TYPE
    delete process.env.HUBSPOT_QPR_PIPELINE_STAGE
    delete process.env.HUBSPOT_QPR_PIPELINE_TYPE
    delete process.env.HUBSPOT_TRAINING_PIPELINE_STAGE
    delete process.env.HUBSPOT_TRAINING_PIPELINE_TYPE
  })

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

  it('uses MHFA-specific pipeline env vars with legacy fallback', () => {
    process.env.HUBSPOT_MHFA_PIPELINE_STAGE = 'mhfa-stage'
    process.env.HUBSPOT_MHFA_PIPELINE_TYPE = 'mhfa-type'

    expect(getProgramPipelineConfig('mhfa')).toEqual({
      pipelineStage: 'mhfa-stage',
      pipelineType: 'mhfa-type',
    })
  })

  it('uses QPR pipeline env vars only', () => {
    process.env.HUBSPOT_QPR_PIPELINE_STAGE = 'qpr-stage'
    process.env.HUBSPOT_QPR_PIPELINE_TYPE = 'qpr-type'

    expect(getProgramPipelineConfig('qpr')).toEqual({
      pipelineStage: 'qpr-stage',
      pipelineType: 'qpr-type',
    })
  })
})
