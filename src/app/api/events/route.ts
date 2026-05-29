import { NextResponse } from 'next/server'
import { getTrainingObjects, mapTrainingToEvent } from '@/lib/hubspotApi'
import {
  getProgramPipelineConfig,
  isTrainingProgramId,
  type TrainingProgramId,
} from '@/lib/trainingPrograms'
import { listMockEvents } from '../_mockData'
import { sortEventsForListing } from '@/lib/sortEvents'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const programParam = searchParams.get('program')

    if (!programParam || !isTrainingProgramId(programParam)) {
      return NextResponse.json(
        { error: 'Missing or invalid program query param (mhfa or qpa)' },
        { status: 400 }
      )
    }

    const programId = programParam as TrainingProgramId
    const { pipelineStage, pipelineType } = getProgramPipelineConfig(programId)

    let trainings = []
    try {
      trainings = await getTrainingObjects(pipelineStage, pipelineType)
      console.debug('[api/events] HubSpot trainings fetched', {
        programId,
        pipelineStage,
        pipelineType,
        count: trainings.length,
      })
    } catch (hsErr) {
      console.error('HubSpot fetch failed, falling back to mock events:', hsErr)
      const mock = listMockEvents()
      const filteredMock = mock
        .filter((ev) => ev.active)
        .map((ev) => ({ ...ev, isFull: ev.registered >= ev.capacity }))
      console.debug('[api/events] Falling back to mock events', {
        programId,
        mockCount: mock.length,
        returnedCount: filteredMock.length,
      })
      return NextResponse.json(sortEventsForListing(filteredMock))
    }

    const mappedEvents = trainings.map(mapTrainingToEvent)
    const events = sortEventsForListing(
      mappedEvents.map((ev) => ({
        ...ev,
        isFull: ev.availableCapacity <= 0,
      }))
    )

    console.debug('[api/events] Post-filter counts', {
      programId,
      hubspotCount: trainings.length,
      mappedCount: mappedEvents.length,
      returnedCount: events.length,
    })

    return NextResponse.json(events)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch events'
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
