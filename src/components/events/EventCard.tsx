"use client"

import React from 'react'
import Link from 'next/link'
import { trainingsEventPath } from '@/lib/routes'
import type { TrainingSchedule } from '@/lib/dates/format-schedule'
import { pagesContent } from '@/lib/content'
import type { TrainingProgramId } from '@/lib/programs/config'
import { canJoinWaitlist } from '@/lib/programs/events'
import CapacityIndicator from './CapacityIndicator'
import TrainingScheduleText from './TrainingScheduleText'

const card = pagesContent.eventCard

type EventCardEvent = {
  id?: string
  title?: string
  schedule?: TrainingSchedule
  location?: string
  capacity?: number
  registered?: number
  isFull?: boolean
  waitlistFull?: boolean
  availableWaitlistCapacity?: number
  active?: boolean
  registrationClosed?: boolean
}

type EventCardProps = {
  event?: EventCardEvent
  program: TrainingProgramId
  /** Open signup / waitlist links in a new browser tab (embed listings). */
  openSignupInNewTab?: boolean
}

function eventBadgeLabel(event: EventCardEvent | undefined) {
  if (event?.registrationClosed) return card.badgeRegistrationClosed
  if (canJoinWaitlist({
    active: event?.active !== false,
    isFull: Boolean(event?.isFull),
    registrationClosed: Boolean(event?.registrationClosed),
    waitlistFull: Boolean(event?.waitlistFull),
  })) {
    return card.badgeWaitlist
  }
  if (event?.isFull && event?.waitlistFull) return card.badgeWaitlistFull
  if (event?.isFull) return card.badgeFull
  return card.badgeOpen
}

function eventBadgeClass(event: EventCardEvent | undefined) {
  if (event?.registrationClosed) return 'badge-registration-closed'
  if (canJoinWaitlist({
    active: event?.active !== false,
    isFull: Boolean(event?.isFull),
    registrationClosed: Boolean(event?.registrationClosed),
    waitlistFull: Boolean(event?.waitlistFull),
  })) {
    return 'badge-waitlist'
  }
  if (event?.isFull && event?.waitlistFull) return 'badge-waitlist-full'
  if (event?.isFull) return 'badge-full'
  return 'badge-open'
}

export default function EventCard({ event, program, openSignupInNewTab }: EventCardProps) {
  const waitlistOpen = canJoinWaitlist({
    active: event?.active !== false,
    isFull: Boolean(event?.isFull),
    registrationClosed: Boolean(event?.registrationClosed),
    waitlistFull: Boolean(event?.waitlistFull),
  })
  const signupBlocked = Boolean(event?.registrationClosed || (event?.isFull && !waitlistOpen))
  const blockedLabel = event?.registrationClosed
    ? card.badgeRegistrationClosed
    : event?.waitlistFull
      ? card.badgeWaitlistFull
      : card.badgeFull
  const signupLinkProps = openSignupInNewTab
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

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
          isFull={event?.isFull}
          registrationClosed={event?.registrationClosed}
          availableWaitlistCapacity={event?.availableWaitlistCapacity}
          waitlistFull={event?.waitlistFull}
        />

        {waitlistOpen ? (
          <Link
            href={trainingsEventPath(program, event?.id ?? '')}
            className="btn-primary event-cta inline-flex justify-center"
            {...signupLinkProps}
          >
            {card.joinWaitlist}
          </Link>
        ) : signupBlocked ? (
          <span
            className={`btn-primary btn-primary--inactive event-cta inline-flex justify-center${
              event?.registrationClosed ? ' btn-primary--registration-closed' : ''
            }`}
            aria-disabled="true"
          >
            {blockedLabel}
          </span>
        ) : (
          <Link
            href={trainingsEventPath(program, event?.id ?? '')}
            className="btn-primary event-cta inline-flex justify-center"
            {...signupLinkProps}
          >
            {card.signUp}
          </Link>
        )}
      </div>
    </article>
  )
}
