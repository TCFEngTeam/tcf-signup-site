import { describe, expect, it } from 'vitest'
import {
  formatTrainingScheduleLines,
  getScheduleSortDate,
  hasSecondTrainingSession,
} from '@/lib/dates/format-schedule'

describe('formatTrainingScheduleLines', () => {
  it('formats a single-day session on one line', () => {
    expect(
      formatTrainingScheduleLines({
        session1Start: '2026-06-03T19:00:00.000Z',
        session1End: '2026-06-03T22:00:00.000Z',
      })
    ).toEqual(['Jun 3, 2026, 3:00pm - 6:00pm EDT'])
  })

  it('formats multi-day trainings on separate lines', () => {
    expect(
      formatTrainingScheduleLines({
        session1Start: '2026-06-03T19:00:00.000Z',
        session1End: '2026-06-03T22:00:00.000Z',
        session2Start: '2026-06-04T19:00:00.000Z',
        session2End: '2026-06-04T22:00:00.000Z',
      })
    ).toEqual([
      'Jun 3, 2026, 3:00pm - 6:00pm EDT',
      'Jun 4, 2026, 3:00pm - 6:00pm EDT',
    ])
  })

  it('shows one line when second day datetimes are empty', () => {
    expect(
      formatTrainingScheduleLines({
        session1Start: '2026-07-01T17:00:00.000Z',
        session1End: '2026-07-01T18:00:00.000Z',
        session2Start: '',
        session2End: '',
      })
    ).toEqual(['Jul 1, 2026, 1:00pm - 2:00pm EDT'])
  })

  it('shows one line when only second day start is filled', () => {
    expect(
      formatTrainingScheduleLines({
        session1Start: '2026-07-01T17:00:00.000Z',
        session1End: '2026-07-01T18:00:00.000Z',
        session2Start: '2026-07-02T17:00:00.000Z',
        session2End: '',
      })
    ).toEqual(['Jul 1, 2026, 1:00pm - 2:00pm EDT'])
  })

  it('falls back when no schedule fields are set', () => {
    expect(formatTrainingScheduleLines({})).toEqual(['Date to be announced'])
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

describe('getScheduleSortDate', () => {
  it('returns ISO string from first session start', () => {
    expect(
      getScheduleSortDate({
        session1Start: '2026-06-03T19:00:00.000Z',
      })
    ).toBe('2026-06-03T19:00:00.000Z')
  })
})
