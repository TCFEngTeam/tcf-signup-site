import { NextResponse } from 'next/server'
import { listMockEvents, type MockEvent } from '../_mockData'

export async function GET() {
  const now = Date.now()
  const events = listMockEvents()

  const filtered = events
    .filter((ev: MockEvent) => new Date(ev.date).getTime() > now && ev.active)
    .map((ev: MockEvent) => ({
      ...ev,
      isFull: ev.registered >= ev.capacity,
    }))

  return NextResponse.json(filtered)
}

/*
  Replace this mock route with a real HubSpot fetch later:
  - Keep the fetch server-side in this route.
  - Use a server env var for the HubSpot API key.
  - Map HubSpot event properties into the same shape used by the UI.
  - Keep the same filtering rules: active flag + future date.
*/
