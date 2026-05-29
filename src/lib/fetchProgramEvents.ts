import { headers } from 'next/headers'
import { sortEventsForListing } from '@/lib/sortEvents'
import {
  getTrainingProgram,
  isTrainingProgramId,
  type TrainingProgramId,
} from '@/lib/trainingPrograms'

export type ListedEvent = {
  id: string
  title: string
  startDate: string
  endDate: string
  location: string
  capacity: number
  registered: number
  active: boolean
  isFull: boolean
}

export async function fetchEventsForProgram(programId: TrainingProgramId) {
  if (!getTrainingProgram(programId)) {
    return { events: [] as ListedEvent[], error: new Error('Unknown program') }
  }

  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const url = `${protocol}://${host}/api/events?program=${programId}`
    const res = await fetch(url, { next: { revalidate: 60 } })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      return {
        events: [] as ListedEvent[],
        error: new Error(`Events API returned ${res.status}: ${body}`),
      }
    }

    const events = sortEventsForListing((await res.json()) as ListedEvent[])
    return { events, error: null }
  } catch (err) {
    return {
      events: [] as ListedEvent[],
      error: err instanceof Error ? err : new Error('Failed to fetch events'),
    }
  }
}

export function parseProgramParam(value: string) {
  return isTrainingProgramId(value) ? value : null
}
