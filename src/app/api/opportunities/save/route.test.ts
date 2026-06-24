import { describe, expect, it, vi, beforeEach } from 'vitest'

const { associateContactToOpportunity, disassociateContactFromOpportunity } = vi.hoisted(() => ({
  associateContactToOpportunity: vi.fn(),
  disassociateContactFromOpportunity: vi.fn(),
}))

vi.mock('@/lib/hubspot/api', async () => {
  const actual = await vi.importActual<typeof import('@/lib/hubspot/api')>('@/lib/hubspot/api')
  return {
    ...actual,
    associateContactToOpportunity,
    disassociateContactFromOpportunity,
  }
})

import { DELETE, OPTIONS, POST } from './route'

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

function deleteSave(body: unknown) {
  return DELETE(
    new Request('http://localhost/api/opportunities/save', {
      method: 'DELETE',
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
    associateContactToOpportunity.mockResolvedValue(undefined)
    disassociateContactFromOpportunity.mockResolvedValue(undefined)
  })

  it('returns 400 when contactId is missing', async () => {
    const res = await postSave({ opportunityId: 'deal-123' })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing contactId' })
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
  })

  it('returns 400 when opportunityId is missing', async () => {
    const res = await postSave({ contactId: 'contact-1' })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing opportunityId' })
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
    expect(res.headers.get('access-control-allow-methods')).toBe('POST, DELETE, OPTIONS')
    expect(res.headers.get('access-control-allow-credentials')).toBe('true')
  })

  it('associates the contact to the opportunity with the Saved label', async () => {
    const res = await postSave({ contactId: 'contact-1', opportunityId: 'deal-123' })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
    expect(associateContactToOpportunity).toHaveBeenCalledWith('contact-1', 'deal-123')
  })

  it('disassociates the contact from the opportunity', async () => {
    const res = await deleteSave({ contactId: 'contact-1', opportunityId: 'deal-123' })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(disassociateContactFromOpportunity).toHaveBeenCalledWith('contact-1', 'deal-123')
  })
})
