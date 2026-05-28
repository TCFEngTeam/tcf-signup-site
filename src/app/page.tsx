import EventCard from "./components/EventCard"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { headers } from "next/headers"

export default async function Home() {
  // Server-side fetch of events from the mocked API route. In production this keeps secrets
  // server-side and allows server filtering/mapping of HubSpot data.
  let events: any[] = []
  let loading = false
  let error: any = null

  try {
    // Get the host from the request headers, then construct the full URL.
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const url = `${protocol}://${host}/api/events`
    const res = await fetch(url, { next: { revalidate: 60 } })
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
      startDate: "2026-06-01T18:00:00.000Z",
      endDate: "2026-06-01T18:00:00.000Z",
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

  // Sort events by date, latest first
  list.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-6">Mental Health Training Sign Up</h1>

        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="mb-3 text-slate-900">This FREE 8-hour course teaches individuals how to recognize signs of mental health or substance use challenges, how to offer and provide initial help, and how to guide a person toward appropriate care. Please complete this form if you are interested in the mental health first-aid training session.</p>
          <p className="mb-3 text-slate-900">Be mindful that this training will require 2 hours of pre-work and 6 hours of a virtual instructor-led training.</p>
          <p className="mb-3 text-slate-900">Attendance of the full session is mandatory for certification. Certification lasts for 3 years.</p>
          <p className="text-slate-900 font-medium">Complete the training and receive a $100 gift card (as funding allows)!</p>
        </div>

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
