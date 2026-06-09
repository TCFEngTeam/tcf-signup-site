"use client"

import React from 'react'
import Link from 'next/link'
import type { TrainingSchedule } from '@/lib/dates/format-schedule'
import { pagesContent } from '@/lib/content'
import type { TrainingProgramId } from '@/lib/programs/config'
import CapacityIndicator from './CapacityIndicator'
import TrainingScheduleText from './TrainingScheduleText'

const card = pagesContent.eventCard

type EventCardProps = {
  event?: {
    id?: string
    title?: string
    schedule?: TrainingSchedule
    location?: string
    capacity?: number
    registered?: number
    isFull?: boolean
    active?: boolean
    registrationClosed?: boolean
  }
  program: TrainingProgramId
}

function eventBadgeLabel(event: EventCardProps['event']) {
  if (event?.registrationClosed) return card.badgeRegistrationClosed
  if (event?.isFull) return card.badgeFull
  return card.badgeOpen
}

function eventBadgeClass(event: EventCardProps['event']) {
  if (event?.registrationClosed) return 'badge-registration-closed'
  if (event?.isFull) return 'badge-full'
  return 'badge-open'
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
        <div className={`event-badge ${eventBadgeClass(event)}`}>{eventBadgeLabel(event)}</div>
        <h3 className="event-title text-lg font-semibold">{event?.title ?? card.fallbackTitle}</h3>
        <TrainingScheduleText schedule={event?.schedule} className="event-meta text-sm" />
        <p className="event-location text-sm">{event?.location ?? card.fallbackLocation}</p>
        <CapacityIndicator
          capacity={event?.capacity}
          registered={event?.registered}
          registrationClosed={event?.registrationClosed}
          isFull={event?.isFull}
        />

        {canWaitlist ? (
          <Link href={`/${program}/events/${event?.id}`} className="btn-primary inline-flex justify-center mt-3">
            {card.joinWaitlist}
          </Link>
        ) : signupBlocked ? (
          <span className="btn-primary inline-flex justify-center mt-3 cursor-not-allowed opacity-60">
            
            {blockedLabel}
          
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
