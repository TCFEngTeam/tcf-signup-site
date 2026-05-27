import EventDetails from "../../components/EventDetails"
import EventSignupForm from "../../components/EventSignupForm"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { getTrainingObjects, mapTrainingToEvent, type TrainingEvent } from "@/lib/hubspotApi"
import Link from "next/link"

type Params = { params: { id: string } }

export default async function EventPage({ params }: Params) {
  const resolvedParams = await Promise.resolve(params)
  const { id } = resolvedParams

  // Server-side fetch from HubSpot
  let event: TrainingEvent | null = null
  try {
    const pipelineStage = process.env.HUBSPOT_TRAINING_PIPELINE_STAGE
    const trainings = await getTrainingObjects(pipelineStage)
    const training = trainings.find((t) => t.id === id)
    if (training) {
      event = mapTrainingToEvent(training)
    }
  } catch (error) {
    console.error('Error fetching training event:', error)
  }

  // If event not found, show a simple fallback. Could call `notFound()` in Next.js.
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
        <Header />
        <main className="container mx-auto px-6 py-10">
          <div className="page-hero">
            <div className="eyebrow">Event lookup</div>
            <h1 className="text-3xl font-bold page-title">Event not found</h1>
          </div>
          <p>We couldn't find that event.</p>
          <p className="mt-4 text-sm text-zinc-600">
            Try <a className="underline" href="/">returning to the event list</a> and opening a known event.
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
          <Link
            href="/"
            className="back-link"
          >
            ← Back to events
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <EventDetails event={event} />
            <div className="notice-card mt-4 text-sm text-zinc-700">
              {!event.active && <p>This event is currently hidden in the mock data.</p>}
              {new Date(event.date).getTime() <= Date.now() && <p>This event has already passed in the mock data.</p>}
              {event.registered >= event.capacity && <p>This event is full.</p>}
            </div>
          </div>

          <aside className="md:col-span-1">
            <div className="sticky top-20">
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary-blue)' }}>Sign up</h2>
              <EventSignupForm eventId={event.id} prefillData={null} />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
