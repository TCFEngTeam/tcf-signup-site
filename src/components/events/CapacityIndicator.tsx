import React from 'react'
import { formatContent, pagesContent } from '@/lib/content'

const capacity = pagesContent.capacity

type CapacityIndicatorProps = {
  capacity?: number
  registered?: number
  isFull?: boolean
  registrationClosed?: boolean
  availableWaitlistCapacity?: number
  waitlistFull?: boolean
}

export default function CapacityIndicator({
  capacity: totalCapacity = 0,
  registered = 0,
  isFull = false,
  registrationClosed = false,
  availableWaitlistCapacity = 0,
  waitlistFull = false,
}: CapacityIndicatorProps) {
  if (registrationClosed) {
    return <div className="capacity-indicator closed">{capacity.registrationClosed}</div>
  }

  if (isFull) {
    if (waitlistFull) {
      return <div className="capacity-indicator waitlist-full">{capacity.waitlistFull}</div>
    }

    if (availableWaitlistCapacity === 1) {
      return (
        <div className="capacity-indicator">
          {formatContent(capacity.oneWaitlistSpotRemaining, {
            count: String(availableWaitlistCapacity),
          })}
        </div>
      )
    }

    return (
      <div className="capacity-indicator">
        {formatContent(capacity.waitlistSpotsRemaining, {
          count: String(availableWaitlistCapacity),
        })}
      </div>
    )
  }

  const remaining = totalCapacity - registered
  return (
    <div className={`capacity-indicator ${remaining <= 0 ? 'full' : ''}`}>
      {remaining <= 0
        ? capacity.full
        : remaining === 1
          ? formatContent(capacity.oneSeatRemaining, { count: String(remaining) })
          : formatContent(capacity.seatsRemaining, { count: String(remaining) })}
    </div>
  )
}
