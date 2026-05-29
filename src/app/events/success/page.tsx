import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { formatTrainingSchedule } from '@/lib/formatTrainingSchedule'
import { loadProgramEventById } from '@/lib/programEvents'
import { getTrainingProgram, isTrainingProgramId } from '@/lib/trainingPrograms'

export const metadata: Metadata = {
  title: 'Signup Confirmed',
  description: 'Your training signup has been submitted successfully.',
}

type SignupSuccessPageProps = {
  searchParams: Promise<{ program?: string; event?: string }>
}

export default async function SignupSuccessPage({ searchParams }: SignupSuccessPageProps) {
  const { program: programParam, event: eventId } = await searchParams
  const program =
    programParam && isTrainingProgramId(programParam)
      ? getTrainingProgram(programParam)
      : null

  let eventTitle: string | null = null
  let eventSchedule: string | null = null

  if (program && eventId) {
    const { event } = await loadProgramEventById(program.id, eventId)
    if (event) {
      eventTitle = event.title
      eventSchedule = formatTrainingSchedule(event.startDate, event.endDate)
    }
  }

  const nextSteps =
    program?.successNextSteps ?? [
      'Check your email for confirmation and session details.',
    ]

  const backHref = program ? `/${program.slug}` : '/'
  const backLabel = program
    ? `Back to ${program.shortLabel} events`
    : 'Back to programs'

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
              <div className="eyebrow">Signup complete</div>
              <h1 className="text-3xl font-bold page-title">You&apos;re signed up!</h1>
              {eventTitle ? (
                <>
                  <p className="helper-text max-w-md mx-auto font-medium" style={{ color: 'var(--dark-green)' }}>
                    {eventTitle}
                  </p>
                  {eventSchedule && (
                    <p className="helper-text max-w-md mx-auto">{eventSchedule}</p>
                  )}
                </>
              ) : null}
              <p className="helper-text max-w-md mx-auto">
                Thank you for registering. Your submission has been received and we&apos;ll be in touch with next steps for your training session.
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
                What happens next
              </p>
              <ul className="space-y-2 helper-text list-disc list-inside">
                {nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={backHref} className="btn-primary inline-flex justify-center">
                {backLabel}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
