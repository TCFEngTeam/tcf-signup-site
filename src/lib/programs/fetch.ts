import { loadProgramEvents, type ProgramEvent } from '@/lib/programs/events'
import {
  getTrainingProgram,
  isTrainingProgramId,
  type TrainingProgramId,
} from '@/lib/programs/config'

export type ListedEvent = ProgramEvent

export async function fetchEventsForProgram(programId: TrainingProgramId) {
  if (!getTrainingProgram(programId)) {
    return { events: [] as ListedEvent[], error: new Error('Unknown program') }
  }

  return loadProgramEvents(programId)
}

export function parseProgramParam(value: string) {
  return isTrainingProgramId(value) ? value : null
}

export { loadProgramEventById, loadProgramEvents } from '@/lib/programs/events'
