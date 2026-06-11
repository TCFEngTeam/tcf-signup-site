import { getProgramContent, type ProgramContentId } from '@/lib/content'
import type { ProgramContent } from '@/lib/content/types'
import { getProgramPipelineConfigFromHubSpot } from '@/lib/hubspot/config'

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
  return getProgramPipelineConfigFromHubSpot(programId)
}
