import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'
import {
  associateContactToOpportunity,
  disassociateContactFromOpportunity,
} from '@/lib/hubspot/api'

vi.mock('@/lib/hubspot/api', () => ({
  associateContactToOpportunity: vi.fn(),
  disassociateContactFromOpportunity: vi.fn(),
}))

describe('applications update-status route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each([
    ['offer', 5],
    ['pass', 45],
    ['withdraw', 9],
    ['decline', 9],
    ['accept', 5],
  ])('maps %s to HubSpot status id %s', async (status, expectedStatusId) => {
    const req = new Request('http://localhost/api/applications/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactId: 'contact-123',
        opportunityId: 'opportunity-456',
        status,
      }),
    })

    const response = await POST(req)

    expect(response.status).toBe(200)
    expect(associateContactToOpportunity).toHaveBeenCalledWith(
      'contact-123',
      'opportunity-456',
      'USER_DEFINED',
      expectedStatusId
    )
    expect(disassociateContactFromOpportunity).toHaveBeenCalled()
  })
})
