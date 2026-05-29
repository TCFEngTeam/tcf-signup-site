import { beforeEach, describe, expect, it, vi } from 'vitest'
import { signupRequestBody } from '@/test/fixtures/signup'

const {
  loadProgramEventById,
  getContactByEmail,
  isContactRegisteredForTraining,
  createOrUpdateContact,
  getOrCreateCompanyByWebsite,
  associateContactToCompany,
  associateContactToTraining,
} = vi.hoisted(() => ({
  loadProgramEventById: vi.fn(),
  getContactByEmail: vi.fn(),
  isContactRegisteredForTraining: vi.fn(),
  createOrUpdateContact: vi.fn(),
  getOrCreateCompanyByWebsite: vi.fn(),
  associateContactToCompany: vi.fn(),
  associateContactToTraining: vi.fn(),
}))

vi.mock('@/lib/programs/events', () => ({
  loadProgramEventById,
}))

vi.mock('@/lib/hubspot/api', async () => {
  const actual = await vi.importActual<typeof import('@/lib/hubspot/api')>('@/lib/hubspot/api')
  return {
    ...actual,
    getContactByEmail,
    isContactRegisteredForTraining,
    createOrUpdateContact,
    getOrCreateCompanyByWebsite,
    associateContactToCompany,
    associateContactToTraining,
  }
})

import { POST } from './route'

function postSignup(body: unknown) {
  return POST(
    new Request('http://localhost/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

describe('POST /api/signup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    loadProgramEventById.mockResolvedValue({
      event: {
        id: 'event-123',
        isFull: false,
        availableCapacity: 5,
      },
      error: null,
    })
    getContactByEmail.mockResolvedValue(null)
    isContactRegisteredForTraining.mockResolvedValue(false)
    createOrUpdateContact.mockResolvedValue({ id: 'contact-1' })
    getOrCreateCompanyByWebsite.mockResolvedValue({ id: 'company-1' })
    associateContactToCompany.mockResolvedValue(undefined)
    associateContactToTraining.mockResolvedValue(undefined)
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await postSignup({ eventId: 'event-123', program: 'mhfa', data: {} })
    expect(res.status).toBe(400)
  })

  it('returns 409 when the event is full', async () => {
    loadProgramEventById.mockResolvedValue({
      event: { id: 'event-123', isFull: true, availableCapacity: 0 },
      error: null,
    })

    const res = await postSignup(signupRequestBody())
    expect(res.status).toBe(409)
    expect(await res.json()).toMatchObject({ error: 'Training is full' })
  })

  it('returns 409 when the contact is already registered', async () => {
    getContactByEmail.mockResolvedValue({ id: 'contact-1' })
    isContactRegisteredForTraining.mockResolvedValue(true)

    const res = await postSignup(signupRequestBody())
    expect(res.status).toBe(409)
    expect(await res.json()).toMatchObject({
      error: expect.stringContaining('already registered'),
    })
    expect(createOrUpdateContact).not.toHaveBeenCalled()
  })

  it('returns success when HubSpot sync succeeds', async () => {
    const res = await postSignup(signupRequestBody())
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({
      success: true,
      hubspotContactId: 'contact-1',
    })
    expect(associateContactToTraining).toHaveBeenCalledWith('contact-1', 'event-123')
  })
})
