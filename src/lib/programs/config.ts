export type TrainingProgramId = 'mhfa' | 'qpr'

export type TrainingProgram = {
  id: TrainingProgramId
  slug: TrainingProgramId
  name: string
  shortLabel: string
  listingTitle: string
  listingIntro: string[]
  signupNotice: string[]
  successNextSteps: string[]
}

export type ProgramPipelineConfig = {
  pipelineStage?: string
  pipelineType?: string
}

const MHFA_SUCCESS_STEPS = [
  'Check your email for confirmation and session details.',
  'Complete the required 2 hours of pre-work before the training date.',
  'Attend the full 6-hour virtual instructor-led session for certification.',
]

const QPR_INTRO = [
  'Question, Persuade, and Refer (QPR) Training is a suicide prevention program that teaches individuals how to recognize the warning signs of a suicide crisis and how to respond effectively. The training focuses on three key steps: Question the person about suicidal thoughts, Persuade them to seek help, and Refer them to appropriate resources.',
  'Designed for anyone, regardless of background, QPR equips participants with practical tools to intervene early, offer hope, and potentially save lives. It is often compared to CPR, emphasizing the importance of early action in a mental health emergency.',
  'This session includes 1 hour of virtual training with instructors. Certification is received at course completion.',
]

const QPR_SUCCESS_STEPS = [
  'Check your email for confirmation and session details.',
  'Attend the 1-hour virtual instructor-led training session.',
  'Receive your QPR certification upon course completion.',
]

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
    successNextSteps: MHFA_SUCCESS_STEPS,
  },
  qpr: {
    id: 'qpr',
    slug: 'qpr',
    name: 'Question, Persuade, and Refer Suicide Prevention Training',
    shortLabel: 'QPR',
    listingTitle: 'Question, Persuade, and Refer Suicide Prevention Training',
    listingIntro: QPR_INTRO,
    signupNotice: QPR_INTRO,
    successNextSteps: QPR_SUCCESS_STEPS,
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
