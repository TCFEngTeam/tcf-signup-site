'use client'

import { useEffect, useState } from 'react'
import {
  DEFAULT_SCHEDULE_TIME_ZONE,
  formatTrainingScheduleLines,
  type TrainingSchedule,
} from '@/lib/dates/format-schedule'

type TrainingScheduleTextProps = {
  schedule?: TrainingSchedule
  className?: string
}

function getBrowserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export default function TrainingScheduleText({ schedule, className }: TrainingScheduleTextProps) {
  const normalizedSchedule = schedule ?? {}
  const [lines, setLines] = useState(() =>
    formatTrainingScheduleLines(normalizedSchedule, { timeZone: DEFAULT_SCHEDULE_TIME_ZONE })
  )

  useEffect(() => {
    setLines(
      formatTrainingScheduleLines(normalizedSchedule, { timeZone: getBrowserTimeZone() })
    )
  }, [
    normalizedSchedule.session1Start,
    normalizedSchedule.session1End,
    normalizedSchedule.session2Start,
    normalizedSchedule.session2End,
  ])

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
