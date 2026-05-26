// HubSpot client shim.
// Currently this calls a local mocked API route (`/api/events`).
// When ready to switch to real HubSpot integration:
// 1. Implement a server-side call that uses your HubSpot API key (DO NOT call HubSpot from the browser).
// 2. Store the API key in an environment variable (e.g. `HUBSPOT_API_KEY`).
// 3. Replace the `/api/events` implementation with a server-side fetch to HubSpot and map the
//    response fields to the event shape used by the frontend.

export async function listEvents() {
  try {
    const res = await fetch('/api/events')
    if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`)
    const data = await res.json()
    return data
  } catch (err) {
    console.error('listEvents error', err)
    return []
  }
}

export async function getEvent(id: string) {
  // For now, frontend can fetch all events and find by id. If you implement server-side HubSpot
  // calls later, add a `/api/events/[id]` route and use that here.
  const events = await listEvents()
  return events.find((e: any) => e.id === id) ?? null
}

export async function submitSignup(eventId: string, data: any) {
  // In production this should call a server-side endpoint which:
  // 1) Validates capacity (to avoid race conditions),
  // 2) Forwards the data to HubSpot using a server-side API key,
  // 3) Returns success / error to the client.
  // For now this is intentionally unimplemented to avoid sending test data to HubSpot.
  throw new Error('submitSignup not implemented - implement server-side forwarding to HubSpot')
}
