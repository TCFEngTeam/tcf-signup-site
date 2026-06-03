import { getTrainingObjects, mapTrainingToEvent } from '@/lib/hubspot/api'
import { parseScheduleDateTime, type TrainingSchedule } from '@/lib/dates/format-schedule'
import { sortEventsForListing } from '@/lib/programs/sort'
import {
  getProgramPipelineConfig,
  getTrainingProgram,
  type TrainingProgramId,
} from '@/lib/programs/config'

export type ProgramEvent = {
  id: string
  title: string
  schedule: TrainingSchedule
  sortDate?: string
  location: string
  capacity: number
  registered: number
  availableCapacity: number
  active: boolean
  isFull: boolean
  /** Pipeline closed stage and/or within 48h of first session start — listed, no signups */
  registrationClosed: boolean
  description?: string
}

export const REGISTRATION_CLOSE_HOURS_BEFORE_START = 48

const REGISTRATION_CLOSE_MS = REGISTRATION_CLOSE_HOURS_BEFORE_START * 60 * 60 * 1000

/** Registration closes when current time is within 48 hours of the first session start. */
export function isRegistrationClosedByTime(
  schedule: TrainingSchedule,
  now: Date = new Date()
): boolean {
  const sessionStart = parseScheduleDateTime(schedule.session1Start)
  if (!sessionStart) return false

  const registrationClosesAt = sessionStart.getTime() - REGISTRATION_CLOSE_MS
  return now.getTime() >= registrationClosesAt
}

export function canAcceptRegistration(event: ProgramEvent): boolean {
  return event.active && !event.isFull && !event.registrationClosed
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
  event: ReturnType<typeof mapTrainingToEvent>,
  closedPipelineStage?: string,
  options?: { now?: Date }
): ProgramEvent {
  const now = options?.now ?? new Date()
  const pipelineClosed = Boolean(
    closedPipelineStage &&
      event.hubspotPipelineStage?.trim() === closedPipelineStage.trim()
  )
  const registrationClosed =
    pipelineClosed || isRegistrationClosedByTime(event.schedule, now)

  return {
    id: event.id,
    title: event.title,
    schedule: event.schedule,
    sortDate: event.sortDate,
    location: event.location,
    capacity: event.capacity,
    registered: event.registered,
    availableCapacity: event.availableCapacity,
    active: event.active,
    isFull: event.availableCapacity <= 0,
    registrationClosed,
    description: event.description,
  }
}

export async function loadProgramEvents(
  programId: TrainingProgramId
): Promise<ProgramEventsResult> {
  if (!getTrainingProgram(programId)) {
    return { events: [], error: new Error('Unknown program') }
  }

  const { pipelineStage, pipelineType, closedPipelineStage } = getProgramPipelineConfig(programId)

  try {
    const trainings = await getTrainingObjects(pipelineStage, pipelineType, closedPipelineStage)
    const events = sortEventsForListing(
      trainings
        .map(mapTrainingToEvent)
        .map((event) => toProgramEvent(event, closedPipelineStage))
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
