import EventCard from './EventCard'
import { pagesContent } from '@/lib/content'
import type { ListedEvent } from '@/lib/programs/fetch'
import type { TrainingProgram } from '@/lib/programs/config'

type ProgramListingEmbedProps = {
  program: TrainingProgram
  events: ListedEvent[]
  error?: Error | null
}

export default function ProgramListingEmbed({
  program,
  events,
  error,
}: ProgramListingEmbedProps) {
  return (
    <div className="embed-listing">
      {error ? (
        <p className="embed-listing-message">{pagesContent.listing.loadError}</p>
      ) : null}

      {!error && events.length === 0 ? (
        <p className="embed-listing-message">{pagesContent.listing.noSessions}</p>
      ) : null}

      <div className="embed-listing-grid">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            program={program.slug}
            openSignupInNewTab
          />
        ))}
      </div>
    </div>
  )
}
