import { NextResponse } from 'next/server'
import { findMockEvent, registerMockEvent } from '../_mockData'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventId, data } = body || {}

    if (!eventId) {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })
    }

    // Basic validation — in production validate more thoroughly
    if (!data || !data.name || !data.email) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 })
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

    // In production: forward `data` to HubSpot server-side here

    return NextResponse.json({ success: true, event: { id: updated.id, registered: updated.registered } })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
