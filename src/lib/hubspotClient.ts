// Placeholder HubSpot client service.
// Replace with real HubSpot API integration when ready.

export async function listEvents() {
  // Should call HubSpot API to retrieve events.
  return []
}

export async function getEvent(id: string) {
  return null
}

export async function submitSignup(eventId: string, data: any) {
  // Validate capacity server-side before forwarding to HubSpot.
  throw new Error('Not implemented')
}
