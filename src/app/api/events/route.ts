import { NextResponse } from 'next/server'

// Mock events dataset. Replace this with a server-side HubSpot fetch when ready.
const MOCK_EVENTS = [
  {
    id: 'evt-001',
    title: 'Introduction to TCF',
    date: '2026-06-01T18:00:00.000Z',
    location: 'Online',
    capacity: 50,
    registered: 12,
    // `active` simulates the HubSpot flag/pipeline stage that marks visibility
    active: true,
    description: 'An introductory session about TCF and our community.',
  },
  {
    id: 'evt-002',
    title: 'Past Event (should be hidden)',
    date: '2024-01-10T18:00:00.000Z',
    location: 'Office',
    capacity: 30,
    registered: 30,
    active: true,
    description: 'This event is in the past and will be filtered out by default.',
  },
  {
    id: 'evt-003',
    title: 'Hidden Event (inactive flag)',
    date: '2026-07-15T18:00:00.000Z',
    location: 'New York',
    capacity: 40,
    registered: 5,
    active: false,
    description: 'This event has an inactive flag and should be hidden.',
  },
]

export async function GET() {
  // Default behavior: return only events that are active and not in the past.
  // This mirrors the intended production rules:
  //  - Event date must not have passed
  //  - A HubSpot flag/property must mark the event as visible

  const now = Date.now()

  const filtered = MOCK_EVENTS.filter((ev) => {
    const evDate = new Date(ev.date).getTime()
    return ev.active && evDate > now
  }).map((ev) => ({
    ...ev,
    // convenience helper for the UI
    isFull: ev.registered >= ev.capacity,
  }))

  return NextResponse.json(filtered)
}

/*
  How to replace with a real HubSpot integration:

  1) Create a server-side implementation here that calls the HubSpot API.
     Use a server-only environment variable for the API key (e.g. `HUBSPOT_API_KEY`).

     Example (psuedocode):
       const res = await fetch('https://api.hubapi.com/...', {
         headers: { Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}` }
       })
       const hubspotData = await res.json()

  2) Map HubSpot event properties to the shape used by the frontend:
       { id, title, date, location, capacity, registered, active, description }

  3) Apply the same filtering rules server-side (date not passed, active flag true)

  4) Return the mapped list via `NextResponse.json()`.

  Note: Keep the API key and any secrets out of client code. All HubSpot calls that require
  secrets must be performed server-side (like in this route) rather than in the browser.
*/
