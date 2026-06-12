import { describe, expect, it } from 'vitest'
import {
  DEFAULT_SCHEDULE_TIME_ZONE,
  formatTrainingScheduleLines,
  getScheduleSortDate,
  getTrainingEventEndDate,
  getTrainingEventEndUnix,
  hasSecondTrainingSession,
  isTrainingEventEnded,
} from '@/lib/dates/format-schedule'

const eastern = { timeZone: DEFAULT_SCHEDULE_TIME_ZONE }

describe('formatTrainingScheduleLines', () => {
  it('formats a single-day session on one line', () => {
    expect(
      formatTrainingScheduleLines(
        {
          session1Start: '2026-06-03T19:00:00.000Z',
          session1End: '2026-06-03T22:00:00.000Z',
        },
        eastern
      )
    ).toEqual(['Jun 3, 2026, 3:00pm - 6:00pm EDT'])
  })

  it('formats multi-day trainings on separate lines', () => {
    expect(
      formatTrainingScheduleLines(
        {
          session1Start: '2026-06-03T19:00:00.000Z',
          session1End: '2026-06-03T22:00:00.000Z',
          session2Start: '2026-06-04T19:00:00.000Z',
          session2End: '2026-06-04T22:00:00.000Z',
        },
        eastern
      )
    ).toEqual([
      'Jun 3, 2026, 3:00pm - 6:00pm EDT',
      'Jun 4, 2026, 3:00pm - 6:00pm EDT',
    ])
  })

  it('shows one line when second day datetimes are empty', () => {
    expect(
      formatTrainingScheduleLines(
        {
          session1Start: '2026-07-01T17:00:00.000Z',
          session1End: '2026-07-01T18:00:00.000Z',
          session2Start: '',
          session2End: '',
        },
        eastern
      )
    ).toEqual(['Jul 1, 2026, 1:00pm - 2:00pm EDT'])
  })

  it('shows one line when only second day start is filled', () => {
    expect(
      formatTrainingScheduleLines(
        {
          session1Start: '2026-07-01T17:00:00.000Z',
          session1End: '2026-07-01T18:00:00.000Z',
          session2Start: '2026-07-02T17:00:00.000Z',
          session2End: '',
        },
        eastern
      )
    ).toEqual(['Jul 1, 2026, 1:00pm - 2:00pm EDT'])
  })

  it('falls back when no schedule fields are set', () => {
    expect(formatTrainingScheduleLines({})).toEqual(['Date to be announced'])
  })

  it('formats in the requested IANA timezone', () => {
    expect(
      formatTrainingScheduleLines(
        {
          session1Start: '2026-06-03T19:00:00.000Z',
          session1End: '2026-06-03T22:00:00.000Z',
        },
        { timeZone: 'America/Los_Angeles' }
      )
    ).toEqual(['Jun 3, 2026, 12:00pm - 3:00pm PDT'])
  })
})

describe('hasSecondTrainingSession', () => {
  it('requires both second day start and end datetimes', () => {
    expect(
      hasSecondTrainingSession({
        session2Start: '2026-06-04T19:00:00.000Z',
        session2End: '2026-06-04T22:00:00.000Z',
      })
    ).toBe(true)
    expect(
      hasSecondTrainingSession({
        session2Start: '2026-06-04T19:00:00.000Z',
        session2End: '',
      })
    ).toBe(false)
  })
})

describe('getTrainingEventEndDate', () => {
  it('prefers the second session end when present', () => {
    const schedule = {
      session1End: '2026-06-03T22:00:00.000Z',
      session2End: '2026-06-04T22:00:00.000Z',
    }
    expect(getTrainingEventEndDate(schedule)?.toISOString()).toBe('2026-06-04T22:00:00.000Z')
    expect(getTrainingEventEndUnix(schedule)).toBe(
      Math.floor(new Date('2026-06-04T22:00:00.000Z').getTime() / 1000)
    )
  })

  it('falls back to the first session end', () => {
    const schedule = {
      session1End: '2026-06-03T22:00:00.000Z',
    }
    expect(getTrainingEventEndDate(schedule)?.toISOString()).toBe('2026-06-03T22:00:00.000Z')
  })
})

describe('isTrainingEventEnded', () => {
  it('returns true after the session end datetime', () => {
    const schedule = { session1End: '2026-06-03T22:00:00.000Z' }
    const beforeEnd = new Date('2026-06-03T21:00:00.000Z')
    const afterEnd = new Date('2026-06-03T23:00:00.000Z')
    expect(isTrainingEventEnded(schedule, beforeEnd)).toBe(false)
    expect(isTrainingEventEnded(schedule, afterEnd)).toBe(true)
  })

  it('uses the second session end when present', () => {
    const schedule = {
      session1End: '2026-06-03T22:00:00.000Z',
      session2End: '2026-06-04T22:00:00.000Z',
    }
    const afterDayOne = new Date('2026-06-03T23:00:00.000Z')
    const afterDayTwo = new Date('2026-06-04T23:00:00.000Z')
    expect(isTrainingEventEnded(schedule, afterDayOne)).toBe(false)
    expect(isTrainingEventEnded(schedule, afterDayTwo)).toBe(true)
  })

  it('returns false when no end date is available', () => {
    expect(isTrainingEventEnded({}, new Date('2030-01-01T00:00:00.000Z'))).toBe(false)
  })
})

describe('getScheduleSortDate', () => {
  it('returns ISO string from first session start', () => {
    expect(
      getScheduleSortDate({
        session1Start: '2026-06-03T19:00:00.000Z',
      })
    ).toBe('2026-06-03T19:00:00.000Z')
  })
})
