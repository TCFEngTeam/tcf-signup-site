import { describe, expect, it } from 'vitest'
import { mapTrainingToEvent } from '@/lib/hubspot/api'
import { canAcceptRegistration, canAcceptWaitlist, toProgramEvent } from '@/lib/programs/events'
import {
  canAcceptRegistration,
  isRegistrationClosedByTime,
  toProgramEvent,
} from '@/lib/programs/events'

describe('toProgramEvent', () => {
  it('maps HubSpot training fields and full status', () => {
    const event = toProgramEvent(
      mapTrainingToEvent({
        id: '559388347197',
        properties: {
          hs_course_name: 'MHFA - June 3',
          training_1st_day_start_datetime: '2030-06-03T19:00:00.000Z',
          training_1st_day_end_datetime: '2030-06-03T22:00:00.000Z',
          training_2nd_day_start_datetime: '2030-06-04T19:00:00.000Z',
          training_2nd_day_end_datetime: '2030-06-04T22:00:00.000Z',
          hs_enrollment_capacity: '20',
          available_capacity: '0',
        },
      }),
      undefined,
      { now: new Date('2030-01-01T00:00:00.000Z') }
    )

    expect(event.title).toBe('MHFA - June 3')
    expect(event.isFull).toBe(true)
    expect(event.registrationClosed).toBe(false)
    expect(event.registered).toBe(20)
    expect(event.capacity).toBe(20)
    expect(event.schedule.session1Start).toBe('2030-06-03T19:00:00.000Z')
    expect(event.schedule.session2Start).toBe('2030-06-04T19:00:00.000Z')
  })

  it('marks registration closed within 48 hours of first session start', () => {
    const sessionStart = '2030-06-10T19:00:00.000Z'
    const mapped = mapTrainingToEvent({
      id: 'time-close',
      properties: {
        name: 'Upcoming Session',
        training_1st_day_start_datetime: sessionStart,
        training_1st_day_end_datetime: '2030-06-10T22:00:00.000Z',
        available_capacity: '5',
        capacity: '10',
      },
    })

    const moreThan48HoursBefore = toProgramEvent(mapped, undefined, {
      now: new Date('2030-06-08T18:59:59.000Z'),
    })
    const exactly48HoursBefore = toProgramEvent(mapped, undefined, {
      now: new Date('2030-06-08T19:00:00.000Z'),
    })

    expect(moreThan48HoursBefore.registrationClosed).toBe(false)
    expect(exactly48HoursBefore.registrationClosed).toBe(true)
    expect(canAcceptRegistration(exactly48HoursBefore)).toBe(false)
  })

  it('marks registration closed when HubSpot stage matches config', () => {
    const event = toProgramEvent(
      mapTrainingToEvent({
        id: '2',
        properties: {
          name: 'MHFA - Past cutoff',
          hs_pipeline_stage: 'closed-stage-id',
          training_1st_day_start_datetime: '2026-06-03T19:00:00.000Z',
          training_1st_day_end_datetime: '2026-06-03T22:00:00.000Z',
          available_capacity: '10',
          capacity: '20',
        },
      }),
      'closed-stage-id'
    )

    expect(event.registrationClosed).toBe(true)
    expect(event.isFull).toBe(false)
  })

  it('maps single-day QPR session schedule', () => {
    const event = toProgramEvent(
      mapTrainingToEvent({
        id: '1',
        properties: {
          name: 'QPR Session',
          training_1st_day_start_datetime: '2026-07-01T17:00:00.000Z',
          training_1st_day_end_datetime: '2026-07-01T18:00:00.000Z',
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
