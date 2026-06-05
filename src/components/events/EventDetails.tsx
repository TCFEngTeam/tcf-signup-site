import React from 'react'
import { formatTrainingSchedule } from '@/lib/dates/format-schedule'
import { pagesContent } from '@/lib/content'
import type { ProgramEvent } from '@/lib/programs/events'
import CapacityIndicator from './CapacityIndicator'

const card = pagesContent.eventCard

type EventDetailsProps = {
  event?: Partial<
    Pick<
      ProgramEvent,
      'title' | 'startDate' | 'endDate' | 'location' | 'capacity' | 'registered' | 'isFull' | 'active'
    >
  >
}

export default function EventDetails({ event }: EventDetailsProps) {
  const schedule = formatTrainingSchedule(event?.startDate, event?.endDate)
  const canWaitlist = Boolean(event?.isFull && event?.active !== false)
  const badgeLabel = canWaitlist
    ? card.badgeWaitlist
    : event?.isFull
      ? card.badgeFull
      : card.badgeOpen
  const badgeClass = canWaitlist
    ? 'badge-waitlist'
    : event?.isFull
      ? 'badge-full'
      : 'badge-open'

  return (
    <section className="event-details details-card">
      <div className={`event-badge ${badgeClass}`}>{badgeLabel}</div>
      <h1 className="text-3xl font-bold mt-4 mb-2">{event?.title ?? card.fallbackTitle}</h1>
      <p className="text-sm helper-text">{schedule}</p>
      <p className="text-sm helper-text">{event?.location ?? card.fallbackLocation}</p>
      <CapacityIndicator
        capacity={event?.capacity}
        registered={event?.registered}
        isFull={event?.isFull}
      />
      <div className="extras">{/* host info, map, image, etc. */}</div>
    </section>
  )
}
