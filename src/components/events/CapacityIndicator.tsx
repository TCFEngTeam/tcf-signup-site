import React from 'react'
import { formatContent, pagesContent } from '@/lib/content'

const capacity = pagesContent.capacity

type CapacityIndicatorProps = {
  capacity?: number
  registered?: number
  registrationClosed?: boolean
}

export default function CapacityIndicator({
  capacity: totalCapacity = 0,
  registered = 0,
  registrationClosed = false,
}: CapacityIndicatorProps) {
  if (registrationClosed) {
    return <div className="capacity-indicator closed">{capacity.registrationClosed}</div>
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
