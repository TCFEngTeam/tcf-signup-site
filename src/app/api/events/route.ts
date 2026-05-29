import { NextResponse } from 'next/server'
import { loadProgramEvents } from '@/lib/programEvents'
import { isTrainingProgramId, type TrainingProgramId } from '@/lib/trainingPrograms'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const programParam = searchParams.get('program')

    if (!programParam || !isTrainingProgramId(programParam)) {
      return NextResponse.json(
        { error: 'Missing or invalid program query param (mhfa or qpr)' },
        { status: 400 }
      )
    }

    const programId = programParam as TrainingProgramId
    const { events, error } = await loadProgramEvents(programId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.debug('[api/events] returned events', {
      programId,
      count: events.length,
    })

    return NextResponse.json(events)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch events'
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
