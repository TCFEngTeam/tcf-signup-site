import EventCard from "./components/EventCard"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default async function Home() {
  // Server-side fetch of events from the mocked API route. In production this keeps secrets
  // server-side and allows server filtering/mapping of HubSpot data.
  let events: any[] = []
  let loading = false
  let error: any = null

  try {
    const res = await fetch('/api/events')
    if (res.ok) events = await res.json()
    else error = new Error(`API returned ${res.status}`)
  } catch (err) {
    error = err
  }

  const sample = [
    {
      id: "sample-1",
      title: "Sample Event",
      date: "June 1, 2026",
      location: "Online",
      capacity: 20,
      registered: 3,
      isFull: false,
    },
  ]

  const list = events && events.length ? events : sample

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-6">Upcoming Events</h1>

        {loading && <p>Loading events…</p>}
        {error && <p className="text-red-600">Error loading events</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {list.map((ev: any) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
