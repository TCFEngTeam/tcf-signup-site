"use client"

import React from 'react'
import Link from 'next/link'
import { formatTrainingSchedule } from '@/lib/formatTrainingSchedule'
import type { TrainingProgramId } from '@/lib/trainingPrograms'
import CapacityIndicator from './CapacityIndicator'

type EventCardProps = {
  event?: {
    id?: string
    title?: string
    startDate?: string
    endDate?: string
    location?: string
    capacity?: number
    registered?: number
    isFull?: boolean
  }
  program: TrainingProgramId
}

export default function EventCard({ event, program }: EventCardProps) {
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
        <CapacityIndicator
          capacity={event?.capacity}
          registered={event?.registered}
        />

        {event?.isFull ? (
          <span className="btn-primary inline-flex justify-center mt-3 cursor-not-allowed opacity-60">Full</span>
        ) : (
          <Link href={`/${program}/events/${event?.id}`} className="btn-primary inline-flex justify-center mt-3">
            Sign up
          </Link>
        )}
      </div>
    </article>
  )
}
