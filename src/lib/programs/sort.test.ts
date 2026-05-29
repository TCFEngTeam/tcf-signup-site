import { describe, expect, it } from 'vitest'
import { sortEventsForListing, sortEventsSoonestFirst } from '@/lib/programs/sort'

const sampleEvents = [
  { id: 'a', startDate: '2026-01-01T00:00:00.000Z' },
  { id: 'b', startDate: '2026-06-01T00:00:00.000Z' },
  { id: 'c', startDate: '2026-03-01T00:00:00.000Z' },
  { id: 'd', startDate: undefined },
]

describe('sortEventsForListing', () => {
  it('sorts furthest future first and puts missing dates last', () => {
    const sorted = sortEventsForListing(sampleEvents)
    expect(sorted.map((event) => event.id)).toEqual(['b', 'c', 'a', 'd'])
  })
})

describe('sortEventsSoonestFirst', () => {
  it('sorts soonest first and puts missing dates last', () => {
    const sorted = sortEventsSoonestFirst(sampleEvents)
    expect(sorted.map((event) => event.id)).toEqual(['a', 'c', 'b', 'd'])
  })
})
