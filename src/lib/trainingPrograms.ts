export type TrainingProgramId = 'mhfa' | 'qpr'

export type TrainingProgram = {
  id: TrainingProgramId
  slug: TrainingProgramId
  name: string
  shortLabel: string
  listingTitle: string
  listingIntro: string[]
  signupNotice: string[]
}

export type ProgramPipelineConfig = {
  pipelineStage?: string
  pipelineType?: string
}

const MHFA_INTRO = [
  'This FREE 8-hour course teaches individuals how to recognize signs of mental health or substance use challenges, how to offer and provide initial help, and how to guide a person toward appropriate care. Please complete this form if you are interested in the mental health first-aid training session.',
  'Be mindful that this training will require 2 hours of pre-work and 6 hours of a virtual instructor-led training.',
  'Attendance of the full session is mandatory for certification. Certification lasts for 3 years.',
  'Complete the training and receive a $100 gift card (as funding allows)!',
]

export const TRAINING_PROGRAMS: Record<TrainingProgramId, TrainingProgram> = {
  mhfa: {
    id: 'mhfa',
    slug: 'mhfa',
    name: 'Mental Health First Aid',
    shortLabel: 'MHFA',
    listingTitle: 'Mental Health First Aid Training',
    listingIntro: MHFA_INTRO,
    signupNotice: MHFA_INTRO,
  },
  qpr: {
    id: 'qpr',
    slug: 'qpr',
    name: 'Question, Persuade, Refer',
    shortLabel: 'QPR',
    listingTitle: 'QPR Training Sign Up',
    listingIntro: [
      'Sign up for an upcoming Question, Persuade, Refer (QPR) training session.',
      'Session details, format, and requirements will be confirmed after registration.',
    ],
    signupNotice: [
      'Sign up for an upcoming Question, Persuade, Refer (QPR) training session.',
      'Session details, format, and requirements will be confirmed after registration.',
    ],
  },
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
    }
  }

  return {
    pipelineStage: process.env.HUBSPOT_QPR_PIPELINE_STAGE,
    pipelineType: process.env.HUBSPOT_QPR_PIPELINE_TYPE,
  }
}
