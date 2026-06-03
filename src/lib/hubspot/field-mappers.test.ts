import { afterEach, describe, expect, it } from 'vitest'
import {
  contactHasRegistrantAssociation,
  contactHasTrainingAssociation,
  findRegistrantAssociationsForTraining,
  hasCancelledAssociation,
  isDuplicateAssociationResponse,
  mapSmsConsentToHubSpot,
  matchesAssociationLabel,
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

describe('parseTrainingAssociationRows', () => {
  it('parses HubSpot v3 association rows', () => {
    expect(
      parseTrainingAssociationRows([
        { id: '111', type: 'registrant' },
        { id: '222', type: 'waitlist' },
      ])
    ).toEqual([
      { trainingId: '111', associationType: 'registrant' },
      { trainingId: '222', associationType: 'waitlist' },
    ])
  })

  it('parses HubSpot v4 association rows', () => {
    expect(
      parseTrainingAssociationRows([
        {
          toObjectId: 222,
          associationTypes: [
            {
              category: 'USER_DEFINED',
              typeId: 72,
              label: 'registrant',
            },
          ],
        },
      ])
    ).toEqual([
      {
        trainingId: '222',
        associationType: 'registrant',
        associationCategory: 'USER_DEFINED',
        associationTypeId: 72,
      },
    ])
  })
})

describe('matchesAssociationLabel', () => {
  it('matches label or configured type id', () => {
    expect(
      matchesAssociationLabel(
        { trainingId: '1', associationType: 'registrant' },
        'registrant'
      )
    ).toBe(true)
    expect(
      matchesAssociationLabel(
        { trainingId: '1', associationTypeId: 72 },
        'registrant',
        '72'
      )
    ).toBe(true)
  })
})

describe('findRegistrantAssociationsForTraining', () => {
  it('falls back to the only association for a training', () => {
    const rows = [{ trainingId: '222', associationType: 'contact_to_training' }]
    expect(
      findRegistrantAssociationsForTraining(rows, '222', 'registrant')
    ).toEqual(rows)
  })
})

describe('hasCancelledAssociation', () => {
  it('detects cancelled label associations', () => {
    expect(
      hasCancelledAssociation(
        [{ trainingId: '1', associationType: 'cancelled_registration' }],
        '1',
        'cancelled_registration'
      )
    ).toBe(true)
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
