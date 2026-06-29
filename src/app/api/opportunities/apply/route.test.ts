import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getContactProperty, updateContactProperties, associateContactToOpportunity } = vi.hoisted(() => ({
  getContactProperty: vi.fn(),
  updateContactProperties: vi.fn(),
  associateContactToOpportunity: vi.fn(),
}))

vi.mock('@/lib/hubspot/api', async () => {
  const actual = await vi.importActual<typeof import('@/lib/hubspot/api')>('@/lib/hubspot/api')
  return {
    ...actual,
    getContactProperty,
    updateContactProperties,
    associateContactToOpportunity,
  }
})

import { OPTIONS, POST } from './route'

const ALLOWED_ORIGIN = 'https://www-trustedcarefoundation-org.sandbox.hs-sites.com'

function postApply(body: unknown) {
  return POST(
    new Request('http://localhost/api/opportunities/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: ALLOWED_ORIGIN,
      },
      body: JSON.stringify(body),
    })
  )
}

describe('POST /api/opportunities/apply', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getContactProperty.mockResolvedValue(null)
    updateContactProperties.mockResolvedValue({ id: 'contact-1', properties: {} })
    associateContactToOpportunity.mockResolvedValue(undefined)
  })

  it('returns 400 when contactId is missing', async () => {
    const res = await postApply({ opportunityId: 'deal-123' })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing contactId' })
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
  })

  it('returns 400 when opportunityId is missing', async () => {
    const res = await postApply({ contactId: 'contact-1' })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing opportunityId' })
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
  })

  it('responds to OPTIONS preflight with CORS headers', async () => {
    const res = OPTIONS(
      new Request('http://localhost/api/opportunities/apply', {
        method: 'OPTIONS',
        headers: { Origin: ALLOWED_ORIGIN },
      })
    )
    expect(res.status).toBe(204)
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
    expect(res.headers.get('access-control-allow-methods')).toBe('POST, OPTIONS')
    expect(res.headers.get('access-control-allow-credentials')).toBe('true')
  })

  it('reads the existing why property from nested payload properties', async () => {
    const res = await POST(
      new Request('http://localhost/api/opportunities/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: ALLOWED_ORIGIN,
        },
        body: JSON.stringify({
          contactId: 'contact-1',
          opportunityId: 'deal-123',
          properties: {
            firstname: 'Jane',
            why_are_you_interested_in_this_role_: 'I want to contribute to the mission.',
          },
        }),
      })
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(updateContactProperties).toHaveBeenCalledWith('contact-1', {
      firstname: 'Jane',
      why_are_you_interested_in_this_role_: JSON.stringify({
        'deal-123': 'I want to contribute to the mission.',
      }),
    })
  })

  it('updates contact properties and appends the opportunity answer to existing why property data', async () => {
    getContactProperty.mockResolvedValue('{"deal-456":"I volunteered before."}')

    const res = await postApply({
      contactId: 'contact-1',
      opportunityId: 'deal-123',
      firstname: 'Jane',
      lastname: 'Doe',
      phone: '555-1234',
      email: 'jane@example.com',
      hometown_city: 'Baltimore',
      hometown_state: 'MD',
      college_major: 'Computer Science',
      current_year_in_school: 'Senior',
      why_are_you_interested_in_this_role_: 'I want to contribute to the mission.',
      oldWhyValue: '{"deal-456":"I volunteered before."}',
    })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(updateContactProperties).toHaveBeenCalledWith('contact-1', {
      firstname: 'Jane',
      lastname: 'Doe',
      phone: '555-1234',
      email: 'jane@example.com',
      hometown_city: 'Baltimore',
      hometown_state: 'MD',
      college_major: 'Computer Science',
      current_year_in_school: 'Senior',
      why_are_you_interested_in_this_role_: JSON.stringify({
        'deal-456': 'I volunteered before.',
        'deal-123': 'I want to contribute to the mission.',
      }),
    })
    expect(associateContactToOpportunity).toHaveBeenCalledWith('contact-1', 'deal-123', 'USER_DEFINED', 19)
  })
})
