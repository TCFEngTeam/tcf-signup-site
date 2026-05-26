import React from 'react'

type EventDetailsProps = {
  event?: any
}

export default function EventDetails({ event }: EventDetailsProps) {
  return (
    <section className="event-details details-card">
      <div className={`event-badge ${event?.isFull ? 'badge-full' : 'badge-open'}`}>
        {event?.isFull ? 'Full' : 'Open for signups'}
      </div>
      <h1 className="text-3xl font-bold mt-4 mb-2">{event?.title ?? 'Event Title'}</h1>
      <p className="text-sm helper-text">{event?.date ?? 'Date • Time'}</p>
      <p className="text-sm helper-text">{event?.location ?? 'Location'}</p>
      <div className="description mt-6 text-[15px] leading-7 text-slate-800">
        {event?.description ?? 'Event description goes here.'}
      </div>
      <div className="extras">{/* host info, map, image, etc. */}</div>
    </section>
  )
}
