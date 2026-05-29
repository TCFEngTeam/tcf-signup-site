export type EventWithStartDate = {
  startDate?: string
}

/** Furthest future date first (top-left in the listing grid). */
export function sortEventsForListing<T extends EventWithStartDate>(events: T[]): T[] {
  return [...events].sort((a, b) => {
    const aTime = parseEventTime(a.startDate)
    const bTime = parseEventTime(b.startDate)
    return bTime - aTime
  })
}

function parseEventTime(startDate?: string) {
  if (!startDate) return Number.NEGATIVE_INFINITY
  const time = new Date(startDate).getTime()
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time
}
