import { afterEach, describe, expect, it } from 'vitest'
import {
  contactHasRegistrantAssociation,
  contactHasTrainingAssociation,
  isDuplicateAssociationResponse,
  mapSmsConsentToHubSpot,
} from '@/lib/hubspot/field-mappers'

describe('mapSmsConsentToHubSpot', () => {
  afterEach(() => {
    delete process.env.HUBSPOT_SMS_CONSENT_YES_VALUE
    delete process.env.HUBSPOT_SMS_CONSENT_NO_VALUE
  })

  it('maps yes/no to HubSpot option values', () => {
    process.env.HUBSPOT_SMS_CONSENT_YES_VALUE = 'yes-id'
    process.env.HUBSPOT_SMS_CONSENT_NO_VALUE = 'no-id'

    expect(mapSmsConsentToHubSpot('yes')).toBe('yes-id')
    expect(mapSmsConsentToHubSpot('No')).toBe('no-id')
  })
})

describe('isDuplicateAssociationResponse', () => {
  it('detects duplicate association API errors', () => {
    expect(isDuplicateAssociationResponse({ message: 'Association already exists' }, 400)).toBe(
      true
    )
    expect(isDuplicateAssociationResponse({}, 409)).toBe(true)
    expect(isDuplicateAssociationResponse({ message: 'Not found' }, 404)).toBe(false)
  })
})

describe('contactHasTrainingAssociation', () => {
  it('returns true when training id is in association results', () => {
    expect(
      contactHasTrainingAssociation([{ id: '111' }, { id: '222' }], '222')
    ).toBe(true)
    expect(contactHasTrainingAssociation([{ id: '111' }], '222')).toBe(false)
  })

  it('filters by association type when provided', () => {
    expect(
      contactHasTrainingAssociation(
        [
          { id: '222', type: 'waitlist' },
          { id: '222', type: 'registrant' },
        ],
        '222',
        'registrant'
      )
    ).toBe(true)
    expect(
      contactHasTrainingAssociation([{ id: '222', type: 'waitlist' }], '222', 'registrant')
    ).toBe(false)
  })
})

describe('contactHasRegistrantAssociation', () => {
  it('checks registrant label only', () => {
    expect(
      contactHasRegistrantAssociation(
        [{ id: '1', type: 'registrant' }],
        '1',
        'registrant'
      )
    ).toBe(true)
  })
})
