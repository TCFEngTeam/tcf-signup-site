import Header from "../components/Header"
import Footer from "../components/Footer"
import EventCard from "../components/EventCard"
import EventDetails from "../components/EventDetails"
import EventSignupForm from "../components/EventSignupForm"
import { findMockEvent, listMockEvents, MOCK_EVENTS } from "../api/_mockData"

export default function PreviewPage() {
  // Ensure preview-only example events exist in the in-memory mock store
  if (!MOCK_EVENTS.some((e) => e.id === 'preview-large')) {
    const base = listMockEvents()[0]
    if (base) {
      MOCK_EVENTS.push({
        ...base,
        id: 'preview-large',
        title: `${base.title} (Large Population)`,
        capacity: 1000,
        registered: 850,
        active: true,
      })
    }
  }

  if (!MOCK_EVENTS.some((e) => e.id === 'preview-full')) {
    const base = listMockEvents()[0]
    if (base) {
      MOCK_EVENTS.push({
        ...base,
        id: 'preview-full',
        title: `${base.title} (Full)`,
        capacity: 20,
        registered: 20,
        active: true,
      })
    }
  }

  const normal = findMockEvent('evt-001')
  const large = findMockEvent('preview-large')
  const full = findMockEvent('preview-full')

  const examples = [normal, large, full].filter(Boolean)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-10">
        <div className="page-hero">
          <div className="eyebrow">Preview</div>
          <h1 className="text-3xl font-bold page-title">UI Preview</h1>
          <p className="helper-text max-w-2xl">A quick layout check for event cards, event details, and the signup form using the TCF palette. These preview events submit to a local mock endpoint and will not call HubSpot.</p>
        </div>

        <div className="grid gap-8">
          {examples.map((evt) => (
            <section key={evt!.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 section-panel">
              <div>
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary-blue)' }}>{evt!.title}</h2>
                <EventCard event={{ ...evt, isFull: evt!.registered >= evt!.capacity }} />
                <div className="mt-4">
                  <EventDetails event={{ ...evt, isFull: evt!.registered >= evt!.capacity }} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary-blue)' }}>Signup Form (mock)</h3>
                <EventSignupForm
                  eventId={evt!.id}
                  submitUrl={'/api/mock-signup'}
                  prefillData={{
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'jane+preview@example.com',
                    phone: '555-1212',
                    hometownCity: 'Richmond',
                    hometownState: 'VA',
                    universityWebsite: 'example.edu',
                    currentYear: 'junior',
                    isVirginiaResident: 'yes',
                    trainingDates: 'available',
                    interestReason: 'I want to learn',
                    communitySupport: 'Share with peers',
                    interestedInTeaching: 'maybe',
                    smsMarketing: false,
                    smsConsent: false,
                  }}
                />
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
