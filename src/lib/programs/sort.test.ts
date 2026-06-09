import { describe, expect, it } from 'vitest'
import { sortEventsForListing, sortEventsSoonestFirst } from '@/lib/programs/sort'

const sampleEvents = [
  { id: 'a', sortDate: '2026-01-01T00:00:00.000Z' },
  { id: 'b', sortDate: '2026-06-01T00:00:00.000Z' },
  { id: 'c', sortDate: '2026-03-01T00:00:00.000Z' },
  { id: 'd', sortDate: undefined },
]

describe('sortEventsForListing', () => {
  it('sorts soonest first and puts missing dates last', () => {
    const sorted = sortEventsForListing(sampleEvents)
    expect(sorted.map((event) => event.id)).toEqual(['a', 'c', 'b', 'd'])
  })
})

describe('sortEventsSoonestFirst', () => {
  it('sorts soonest first and puts missing dates last', () => {
    const sorted = sortEventsSoonestFirst(sampleEvents)
    expect(sorted.map((event) => event.id)).toEqual(['a', 'c', 'b', 'd'])
  })
})
