import { describe, expect, it } from 'vitest'
import { mapTrainingToEvent } from '@/lib/hubspot/api'
import { canAcceptRegistration, canAcceptWaitlist, toProgramEvent } from '@/lib/programs/events'

describe('toProgramEvent', () => {
  it('maps HubSpot training fields and full status', () => {
    const event = toProgramEvent(
      mapTrainingToEvent({
        id: '559388347197',
        properties: {
          hs_course_name: 'MHFA - June 3',
          training_start_date: '2026-06-03',
          training_end_date: '2026-06-04',
          hs_enrollment_capacity: '20',
          available_capacity: '0',
        },
      })
    )

    expect(event.title).toBe('MHFA - June 3')
    expect(event.isFull).toBe(true)
    expect(event.registered).toBe(20)
    expect(event.capacity).toBe(20)
  })

  it('falls back to alternate HubSpot property names', () => {
    const event = toProgramEvent(
      mapTrainingToEvent({
        id: '1',
        properties: {
          name: 'QPR Session',
          start_date: '2026-07-01',
          end_date: '2026-07-01',
          capacity: '10',
          available_capacity: '7',
        },
      })
    )

    expect(event.title).toBe('QPR Session')
    expect(event.isFull).toBe(false)
    expect(event.availableCapacity).toBe(7)
  })
})

describe('waitlist eligibility', () => {
  it('allows waitlist when full and active', () => {
    const event = toProgramEvent(
      mapTrainingToEvent({
        id: '1',
        properties: { available_capacity: '0', capacity: '10' },
      })
    )

    expect(canAcceptWaitlist(event)).toBe(true)
    expect(canAcceptRegistration(event)).toBe(false)
  })

  it('blocks waitlist when inactive', () => {
    const event = {
      ...toProgramEvent(
        mapTrainingToEvent({
          id: '1',
          properties: { available_capacity: '0', capacity: '10' },
        })
      ),
      active: false,
    }

    expect(canAcceptWaitlist(event)).toBe(false)
  })
})
