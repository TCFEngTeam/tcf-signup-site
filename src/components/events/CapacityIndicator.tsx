import React from 'react'

type CapacityIndicatorProps = {
  capacity?: number
  registered?: number
  registrationClosed?: boolean
}

export default function CapacityIndicator({
  capacity = 0,
  registered = 0,
  registrationClosed = false,
}: CapacityIndicatorProps) {
  if (registrationClosed) {
    return <div className="capacity-indicator closed">Registration closed</div>
  }

  const remaining = capacity - registered
  return (
    <div className={`capacity-indicator ${remaining <= 0 ? 'full' : ''}`}>
      {remaining <= 0 ? 'Full' : remaining === 1 ? `${remaining} seat remaining` : `${remaining} seats remaining`}
    </div>
  )
}
