import React from 'react'

type CapacityIndicatorProps = {
  capacity?: number
  registered?: number
}

export default function CapacityIndicator({ capacity = 0, registered = 0 }: CapacityIndicatorProps) {
  const remaining = capacity - registered
  return (
    <div className={`capacity-indicator ${remaining <= 0 ? 'full' : ''}`}>
      {remaining <= 0 ? 'Full' : `${remaining} seats remaining`}
    </div>
  )
}
