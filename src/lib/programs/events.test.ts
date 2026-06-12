import { describe, expect, it } from 'vitest'
import { mapTrainingToEvent } from '@/lib/hubspot/api'
import {
  canAcceptRegistration,
  canAcceptWaitlist,
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
    expect(event.schedule.session2Start).toBeUndefined()
  })

  it('canAcceptRegistration is false when registration is closed', () => {
    const event = toProgramEvent(
      mapTrainingToEvent({
        id: '3',
        properties: {
          name: 'QPR Closed',
          hs_pipeline_stage: 'qpr-closed',
          training_1st_day_start_datetime: '2026-06-03T19:00:00.000Z',
          training_1st_day_end_datetime: '2026-06-03T22:00:00.000Z',
          available_capacity: '5',
          capacity: '10',
        },
      }),
      'qpr-closed'
    )

    expect(canAcceptRegistration(event)).toBe(false)
  })
})

describe('isRegistrationClosedByTime', () => {
  const schedule = { session1Start: '2030-06-10T19:00:00.000Z' }

  it('is false when first session start is missing', () => {
    expect(isRegistrationClosedByTime({})).toBe(false)
  })

  it('is false more than 48 hours before start', () => {
    expect(isRegistrationClosedByTime(schedule, new Date('2030-06-08T18:00:00.000Z'))).toBe(
      false
    )
  })

  it('is true within 48 hours of start', () => {
    expect(isRegistrationClosedByTime(schedule, new Date('2030-06-10T18:00:00.000Z'))).toBe(
      true
    )
  })

  it('uses cutoff_time when set instead of the 48-hour default', () => {
    const cutoffTime = '2030-06-05T12:00:00.000Z'

    expect(
      isRegistrationClosedByTime(schedule, new Date('2030-06-05T11:59:59.000Z'), cutoffTime)
    ).toBe(false)
    expect(
      isRegistrationClosedByTime(schedule, new Date('2030-06-05T12:00:00.000Z'), cutoffTime)
    ).toBe(true)
  })
})

describe('toProgramEvent cutoff_time', () => {
  it('marks registration closed when HubSpot cutoff_time is in the past', () => {
    const mapped = mapTrainingToEvent({
      id: 'custom-cutoff',
      properties: {
        name: 'Custom cutoff session',
        training_1st_day_start_datetime: '2030-06-10T19:00:00.000Z',
        training_1st_day_end_datetime: '2030-06-10T22:00:00.000Z',
        available_capacity: '5',
        capacity: '10',
        cutoff_time: '2030-06-01T12:00:00.000Z',
      },
    })

    const event = toProgramEvent(mapped, undefined, {
      now: new Date('2030-06-02T00:00:00.000Z'),
    })

    expect(event.registrationClosed).toBe(true)
  })

  it('keeps registration open before HubSpot cutoff_time even within 48 hours of start', () => {
    const mapped = mapTrainingToEvent({
      id: 'late-cutoff',
      properties: {
        name: 'Late cutoff session',
        training_1st_day_start_datetime: '2030-06-10T19:00:00.000Z',
        training_1st_day_end_datetime: '2030-06-10T22:00:00.000Z',
        available_capacity: '5',
        capacity: '10',
        cutoff_time: '2030-06-10T18:00:00.000Z',
      },
    })

    const event = toProgramEvent(mapped, undefined, {
      now: new Date('2030-06-09T00:00:00.000Z'),
    })

    expect(event.registrationClosed).toBe(false)
    expect(canAcceptRegistration(event)).toBe(true)
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

  it('blocks waitlist when registration is closed', () => {
    const event = toProgramEvent(
      mapTrainingToEvent({
        id: '1',
        properties: {
          available_capacity: '0',
          capacity: '10',
          hs_pipeline_stage: 'closed-stage-id',
        },
      }),
      'closed-stage-id'
    )

    expect(canAcceptWaitlist(event)).toBe(true)
    expect(event.registrationClosed).toBe(true)
  })
})
