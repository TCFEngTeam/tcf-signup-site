import { getProgramContent, type ProgramContentId } from '@/lib/content'
import type { ProgramContent } from '@/lib/content/types'

export type TrainingProgramId = ProgramContentId

export type TrainingProgram = ProgramContent & {
  slug: TrainingProgramId
}

export type ProgramPipelineConfig = {
  pipelineStage?: string
  pipelineType?: string
  /** HubSpot `hs_pipeline_stage` for trainings that stay listed but do not accept signups */
  closedPipelineStage?: string
}

function toTrainingProgram(content: ProgramContent): TrainingProgram {
  return {
    ...content,
    slug: content.id,
  }
}

export const TRAINING_PROGRAMS: Record<TrainingProgramId, TrainingProgram> = {
  mhfa: toTrainingProgram(getProgramContent('mhfa')),
  qpr: toTrainingProgram(getProgramContent('qpr')),
}

export const TRAINING_PROGRAM_LIST = Object.values(TRAINING_PROGRAMS)

export function isTrainingProgramId(value: string): value is TrainingProgramId {
  return value === 'mhfa' || value === 'qpr'
}

export function getTrainingProgram(programId: string): TrainingProgram | null {
  if (!isTrainingProgramId(programId)) return null
  return TRAINING_PROGRAMS[programId]
}

export function getProgramPipelineConfig(programId: TrainingProgramId): ProgramPipelineConfig {
  if (programId === 'mhfa') {
    return {
      pipelineStage:
        process.env.HUBSPOT_MHFA_PIPELINE_STAGE ??
        process.env.HUBSPOT_TRAINING_PIPELINE_STAGE,
      pipelineType:
        process.env.HUBSPOT_MHFA_PIPELINE_TYPE ??
        process.env.HUBSPOT_TRAINING_PIPELINE_TYPE,
      closedPipelineStage: process.env.HUBSPOT_MHFA_CLOSED_PIPELINE_STAGE,
    }
  }

  return {
    pipelineStage: process.env.HUBSPOT_QPR_PIPELINE_STAGE,
    pipelineType: process.env.HUBSPOT_QPR_PIPELINE_TYPE,
    closedPipelineStage: process.env.HUBSPOT_QPR_CLOSED_PIPELINE_STAGE,
  }
}
