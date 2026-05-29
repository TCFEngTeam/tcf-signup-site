function formatDateLabel(value?: string) {
  if (!value) return ''

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parsed)
}

export function formatTrainingSchedule(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return 'Date to be announced'

  if (startDate && endDate) {
    const formattedStart = formatDateLabel(startDate)
    const formattedEnd = formatDateLabel(endDate)

    if (formattedStart && formattedStart === formattedEnd) {
      return formattedStart
    }

    if (formattedStart && formattedEnd) {
      return `${formattedStart} – ${formattedEnd}`
    }

    if (startDate === endDate) {
      return formatDateLabel(startDate)
    }

    return `${formatDateLabel(startDate) || startDate} – ${formatDateLabel(endDate) || endDate}`
  }

  return formatDateLabel(startDate || endDate) || startDate || endDate || 'Date to be announced'
}
