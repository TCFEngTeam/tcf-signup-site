import React from 'react'
import { formatTrainingSchedule } from '@/lib/dates/format-schedule'
import type { ProgramEvent } from '@/lib/programs/events'
import CapacityIndicator from './CapacityIndicator'

type EventDetailsProps = {
  event?: Partial<
    Pick<
      ProgramEvent,
      'title' | 'startDate' | 'endDate' | 'location' | 'capacity' | 'registered' | 'isFull'
    >
  >
}

export default function EventDetails({ event }: EventDetailsProps) {
  const schedule = formatTrainingSchedule(event?.startDate, event?.endDate)

  return (
    <section className="event-details details-card">
      <div className={`event-badge ${event?.isFull ? 'badge-full' : 'badge-open'}`}>
        {event?.isFull ? 'Full' : 'Open for signups'}
      </div>
      <h1 className="text-3xl font-bold mt-4 mb-2">{event?.title ?? 'Event Title'}</h1>
      <p className="text-sm helper-text">{schedule}</p>
      <p className="text-sm helper-text">{event?.location ?? 'Location'}</p>
      <CapacityIndicator capacity={event?.capacity} registered={event?.registered} />
      <div className="extras">{/* host info, map, image, etc. */}</div>
    </section>
  )
}
