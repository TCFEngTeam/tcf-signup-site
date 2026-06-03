import { describe, expect, it } from 'vitest'
import { mapTrainingToEvent } from '@/lib/hubspot/api'
import { canAcceptRegistration, toProgramEvent } from '@/lib/programs/events'

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
    expect(event.registrationClosed).toBe(false)
    expect(event.registered).toBe(20)
    expect(event.capacity).toBe(20)
  })

  it('marks registration closed when HubSpot stage matches config', () => {
    const event = toProgramEvent(
      mapTrainingToEvent({
        id: '2',
        properties: {
          name: 'MHFA - Past cutoff',
          hs_pipeline_stage: 'closed-stage-id',
          available_capacity: '10',
          capacity: '20',
        },
      }),
      'closed-stage-id'
    )

    expect(event.registrationClosed).toBe(true)
    expect(event.isFull).toBe(false)
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

  it('canAcceptRegistration is false when registration is closed', () => {
    const event = toProgramEvent(
      mapTrainingToEvent({
        id: '3',
        properties: {
          name: 'QPR Closed',
          hs_pipeline_stage: 'qpr-closed',
          available_capacity: '5',
          capacity: '10',
        },
      }),
      'qpr-closed'
    )

    expect(canAcceptRegistration(event)).toBe(false)
  })
})
