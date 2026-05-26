import Header from "../components/Header"
import Footer from "../components/Footer"
import EventCard from "../components/EventCard"
import EventDetails from "../components/EventDetails"
import EventSignupForm from "../components/EventSignupForm"
import { findMockEvent } from "../api/_mockData"

export default function PreviewPage() {
  const sampleEvent = findMockEvent('evt-001') ?? {
    id: 'evt-001',
    title: 'Preview: Evening with TCF',
    date: '2026-06-14T19:00:00.000Z',
    location: 'Online — Zoom',
    capacity: 30,
    registered: 8,
    active: true,
    isFull: false,
    description: 'This is a preview of the event details layout and signup form.'
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-10">
        <div className="page-hero">
          <div className="eyebrow">Preview</div>
          <h1 className="text-3xl font-bold page-title">UI Preview</h1>
          <p className="helper-text max-w-2xl">A quick layout check for event cards, event details, and the signup form using the TCF palette.</p>
        </div>

        <section className="mb-8 section-panel">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary-blue)' }}>Event Card</h2>
          <div className="max-w-sm">
            <EventCard event={sampleEvent} />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="section-panel">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary-blue)' }}>Event Details</h2>
            <EventDetails event={sampleEvent} />
          </div>

          <div className="section-panel">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary-blue)' }}>Signup Form</h2>
            <EventSignupForm eventId={sampleEvent.id} prefillData={{ name: 'Jane Doe', email: 'jane@example.com' }} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
