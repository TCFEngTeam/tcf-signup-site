import { NextResponse } from 'next/server'
import { isDevMockEnabled } from '@/lib/devOnly'
import { findMockEvent, registerMockEvent } from '../../api/_mockData'

export async function POST(req: Request) {
  if (!isDevMockEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const body = await req.json()
    const { eventId, data } = body || {}

    if (!eventId) {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })
    }

    // Basic validation — check required fields
    if (
      !data ||
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.phone
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Ensure the event exists
    const ev = findMockEvent(eventId)
    if (!ev) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    // Check capacity
    if (ev.registered >= ev.capacity) {
      return NextResponse.json({ error: 'Event is full' }, { status: 409 })
    }

    // Register (mutates in-memory mock data)
    const updated = registerMockEvent(eventId)

    return NextResponse.json({ success: true, event: { id: updated.id, registered: updated.registered } })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
