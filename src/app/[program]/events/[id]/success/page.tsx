import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import TrainingScheduleText from '@/components/events/TrainingScheduleText'
import { formatContent, pagesContent } from '@/lib/content'
import { loadProgramEventById } from '@/lib/programs/events'
import { getTrainingProgram } from '@/lib/programs/config'

const success = pagesContent.success

type ProgramEventSuccessPageProps = {
  params: Promise<{ program: string; id: string }>
  searchParams: Promise<{ waitlist?: string }>
}

export async function generateMetadata({
  searchParams,
}: Pick<ProgramEventSuccessPageProps, 'searchParams'>): Promise<Metadata> {
  const { waitlist } = await searchParams
  const isWaitlist = waitlist === '1'

  return {
    title: isWaitlist ? success.waitlistMetadataTitle : success.metadataTitle,
    description: isWaitlist ? success.waitlistMetadataDescription : success.metadataDescription,
  }
}

export default async function ProgramEventSuccessPage({
  params,
  searchParams,
}: ProgramEventSuccessPageProps) {
  const { program: programSlug, id: eventId } = await params
  const { waitlist } = await searchParams
  const isWaitlist = waitlist === '1'
  const program = getTrainingProgram(programSlug)

  if (!program) {
    notFound()
  }

  const { event } = await loadProgramEventById(program.id, eventId)

  if (!event) {
    notFound()
  }

  const programLabel = program.shortLabel
  const backHref = `/${program.slug}`
  const eventHref = `/${program.slug}/events/${eventId}`

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-10 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="section-panel text-center">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: 'var(--surface-green)' }}
              aria-hidden
            >
              <svg
                className="h-8 w-8"
                style={{ color: 'var(--accessible-green)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="page-hero items-center">
              <div className="eyebrow">
                {isWaitlist ? success.waitlistEyebrow : success.eyebrow}
              </div>
              <h1 className="text-3xl font-bold page-title">
                {isWaitlist ? success.waitlistHeading : success.heading}
              </h1>
              <p className="helper-text max-w-md mx-auto font-medium" style={{ color: 'var(--dark-green)' }}>
                {event.title}
              </p>
              <div className="max-w-md mx-auto">
                <TrainingScheduleText schedule={event.schedule} className="helper-text" />
              </div>
              <p className="helper-text max-w-md mx-auto">
                {isWaitlist ? success.waitlistThankYou : success.thankYou}
              </p>
            </div>

            <div
              className="mx-auto mt-6 max-w-md rounded-2xl p-5 text-left text-sm"
              style={{
                background: 'var(--surface-blue)',
                border: '1px solid rgba(44, 96, 164, 0.12)',
              }}
            >
              <p className="font-semibold mb-2" style={{ color: 'var(--dark-green)' }}>
                {isWaitlist ? success.waitlistNextStepsHeading : success.nextStepsHeading}
              </p>
              <ul className="space-y-2 helper-text list-disc list-inside">
                {program.successNextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={backHref} className="btn-primary inline-flex justify-center">
                {formatContent(success.backToEvents, { program: programLabel })}
              </Link>
              <Link href={eventHref} className="text-sm font-semibold text-blue-800 underline">
                {success.viewEventDetails}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
