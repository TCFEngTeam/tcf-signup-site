import { describe, expect, it, vi, beforeEach } from 'vitest'

const { updateProfile } = vi.hoisted(() => ({
  updateProfile: vi.fn(),
}))

vi.mock('@/lib/hubspot/api', async () => {
  const actual = await vi.importActual<typeof import('@/lib/hubspot/api')>('@/lib/hubspot/api')
  return {
    ...actual,
    updateProfile,
  }
})

import { OPTIONS, POST } from './route'

const ALLOWED_ORIGIN = 'https://www-trustedcarefoundation-org.sandbox.hs-sites.com'

function postUpdate(body: unknown) {
  return POST(
    new Request('http://localhost/api/student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: ALLOWED_ORIGIN,
      },
      body: JSON.stringify(body),
    })
  )
}

describe('POST /api/student', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    updateProfile.mockResolvedValue({ id: 'contact-1', properties: {} })
  })

  it('returns 400 when contactId is missing', async () => {
    const res = await postUpdate({ properties: { phone: '123-456-7890' } })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing contactId' })
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
  })

  it('returns 400 when properties are missing', async () => {
    const res = await postUpdate({ contactId: 'contact-1' })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing or invalid properties' })
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
  })

  it('returns 404 when the contact is not found', async () => {
    updateProfile.mockRejectedValueOnce(new Error('Contact not found'))
    const res = await postUpdate({
      contactId: 'contact-1',
      properties: { phone: '123-456-7890' },
    })
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'Contact not found' })
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
  })

  it('responds to OPTIONS preflight with CORS headers', () => {
    const res = OPTIONS(
      new Request('http://localhost/api/student', {
        method: 'OPTIONS',
        headers: { Origin: ALLOWED_ORIGIN },
      })
    )

    expect(res.status).toBe(204)
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
    expect(res.headers.get('access-control-allow-methods')).toBe('POST, OPTIONS')
  })

  it('returns 400 when an unsupported property is provided', async () => {
    const res = await postUpdate({
      contactId: 'contact-1',
      properties: { phone: '123-456-7890', favorite_color: 'blue' },
    })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing or invalid properties' })
  })

  it('updates the contact by contactId', async () => {
    const res = await postUpdate({ contactId: 'contact-1', properties: { phone: '123-456-7890' } })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(res.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
    expect(updateProfile).toHaveBeenCalledWith('contact-1', { phone: '123-456-7890' })
  })
})
