import { NextResponse } from 'next/server'
import { getTrainingObjects, mapTrainingToEvent } from '@/lib/hubspotApi'
import { listMockEvents } from '../_mockData'

export async function GET(req: Request) {
  try {
    const now = Date.now()
    const pipelineStage = process.env.HUBSPOT_TRAINING_PIPELINE_STAGE

    // Fetch training objects from HubSpot, but fall back to mock events on error
    let trainings = []
    try {
      trainings = await getTrainingObjects(pipelineStage)
      console.debug('[api/events] HubSpot trainings fetched', {
        pipelineStage,
        count: trainings.length,
      })
    } catch (hsErr) {
      console.error('HubSpot fetch failed, falling back to mock events:', hsErr)
      // Fallback to mock events if HubSpot is unavailable
      const mock = listMockEvents()
      const filteredMock = mock
        .filter((ev) => new Date(ev.date).getTime() > now && ev.active)
        .map((ev) => ({ ...ev, isFull: ev.registered >= ev.capacity }))
      console.debug('[api/events] Falling back to mock events', {
        mockCount: mock.length,
        returnedCount: filteredMock.length,
      })
      return NextResponse.json(filteredMock)
    }

    // Map to app format and filter by future date and active status
    const mappedEvents = trainings.map(mapTrainingToEvent)
    const events = mappedEvents
      .filter((ev) => new Date(ev.date).getTime() > now && ev.active)
      .map((ev) => ({
        ...ev,
        isFull: ev.availableCapacity <= 0,
      }))

    console.debug('[api/events] Post-filter counts', {
      hubspotCount: trainings.length,
      mappedCount: mappedEvents.length,
      returnedCount: events.length,
    })

    return NextResponse.json(events)
  } catch (error: any) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: error?.message ?? 'Failed to fetch events' }, { status: 500 })
  }
}
