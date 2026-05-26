import React from 'react'

type EventDetailsProps = {
  event?: any
}

export default function EventDetails({ event }: EventDetailsProps) {
  return (
    <section className="event-details">
      <h1>{event?.title ?? 'Event Title'}</h1>
      <p className="meta">{event?.date ?? 'Date • Time'}</p>
      <p className="location">{event?.location ?? 'Location'}</p>
      <div className="description">{event?.description ?? 'Event description goes here.'}</div>
      <div className="extras">{/* host info, map, image, etc. */}</div>
    </section>
  )
}
