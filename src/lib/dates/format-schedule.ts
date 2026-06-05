import pagesJson from '../../../content/pages.json'
import type { PagesContent } from '@/lib/content/types'

const SCHEDULE_TIME_ZONE = 'America/New_York'
const scheduleLabels = (pagesJson as PagesContent).schedule

export type TrainingSchedule = {
  session1Start?: string
  session1End?: string
  session2Start?: string
  session2End?: string
}

export function getTrainingCutoffPropertyKey() {
  return process.env.HUBSPOT_TRAINING_CUTOFF_PROPERTY ?? 'cutoff_time'
}

export function getTrainingSchedulePropertyKeys() {
  return {
    session1Start:
      process.env.HUBSPOT_TRAINING_1ST_DAY_START_PROPERTY ??
      'training_1st_day_start_datetime',
    session1End:
      process.env.HUBSPOT_TRAINING_1ST_DAY_END_PROPERTY ?? 'training_1st_day_end_datetime',
    session2Start:
      process.env.HUBSPOT_TRAINING_2ND_DAY_START_PROPERTY ??
      'training_2nd_day_start_datetime',
    session2End:
      process.env.HUBSPOT_TRAINING_2ND_DAY_END_PROPERTY ?? 'training_2nd_day_end_datetime',
  }
}

export function parseScheduleDateTime(value?: string): Date | null {
  if (!value?.trim()) return null

  const trimmed = value.trim()
  if (/^\d+$/.test(trimmed)) {
    const parsed = new Date(Number(trimmed))
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const parsed = new Date(trimmed)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDatePart(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: SCHEDULE_TIME_ZONE,
  }).format(date)
}

function formatTimePart(date: Date): string {
  const formatted = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: SCHEDULE_TIME_ZONE,
  }).format(date)

  return formatted.replace(/\s/g, '').toLowerCase()
}

function formatTimeZoneAbbreviation(date: Date): string {
  const part = new Intl.DateTimeFormat('en-US', {
    timeZone: SCHEDULE_TIME_ZONE,
    timeZoneName: 'short',
  })
    .formatToParts(date)
    .find((entry) => entry.type === 'timeZoneName')

  return part?.value ?? scheduleLabels.fallbackTimeZone
}

export function formatSessionLineFromRange(start?: string, end?: string): string | null {
  const startDate = parseScheduleDateTime(start)
  const endDate = parseScheduleDateTime(end)

  if (!startDate && !endDate) return null

  if (startDate && endDate) {
    const dateLabel = formatDatePart(startDate)
    const startTime = formatTimePart(startDate)
    const endTime = formatTimePart(endDate)
    const timeZone = formatTimeZoneAbbreviation(startDate)
    return `${dateLabel}, ${startTime} - ${endTime} ${timeZone}`
  }

  const single = startDate ?? endDate
  if (!single) return null

  return `${formatDatePart(single)}, ${formatTimePart(single)} ${formatTimeZoneAbbreviation(single)}`
}

export function hasSecondTrainingSession(schedule: TrainingSchedule): boolean {
  return Boolean(schedule.session2Start?.trim() && schedule.session2End?.trim())
}

export function formatTrainingScheduleLines(schedule: TrainingSchedule): string[] {
  const line1 = formatSessionLineFromRange(schedule.session1Start, schedule.session1End)
  const line2 = hasSecondTrainingSession(schedule)
    ? formatSessionLineFromRange(schedule.session2Start, schedule.session2End)
    : null

  const lines = [line1, line2].filter((line): line is string => Boolean(line))
  if (lines.length === 0) return [scheduleLabels.dateToBeAnnounced]
  return lines
}

/** ISO date for sorting listings (first session start). */
export function getScheduleSortDate(schedule: TrainingSchedule): string | undefined {
  const parsed = parseScheduleDateTime(schedule.session1Start)
  return parsed?.toISOString()
}

/** @deprecated Use formatTrainingScheduleLines */
export function formatTrainingSchedule(startDate?: string, endDate?: string): string {
  return formatTrainingScheduleLines({
    session1Start: startDate,
    session1End: endDate,
  }).join('\n')
}
