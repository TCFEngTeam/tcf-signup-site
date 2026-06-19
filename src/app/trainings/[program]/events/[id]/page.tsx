import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProgramContentBlocks from '@/components/content/ProgramContentBlocks'
import EventDetails from '@/components/events/EventDetails'

export const dynamic = 'force-dynamic'
import EventSignupForm from '@/components/signup/EventSignupForm'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { formatContent, pagesContent } from '@/lib/content'
import { canAcceptRegistration, canAcceptWaitlist, loadProgramEventById } from '@/lib/programs/events'
import { getTrainingProgram } from '@/lib/programs/config'
import { trainingsProgramPath } from '@/lib/routes'

const detail = pagesContent.eventDetail

type ProgramEventPageProps = {
  params: Promise<{ program: string; id: string }>
}

export default async function ProgramEventPage({ params }: ProgramEventPageProps) {
  const { program: programSlug, id } = await params
  const program = getTrainingProgram(programSlug)

  if (!program) {
    notFound()
  }

  const programLabel = program.shortLabel
  const { event, error } = await loadProgramEventById(program.id, id)

  if (error) {
    console.error('Error fetching training event:', error)
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
        <Header />
        <main className="container mx-auto px-6 py-10">
          <div className="page-hero">
            <div className="eyebrow">{detail.eventNotFoundEyebrow}</div>
            <h1 className="text-3xl font-bold page-title">{detail.eventNotFoundTitle}</h1>
          </div>
          <p>{detail.eventNotFoundBody}</p>
          <p className="mt-4 text-sm text-zinc-600">
            {detail.eventNotFoundTry}{' '}
            <Link className="underline" href={trainingsProgramPath(program.slug)}>
              {formatContent(detail.eventNotFoundLink, { program: programLabel })}
            </Link>{' '}
            {detail.eventNotFoundAfterLink}
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  const waitlistMode = canAcceptWaitlist(event)
  const signupOpen = canAcceptRegistration(event) || waitlistMode

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-10">
        <div className="mb-6">
          <Link href={trainingsProgramPath(program.slug)} className="back-link">
            {formatContent(detail.backToEvents, { program: programLabel })}
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <EventDetails event={event} />

          <div className="notice-card text-sm text-zinc-700">
            {!event.active && <p>{detail.inactive}</p>}
            {event.registrationClosed && <p>{detail.registrationClosed}</p>}
            {waitlistMode && !event.registrationClosed && <p>{detail.waitlistNotice}</p>}

            <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <ProgramContentBlocks blocks={program.signupNotice} />
            </div>
          </div>

          {signupOpen ? (
            <section className="section-panel">
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary-blue)' }}>
                {waitlistMode ? detail.waitlistHeading : detail.signupHeading}
              </h2>
              <div className="w-full">
                <EventSignupForm
                  eventId={event.id}
                  programId={program.id}
                  waitlist={waitlistMode}
                />
              </div>
            </section>
          ) : (
            <p className="text-sm text-zinc-600">
              {detail.registrationClosed}{' '}
              <Link className="underline" href={trainingsProgramPath(program.slug)}>
                {formatContent(detail.browseOtherEvents, { program: programLabel })}
              </Link>
              .
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
