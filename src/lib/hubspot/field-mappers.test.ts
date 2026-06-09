import { afterEach, describe, expect, it } from 'vitest'
import {
  contactHasTrainingAssociation,
  contactHasAssociationForTraining,
  isDuplicateAssociationResponse,
  mapSmsConsentToHubSpot,
  parseTrainingAssociationRows,
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
        [{ id: '222', type: 'registrant' }],
        '222',
        'registrant'
      )
    ).toBe(true)
    expect(
      contactHasTrainingAssociation(
        [{ id: '222', type: 'waitlist' }],
        '222',
        'registrant'
      )
    ).toBe(false)
  })
})

describe('parseTrainingAssociationRows', () => {
  it('parses HubSpot v4 association rows with labels', () => {
    const rows = parseTrainingAssociationRows([
      {
        toObjectId: 5790939450,
        associationTypes: [{ label: 'waitlisted', category: 'USER_DEFINED', typeId: 42 }],
      },
    ])
    expect(rows).toEqual([
      {
        trainingId: '5790939450',
        associationType: 'waitlisted',
        associationCategory: 'USER_DEFINED',
        associationTypeId: 42,
      },
    ])
  })

  it('parses HubSpot v3 association rows', () => {
    const rows = parseTrainingAssociationRows([{ id: '111', type: 'registrant' }])
    expect(rows).toEqual([{ trainingId: '111', associationType: 'registrant' }])
  })
})

describe('contactHasAssociationForTraining', () => {
  it('matches association labels case-insensitively', () => {
    const rows = parseTrainingAssociationRows([
      {
        toObjectId: '222',
        associationTypes: [{ label: 'Waitlisted', typeId: 7 }],
      },
    ])
    expect(contactHasAssociationForTraining(rows, '222', 'waitlisted')).toBe(true)
    expect(contactHasAssociationForTraining(rows, '222', 'registrant')).toBe(false)
  })

  it('matches by configured type id when label differs', () => {
    const rows = parseTrainingAssociationRows([
      {
        toObjectId: '222',
        associationTypes: [{ label: 'custom', typeId: 99 }],
      },
    ])
    expect(contactHasAssociationForTraining(rows, '222', 'waitlisted', '99')).toBe(true)
  })
})
