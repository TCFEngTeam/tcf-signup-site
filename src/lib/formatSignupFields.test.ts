import { describe, expect, it } from 'vitest'
import {
  formatHubSpotYesNo,
  formatSignupFormData,
  formatUniversityWebsite,
  isSignupFormatError,
  parseStoredPhone,
} from './formatSignupFields'

describe('formatSignupFormData', () => {
  it('normalizes contact fields and HubSpot yes/no values', () => {
    const result = formatSignupFormData({
      firstName: '  jane ',
      lastName: 'DOE',
      email: 'Jane.Doe@Example.COM',
      phone: '5714820864',
      hometownCity: 'charlottesville',
      hometownState: 'Virginia',
      universityWebsite: 'https://www.virginia.edu/about',
      currentYear: 'Junior',
      isVirginiaResident: 'Yes',
      interestReason: '  Interested  ',
      communitySupport: '  Support plan  ',
      interestedInTeaching: 'yes',
      smsConsent: 'No',
    })

    expect(isSignupFormatError(result)).toBe(false)
    if (isSignupFormatError(result)) return

    expect(result.firstName).toBe('Jane')
    expect(result.lastName).toBe('Doe')
    expect(result.email).toBe('jane.doe@example.com')
    expect(result.phone).toBe('+1 (571) 482-0864')
    expect(result.universityWebsite).toBe('virginia.edu')
    expect(result.isVirginiaResident).toBe('yes')
    expect(result.smsConsent).toBe('no')
    expect(result.interestedInTeaching).toBe('Yes')
  })

  it('returns an error for incomplete phone numbers', () => {
    const result = formatSignupFormData({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '571',
      hometownCity: 'City',
      hometownState: 'Virginia',
      universityWebsite: 'school.edu',
      currentYear: 'Junior',
      isVirginiaResident: 'yes',
      interestReason: 'Reason',
      communitySupport: 'Support',
      interestedInTeaching: 'no',
      smsConsent: 'no',
    })

    expect(isSignupFormatError(result)).toBe(true)
  })
})

describe('formatHubSpotYesNo', () => {
  it('returns lowercase yes/no', () => {
    expect(formatHubSpotYesNo('Yes')).toBe('yes')
    expect(formatHubSpotYesNo('NO')).toBe('no')
  })
})

describe('parseStoredPhone', () => {
  it('parses E.164 and national numbers', () => {
    expect(parseStoredPhone('+15714820864').nationalDigits).toBe('5714820864')
    expect(parseStoredPhone('5714820864').nationalDigits).toBe('5714820864')
  })
})

describe('formatUniversityWebsite', () => {
  it('strips protocol and www', () => {
    expect(formatUniversityWebsite('https://www.Virginia.edu/')).toBe('virginia.edu')
  })
})
