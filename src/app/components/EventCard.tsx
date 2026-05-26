"use client"

import React from 'react'
import Link from 'next/link'

type EventCardProps = {
  event?: any
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="event-card border rounded-md p-4 bg-white">
      <div className="event-image mb-3">{/* placeholder image */}</div>
      <div className="event-body">
        <h3 className="text-lg font-semibold">{event?.title ?? 'Event Title'}</h3>
        <p className="meta text-sm text-zinc-600">{event?.date ?? 'Date • Time'}</p>
        <p className="location text-sm">{event?.location ?? 'Location'}</p>
        <p className="capacity text-sm mt-2">Seats: {event?.registered ?? 0} / {event?.capacity ?? '—'}</p>

        {event?.isFull ? (
          <span className="inline-block mt-3 rounded-full bg-red-100 px-3 py-1 text-sm">Full</span>
        ) : (
          <Link href={`/events/${event?.id}`} className="inline-block mt-3 rounded bg-blue-600 px-4 py-2 text-white text-sm">
            Sign up
          </Link>
        )}
      </div>
    </article>
  )
}
