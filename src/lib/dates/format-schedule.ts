import pagesJson from '../../../content/pages.json'
import type { PagesContent } from '@/lib/content/types'

const DEFAULT_SCHEDULE_TIME_ZONE = 'America/New_York'
const scheduleLabels = (pagesJson as PagesContent).schedule

export type FormatScheduleOptions = {
  /** IANA timezone (e.g. America/New_York). Defaults to Eastern for server/email use. */
  timeZone?: string
}

export { DEFAULT_SCHEDULE_TIME_ZONE }

export type TrainingSchedule = {
  session1Start?: string
  session1End?: string
  session2Start?: string
  session2End?: string
}

export {
  getTrainingCutoffPropertyKey,
  getTrainingSchedulePropertyKeys,
} from '@/lib/hubspot/config'

/** End of the training session — prefers day 2 end when present. */
export function getTrainingEventEndDate(schedule: TrainingSchedule): Date | null {
  return (
    parseScheduleDateTime(schedule.session2End) ??
    parseScheduleDateTime(schedule.session1End)
  )
}

export function getTrainingEventEndUnix(schedule: TrainingSchedule): number | null {
  const end = getTrainingEventEndDate(schedule)
  return end ? Math.floor(end.getTime() / 1000) : null
}

/** True when the training session end datetime is in the past. */
export function isTrainingEventEnded(
  schedule: TrainingSchedule,
  now: Date = new Date()
): boolean {
  const end = getTrainingEventEndDate(schedule)
  if (!end) return false
  return now.getTime() > end.getTime()
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

function formatDatePart(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone,
  }).format(date)
}

function formatTimePart(date: Date, timeZone: string): string {
  const formatted = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(date)

  return formatted.replace(/\s/g, '').toLowerCase()
}

function formatTimeZoneAbbreviation(date: Date, timeZone: string): string {
  const part = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'short',
  })
    .formatToParts(date)
    .find((entry) => entry.type === 'timeZoneName')

  return part?.value ?? scheduleLabels.fallbackTimeZone
}

export function formatSessionLineFromRange(
  start?: string,
  end?: string,
  options?: FormatScheduleOptions
): string | null {
  const timeZone = options?.timeZone ?? DEFAULT_SCHEDULE_TIME_ZONE
  const startDate = parseScheduleDateTime(start)
  const endDate = parseScheduleDateTime(end)

  if (!startDate && !endDate) return null

  if (startDate && endDate) {
    const dateLabel = formatDatePart(startDate, timeZone)
    const startTime = formatTimePart(startDate, timeZone)
    const endTime = formatTimePart(endDate, timeZone)
    const timeZoneLabel = formatTimeZoneAbbreviation(startDate, timeZone)
    return `${dateLabel}, ${startTime} - ${endTime} ${timeZoneLabel}`
  }

  const single = startDate ?? endDate
  if (!single) return null

  return `${formatDatePart(single, timeZone)}, ${formatTimePart(single, timeZone)} ${formatTimeZoneAbbreviation(single, timeZone)}`
}

export function hasSecondTrainingSession(schedule: TrainingSchedule): boolean {
  return Boolean(schedule.session2Start?.trim() && schedule.session2End?.trim())
}

export function formatTrainingScheduleLines(
  schedule: TrainingSchedule,
  options?: FormatScheduleOptions
): string[] {
  const line1 = formatSessionLineFromRange(schedule.session1Start, schedule.session1End, options)
  const line2 = hasSecondTrainingSession(schedule)
    ? formatSessionLineFromRange(schedule.session2Start, schedule.session2End, options)
    : '---'

  if (!line1) {
    return [scheduleLabels.dateToBeAnnounced, '---']
  }

  if (hasSecondTrainingSession(schedule)) {
    return line2 ? [line1, line2] : [line1]
  }

  return [line1, '---']
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
