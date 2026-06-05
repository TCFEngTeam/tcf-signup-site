import { getTrainingObjects, mapTrainingToEvent } from '@/lib/hubspot/api'
import { sortEventsForListing } from '@/lib/programs/sort'
import {
  getProgramPipelineConfig,
  getTrainingProgram,
  type TrainingProgramId,
} from '@/lib/programs/config'

export type ProgramEvent = {
  id: string
  title: string
  startDate: string
  endDate: string
  location: string
  capacity: number
  registered: number
  availableCapacity: number
  active: boolean
  isFull: boolean
  description?: string
}

export function canAcceptWaitlist(event: ProgramEvent): boolean {
  return event.active && event.isFull
}

export function canAcceptRegistration(event: ProgramEvent): boolean {
  return event.active && !event.isFull
}

export type ProgramEventsResult = {
  events: ProgramEvent[]
  error: Error | null
}

export type ProgramEventResult = {
  event: ProgramEvent | null
  error: Error | null
}

export function toProgramEvent(
  event: ReturnType<typeof mapTrainingToEvent>
): ProgramEvent {
  return {
    id: event.id,
    title: event.title,
    startDate: event.startDate ?? '',
    endDate: event.endDate ?? '',
    location: event.location,
    capacity: event.capacity,
    registered: event.registered,
    availableCapacity: event.availableCapacity,
    active: event.active,
    isFull: event.availableCapacity <= 0,
    description: event.description,
  }
}

export async function loadProgramEvents(
  programId: TrainingProgramId
): Promise<ProgramEventsResult> {
  if (!getTrainingProgram(programId)) {
    return { events: [], error: new Error('Unknown program') }
  }

  const { pipelineStage, pipelineType } = getProgramPipelineConfig(programId)

  try {
    const trainings = await getTrainingObjects(pipelineStage, pipelineType)
    const events = sortEventsForListing(
      trainings.map(mapTrainingToEvent).map(toProgramEvent)
    )
    return { events, error: null }
  } catch (hsErr) {
    console.error('[programEvents] HubSpot fetch failed:', hsErr)
    return {
      events: [],
      error: hsErr instanceof Error ? hsErr : new Error('Failed to fetch events'),
    }
  }
}

export async function loadProgramEventById(
  programId: TrainingProgramId,
  eventId: string
): Promise<ProgramEventResult> {
  const { events, error } = await loadProgramEvents(programId)
  if (error) {
    return { event: null, error }
  }
  return { event: events.find((entry) => entry.id === eventId) ?? null, error: null }
}
