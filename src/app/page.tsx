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
    // Server runtime cannot parse relative URLs with the global fetch in Node.
    // Build an absolute URL using VERCEL_URL if present, otherwise localhost.
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT || 3000}`
    const url = new URL('/api/events', base).toString()
    const res = await fetch(url)
    if (res.ok) {
      events = await res.json()
    } else {
      try {
        const body = await res.json()
        console.error('Events API returned non-OK response', res.status, body)
      } catch (e) {
        console.error('Events API returned non-OK response', res.status)
      }
    }
  } catch (err) {
    console.error('Failed to fetch /api/events', err)
    error = err
  }

  const sample = [
    {
      id: "evt-001",
      title: "Introduction to TCF",
      date: "2026-06-01T18:00:00.000Z",
      location: "Online",
      capacity: 20,
      registered: 3,
      active: true,
      isFull: false,
    },
  ]

  // Use real events from the API when available. Only use the sample
  // fallback when there was an error fetching the API.
  const list = error ? sample : events

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-6">Upcoming Events</h1>

        {loading && <p>Loading events…</p>}
        {error && <p className="text-yellow-700">Error loading events; showing fallback list</p>}

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
