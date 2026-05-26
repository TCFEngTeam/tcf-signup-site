import React from 'react'

type EventCardProps = {
  event?: any
  onSignup?: () => void
}

export default function EventCard({ event, onSignup }: EventCardProps) {
  return (
    <article className="event-card">
      <div className="event-image">{/* placeholder image */}</div>
      <div className="event-body">
        <h3>{event?.title ?? 'Event Title'}</h3>
        <p className="meta">{event?.date ?? 'Date • Time'}</p>
        <p className="location">{event?.location ?? 'Location'}</p>
        <p className="capacity">Seats: {event?.registered ?? 0} / {event?.capacity ?? '—'}</p>
        <button onClick={onSignup} disabled={event?.isFull}> {event?.isFull ? 'Full' : 'Sign up'}</button>
      </div>
    </article>
  )
}
