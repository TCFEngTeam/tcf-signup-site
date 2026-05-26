import { useEffect, useState } from 'react'
import { listEvents } from '@/lib/hubspotClient'

export function useEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await listEvents()
        if (mounted) setEvents(data)
      } catch (err: any) {
        setError(err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return { events, loading, error }
}
