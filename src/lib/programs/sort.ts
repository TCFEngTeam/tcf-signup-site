export type EventWithStartDate = {
  startDate?: string
}

/** Soonest start date first; events without valid dates appear last. */
export function sortEventsSoonestFirst<T extends EventWithStartDate>(events: T[]): T[] {
  return [...events].sort((a, b) => {
    const aTime = parseEventTimeAsc(a.startDate)
    const bTime = parseEventTimeAsc(b.startDate)
    return aTime - bTime
  })
}

/** Soonest start date first (top-left in the listing grid). */
export function sortEventsForListing<T extends EventWithStartDate>(events: T[]): T[] {
  return sortEventsSoonestFirst(events)
}

function parseEventTimeAsc(startDate?: string) {
  if (!startDate) return Number.POSITIVE_INFINITY
  const time = new Date(startDate).getTime()
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time
}
