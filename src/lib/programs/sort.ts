export type EventWithSortDate = {
  sortDate?: string
}

/** Soonest start date first; events without valid dates appear last. */
export function sortEventsSoonestFirst<T extends EventWithSortDate>(events: T[]): T[] {
  return [...events].sort((a, b) => {
    const aTime = parseEventTimeAsc(a.sortDate)
    const bTime = parseEventTimeAsc(b.sortDate)
    return aTime - bTime
  })
}

/** Soonest start date first (top-left in the listing grid). */
export function sortEventsForListing<T extends EventWithSortDate>(events: T[]): T[] {
  return sortEventsSoonestFirst(events)
}

function parseEventTimeAsc(sortDate?: string) {
  if (!sortDate) return Number.POSITIVE_INFINITY
  const time = new Date(sortDate).getTime()
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time
}
