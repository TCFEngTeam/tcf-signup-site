import React from 'react'
import { pagesContent } from '@/lib/content'
import { canJoinWaitlist, type ProgramEvent } from '@/lib/programs/events'
import CapacityIndicator from './CapacityIndicator'
import TrainingScheduleText from './TrainingScheduleText'

const card = pagesContent.eventCard

type EventDetailsProps = {
  event?: Partial<
    Pick<
      ProgramEvent,
      | 'title'
      | 'schedule'
      | 'location'
      | 'capacity'
      | 'registered'
      | 'isFull'
      | 'waitlistFull'
      | 'availableWaitlistCapacity'
      | 'active'
      | 'registrationClosed'
    >
  >
}

function eventBadgeLabel(event: EventDetailsProps['event']) {
  if (event?.registrationClosed) return card.badgeRegistrationClosed
  if (
    canJoinWaitlist({
      active: event?.active !== false,
      isFull: Boolean(event?.isFull),
      registrationClosed: Boolean(event?.registrationClosed),
      waitlistFull: Boolean(event?.waitlistFull),
    })
  ) {
    return card.badgeWaitlist
  }
  if (event?.isFull && event?.waitlistFull) return card.badgeWaitlistFull
  if (event?.isFull) return card.badgeFull
  return card.badgeOpen
}

function eventBadgeClass(event: EventDetailsProps['event']) {
  if (event?.registrationClosed) return 'badge-registration-closed'
  if (
    canJoinWaitlist({
      active: event?.active !== false,
      isFull: Boolean(event?.isFull),
      registrationClosed: Boolean(event?.registrationClosed),
      waitlistFull: Boolean(event?.waitlistFull),
    })
  ) {
    return 'badge-waitlist'
  }
  if (event?.isFull && event?.waitlistFull) return 'badge-waitlist-full'
  if (event?.isFull) return 'badge-full'
  return 'badge-open'
}

export default function EventDetails({ event }: EventDetailsProps) {
  return (
    <section className="event-details details-card">
      <div className={`event-badge ${eventBadgeClass(event)}`}>{eventBadgeLabel(event)}</div>
      <h1 className="text-3xl font-bold mt-4 mb-2">{event?.title ?? card.fallbackTitle}</h1>
      <TrainingScheduleText schedule={event?.schedule} className="text-sm helper-text" />
      <p className="text-sm helper-text">{event?.location ?? card.fallbackLocation}</p>
      <CapacityIndicator
        capacity={event?.capacity}
        registered={event?.registered}
        isFull={event?.isFull}
        registrationClosed={event?.registrationClosed}
        availableWaitlistCapacity={event?.availableWaitlistCapacity}
        waitlistFull={event?.waitlistFull}
      />
      <div className="extras">{/* host info, map, image, etc. */}</div>
    </section>
  )
}
