import Link from 'next/link'
import EventCard from './EventCard'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import type { ListedEvent } from '@/lib/programs/fetch'
import type { TrainingProgram } from '@/lib/programs/config'

type ProgramListingProps = {
  program: TrainingProgram
  events: ListedEvent[]
  error?: Error | null
}

export default function ProgramListing({ program, events, error }: ProgramListingProps) {
  const mainSiteUrl = 'https://www.trustedcarefoundation.org/youth-mental-health-program'

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-10">
        {mainSiteUrl ? (
          <div className="mb-6">
            <a href={mainSiteUrl} className="back-link">
              ← Back to main site
            </a>
          </div>
        ) : null}

        <h1 className="text-2xl font-semibold mb-6">{program.listingTitle}</h1>

        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
          {program.listingIntro.map((paragraph) => (
            <p key={paragraph} className="text-slate-900">
              {paragraph}
            </p>
          ))}
        </div>

        {error && (
          <p className="mb-6 text-yellow-700">
            Error loading events. Please try again later.
          </p>
        )}

        {events.length === 0 && !error && (
          <p className="text-slate-700">No upcoming sessions are available right now.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} program={program.slug} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
