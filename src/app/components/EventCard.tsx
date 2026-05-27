"use client"

import React from 'react'
import Link from 'next/link'
import { formatTrainingSchedule } from '@/lib/hubspotApi'

type EventCardProps = {
  event?: any
}

export default function EventCard({ event }: EventCardProps) {
  const schedule = formatTrainingSchedule(event?.startDate, event?.endDate)

  return (
    <article className="event-card">
      {
      //<div className="event-image">{/* placeholder image */}</div>
      }
      <div className="event-body">
        <div className={`event-badge ${event?.isFull ? 'badge-full' : 'badge-open'}`}>
          {event?.isFull ? 'Full' : 'Open'}
        </div>
        <h3 className="event-title text-lg font-semibold">{event?.title ?? 'Event Title'}</h3>
        <p className="event-meta text-sm">{schedule}</p>
        <p className="event-location text-sm">{event?.location ?? 'Location'}</p>
        <p className="event-capacity text-sm mt-2">Seats: {event?.registered ?? 0} / {event?.capacity ?? '—'}</p>

        {event?.isFull ? (
          <span className="btn-primary inline-flex justify-center mt-3 cursor-not-allowed opacity-60">Full</span>
        ) : (
          <Link href={`/events/${event?.id}`} className="btn-primary inline-flex justify-center mt-3">
            Sign up
          </Link>
        )}
      </div>
    </article>
  )
}
