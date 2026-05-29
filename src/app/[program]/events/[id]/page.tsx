import Link from 'next/link'
import { notFound } from 'next/navigation'
import EventDetails from '@/components/events/EventDetails'
import EventSignupForm from '@/components/signup/EventSignupForm'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { loadProgramEventById } from '@/lib/programs/events'
import { getTrainingProgram } from '@/lib/programs/config'

type ProgramEventPageProps = {
  params: Promise<{ program: string; id: string }>
}

export default async function ProgramEventPage({ params }: ProgramEventPageProps) {
  const { program: programSlug, id } = await params
  const program = getTrainingProgram(programSlug)

  if (!program) {
    notFound()
  }

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
            <div className="eyebrow">Event lookup</div>
            <h1 className="text-3xl font-bold page-title">Event not found</h1>
          </div>
          <p>We couldn&apos;t find that event.</p>
          <p className="mt-4 text-sm text-zinc-600">
            Try{' '}
            <Link className="underline" href={`/${program.slug}`}>
              returning to the {program.shortLabel} event list
            </Link>{' '}
            and opening a known event.
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-10">
        <div className="mb-6">
          <Link href={`/${program.slug}`} className="back-link">
            ← Back to {program.shortLabel} events
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <EventDetails event={event} />

          <div className="notice-card text-sm text-zinc-700">
            {!event.active && <p>This event is currently unavailable.</p>}
            {event.isFull && <p>This event is full.</p>}

            <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
              {program.signupNotice.map((paragraph) => (
                <p key={paragraph} className="text-slate-900">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {!event.isFull && event.active ? (
            <section className="section-panel">
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary-blue)' }}>
                Sign up
              </h2>
              <div className="w-full">
                <EventSignupForm eventId={event.id} programId={program.id} />
              </div>
            </section>
          ) : (
            <p className="text-sm text-zinc-600">
              Registration is closed for this session.{' '}
              <Link className="underline" href={`/${program.slug}`}>
                Browse other {program.shortLabel} events
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
