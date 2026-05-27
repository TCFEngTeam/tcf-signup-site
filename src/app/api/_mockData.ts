// Shared in-memory mock data for development and previews.
// This lives only in the running server process and is suitable for local
// mocking but NOT for production use.

export type MockEvent = {
  id: string
  title: string
  startDate: string
  endDate: string
  location: string
  capacity: number
  registered: number
  active: boolean
  description?: string
}

export const MOCK_EVENTS: MockEvent[] = [
  {
    id: 'evt-001',
    title: 'Introduction to TCF',
    startDate: '2026-06-01T18:00:00.000Z',
    endDate: '2026-06-01T18:00:00.000Z',
    location: 'Online',
    capacity: 50,
    registered: 12,
    active: true,
    description: 'An introductory session about TCF and our community.',
  },
  {
    id: 'evt-002',
    title: 'Past Event (should be hidden)',
    startDate: '2024-01-10T18:00:00.000Z',
    endDate: '2024-01-10T18:00:00.000Z',
    location: 'Office',
    capacity: 30,
    registered: 30,
    active: true,
    description: 'This event is in the past and will be filtered out by default.',
  },
  {
    id: 'evt-003',
    title: 'Hidden Event (inactive flag)',
    startDate: '2026-07-15T18:00:00.000Z',
    endDate: '2026-07-15T18:00:00.000Z',
    location: 'New York',
    capacity: 40,
    registered: 5,
    active: false,
    description: 'This event has an inactive flag and should be hidden.',
  },
]

export function listMockEvents() {
  return MOCK_EVENTS
}

export function findMockEvent(id: string) {
  return MOCK_EVENTS.find((e) => e.id === id) ?? null
}

export function registerMockEvent(id: string) {
  const ev = findMockEvent(id)
  if (!ev) throw new Error('Event not found')
  if (ev.registered >= ev.capacity) throw new Error('Event is full')
  ev.registered += 1
  return ev
}
