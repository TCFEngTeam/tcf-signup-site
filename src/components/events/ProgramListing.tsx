import Link from 'next/link'
import ProgramContentBlocks from '@/components/content/ProgramContentBlocks'
import EventCard from './EventCard'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { pagesContent, siteContent } from '@/lib/content'
import type { ListedEvent } from '@/lib/programs/fetch'
import type { TrainingProgram } from '@/lib/programs/config'

type ProgramListingProps = {
  program: TrainingProgram
  events: ListedEvent[]
  error?: Error | null
}

export default function ProgramListing({ program, events, error }: ProgramListingProps) {
  const mainSiteUrl = siteContent.mainSiteUrl

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-10">
        {mainSiteUrl ? (
          <div className="mb-6">
            <a href={mainSiteUrl} className="back-link">
              {pagesContent.listing.backToMainSite}
            </a>
          </div>
        ) : null}

        <h1 className="text-2xl font-semibold mb-6">{program.listingTitle}</h1>

        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <ProgramContentBlocks blocks={program.listingIntro} />
        </div>

        {error && (
          <p className="mb-6 text-yellow-700">{pagesContent.listing.loadError}</p>
        )}

        {events.length === 0 && !error && (
          <p className="text-slate-700">{pagesContent.listing.noSessions}</p>
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
