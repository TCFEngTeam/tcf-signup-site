import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getApplicantsForOpportunities } from './api'

const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)

describe('getApplicantsForOpportunities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.HUBSPOT_API_KEY = 'test-key'
  })

  it('returns the matching association label id for each applicant', async () => {
    fetchMock
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            results: [
              {
                from: { id: 'opp-1' },
                to: [
                  {
                    toObjectId: 'contact-1',
                    associationTypes: [{ typeId: 22 }],
                  },
                ],
              },
            ],
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: 'contact-1',
            properties: {
              firstname: 'Ada',
              lastname: 'Lovelace',
              email: 'ada@example.com',
            },
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      )

    const results = await getApplicantsForOpportunities(['opp-1'])

    expect(results).toEqual([
      {
        opportunityId: 'opp-1',
        contacts: [
          {
            id: 'contact-1',
            properties: {
              firstname: 'Ada',
              lastname: 'Lovelace',
              email: 'ada@example.com',
            },
            associationLabelId: '22',
            associationTypeId: '22',
          },
        ],
      },
    ])
  })
})
