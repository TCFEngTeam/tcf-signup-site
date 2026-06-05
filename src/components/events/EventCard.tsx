"use client"

import React from 'react'
import Link from 'next/link'
import { formatTrainingSchedule } from '@/lib/dates/format-schedule'
import { pagesContent } from '@/lib/content'
import type { TrainingProgramId } from '@/lib/programs/config'
import CapacityIndicator from './CapacityIndicator'

const card = pagesContent.eventCard

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
    active?: boolean
  }
  program: TrainingProgramId
}

export default function EventCard({ event, program }: EventCardProps) {
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
    <article className="event-card">
      <div className="event-body">
        <div className={`event-badge ${badgeClass}`}>{badgeLabel}</div>
        <h3 className="event-title text-lg font-semibold">{event?.title ?? card.fallbackTitle}</h3>
        <p className="event-meta text-sm">{schedule}</p>
        <p className="event-location text-sm">{event?.location ?? card.fallbackLocation}</p>
        <CapacityIndicator
          capacity={event?.capacity}
          registered={event?.registered}
          isFull={event?.isFull}
        />

        {canWaitlist ? (
          <Link href={`/${program}/events/${event?.id}`} className="btn-primary inline-flex justify-center mt-3">
            {card.joinWaitlist}
          </Link>
        ) : event?.isFull ? (
          <span className="btn-primary inline-flex justify-center mt-3 cursor-not-allowed opacity-60">
            {card.badgeFull}
          </span>
        ) : (
          <Link href={`/${program}/events/${event?.id}`} className="btn-primary inline-flex justify-center mt-3">
            {card.signUp}
          </Link>
        )}
      </div>
    </article>
  )
}
