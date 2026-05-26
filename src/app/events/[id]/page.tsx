import EventDetails from "../../components/EventDetails"
import EventSignupForm from "../../components/EventSignupForm"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { listMockEvents } from "../../api/_mockData"
import Link from "next/link"

type Params = { params: { id: string } }

export default async function EventPage({ params }: Params) {
  const resolvedParams = await Promise.resolve(params)
  const { id } = resolvedParams

  // Server-side lookup from shared mock data.
  // When switching to HubSpot later, replace this with a server-side fetch or database lookup.
  // For testing, we do NOT filter the event out here; instead we show badges/messages on the page.
  const event = listMockEvents().find((e) => e.id === id) ?? null

  // If event not found, show a simple fallback. Could call `notFound()` in Next.js.
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
        <Header />
        <main className="container mx-auto px-6 py-10">
          <h1 className="text-2xl font-semibold mb-4">Event not found</h1>
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
            className="inline-flex items-center rounded border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-100"
          >
            ← Back to events
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <EventDetails event={event} />
            <div className="mt-4 rounded-md border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
              {!event.active && <p>This event is currently hidden in the mock data.</p>}
              {new Date(event.date).getTime() <= Date.now() && <p>This event has already passed in the mock data.</p>}
              {event.registered >= event.capacity && <p>This event is full.</p>}
            </div>
          </div>

          <aside className="md:col-span-1">
            <div className="sticky top-20">
              <h2 className="text-lg font-medium mb-4">Sign up</h2>
              <EventSignupForm eventId={event.id} prefillData={null} />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
