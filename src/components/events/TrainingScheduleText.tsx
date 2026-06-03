import React from 'react'
import {
  formatTrainingScheduleLines,
  type TrainingSchedule,
} from '@/lib/dates/format-schedule'

type TrainingScheduleTextProps = {
  schedule?: TrainingSchedule
  className?: string
}

export default function TrainingScheduleText({ schedule, className }: TrainingScheduleTextProps) {
  const lines = formatTrainingScheduleLines(schedule ?? {})

  return (
    <>
      {lines.map((line, index) => (
        <p key={`${line}-${index}`} className={className}>
          {line}
        </p>
      ))}
    </>
  )
}
