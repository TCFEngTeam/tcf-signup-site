import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OPTIONS, POST } from './route'
import { getContactsForOpportunities } from '@/lib/hubspot/api'

vi.mock('@/lib/hubspot/api', () => ({
  getContactsForOpportunities: vi.fn(),
}))

describe('employer applicants route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('responds to preflight requests with CORS headers', async () => {
    const req = new Request('http://localhost/api/employer/applicants', {
      method: 'OPTIONS',
      headers: { origin: 'https://www.trustedcarefoundation.org' },
    })

    const response = await OPTIONS(req)

    expect(response.status).toBe(204)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://www.trustedcarefoundation.org')
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST')
  })

  it('parses stringified opportunity IDs from the request body', async () => {
    vi.mocked(getContactsForOpportunities).mockResolvedValueOnce([
      {
        opportunityId: 'opp-1',
        contacts: [
          {
            id: 'contact-1',
            properties: { firstname: 'Ada', lastname: 'Lovelace', email: 'ada@example.com' },
          },
        ],
      },
    ])

    const req = new Request('http://localhost/api/employer/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityIds: JSON.stringify(['opp-1']) }),
    })

    const response = await POST(req)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(getContactsForOpportunities).toHaveBeenCalledWith(['opp-1'])
    expect(body.results).toEqual([
      {
        opportunityId: 'opp-1',
        contacts: [
          {
            id: 'contact-1',
            properties: { firstname: 'Ada', lastname: 'Lovelace', email: 'ada@example.com' },
          },
        ],
      },
    ])
  })

  it('returns contacts for each opportunity when their associations match the requested labels', async () => {
    vi.mocked(getContactsForOpportunities).mockResolvedValueOnce([
      {
        opportunityId: 'opp-1',
        contacts: [
          {
            id: 'contact-1',
            properties: { firstname: 'Ada', lastname: 'Lovelace', email: 'ada@example.com' },
          },
        ],
      },
      {
        opportunityId: 'opp-2',
        contacts: [
          {
            id: 'contact-3',
            properties: { firstname: 'Grace', lastname: 'Hopper', email: 'grace@example.com' },
          },
          {
            id: 'contact-4',
            properties: { firstname: 'Katherine', lastname: 'Johnson', email: 'katherine@example.com' },
          },
        ],
      },
    ])

    const req = new Request('http://localhost/api/employer/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(['opp-1', 'opp-2']),
    })

    const response = await POST(req)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(getContactsForOpportunities).toHaveBeenCalledWith(['opp-1', 'opp-2'])
    expect(body.results).toEqual([
      {
        opportunityId: 'opp-1',
        contacts: [
          {
            id: 'contact-1',
            properties: { firstname: 'Ada', lastname: 'Lovelace', email: 'ada@example.com' },
          },
        ],
      },
      {
        opportunityId: 'opp-2',
        contacts: [
          {
            id: 'contact-3',
            properties: { firstname: 'Grace', lastname: 'Hopper', email: 'grace@example.com' },
          },
          {
            id: 'contact-4',
            properties: { firstname: 'Katherine', lastname: 'Johnson', email: 'katherine@example.com' },
          },
        ],
      },
    ])
  })
})
