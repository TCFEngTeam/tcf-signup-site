import { describe, expect, it, vi, beforeEach } from 'vitest'

const { getContactByEmail, associateContactToOpportunity } = vi.hoisted(() => ({
  getContactByEmail: vi.fn(),
  associateContactToOpportunity: vi.fn(),
}))

vi.mock('@/lib/hubspot/api', async () => {
  const actual = await vi.importActual<typeof import('@/lib/hubspot/api')>('@/lib/hubspot/api')
  return {
    ...actual,
    getContactByEmail,
    associateContactToOpportunity,
  }
})

import { OPTIONS, POST } from './route'

const ALLOWED_ORIGIN = 'https://www-trustedcarefoundation-org.sandbox.hs-sites.com'

function postSave(body: unknown) {
  return POST(
    new Request('http://localhost/api/opportunities/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: ALLOWED_ORIGIN,
      },
      body: JSON.stringify(body),
    })
  )
}

describe('POST /api/opportunities/save', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getContactByEmail.mockResolvedValue({ id: 'contact-1' })
    associateContactToOpportunity.mockResolvedValue(undefined)
  })

  it('returns 400 when opportunityId is missing', async () => {
    const res = await postSave({ email: 'jane.doe@example.edu' })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing opportunityId' })
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
  })

  it('returns 400 when contact identifier is missing', async () => {
    const res = await postSave({ opportunityId: 'deal-123' })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing contactId or email' })
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
  })

  it('returns 404 when the contact is not found by email', async () => {
    getContactByEmail.mockResolvedValue(null)
    const res = await postSave({ email: 'jane.doe@example.edu', opportunityId: 'deal-123' })
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'Contact not found' })
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
  })

  it('responds to OPTIONS preflight with CORS headers', async () => {
    const res = OPTIONS(
      new Request('http://localhost/api/opportunities/save', {
        method: 'OPTIONS',
        headers: { Origin: ALLOWED_ORIGIN },
      })
    )
    expect(res.status).toBe(204)
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
    expect(res.headers.get('access-control-allow-methods')).toBe('POST, OPTIONS')
    expect(res.headers.get('access-control-allow-credentials')).toBe('true')
  })

  it('associates the contact to the opportunity with the Saved label', async () => {
    const res = await postSave({ email: 'jane.doe@example.edu', opportunityId: 'deal-123' })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
    expect(associateContactToOpportunity).toHaveBeenCalledWith('contact-1', 'deal-123')
  })
})
