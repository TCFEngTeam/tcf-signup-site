import { NextResponse } from 'next/server'
import { getTrainingObjects, mapTrainingToEvent } from '@/lib/hubspotApi'

export async function GET(req: Request) {
  try {
    const now = Date.now()
    const pipelineStage = process.env.HUBSPOT_TRAINING_PIPELINE_STAGE

    // Fetch training objects from HubSpot
    const trainings = await getTrainingObjects(pipelineStage)

    // Map to app format and filter by future date and active status
    const events = trainings
      .map(mapTrainingToEvent)
      .filter((ev) => new Date(ev.date).getTime() > now && ev.active)
      .map((ev) => ({
        ...ev,
        isFull: ev.availableCapacity <= 0,
      }))

    return NextResponse.json(events)
  } catch (error: any) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: error?.message ?? 'Failed to fetch events' }, { status: 500 })
  }
}
