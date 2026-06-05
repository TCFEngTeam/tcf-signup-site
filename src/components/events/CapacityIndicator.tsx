import React from 'react'
import { pagesContent } from '@/lib/content'

const capacity = pagesContent.capacity

type CapacityIndicatorProps = {
  capacity?: number
  registered?: number
  isFull?: boolean
}

export default function CapacityIndicator({
  capacity: totalCapacity = 0,
  registered = 0,
  isFull = false,
}: CapacityIndicatorProps) {
  const remaining = totalCapacity - registered

  if (isFull) {
    return <div className="capacity-indicator full">{capacity.full}</div>
  }

  if (remaining <= 0) {
    return <div className="capacity-indicator full">{capacity.full}</div>
  }

  if (remaining === 1) {
    return <div className="capacity-indicator">{capacity.oneSeatRemaining}</div>
  }

  return (
    <div className="capacity-indicator">
      {capacity.seatsRemaining.replace('{count}', String(remaining))}
    </div>
  )
}
