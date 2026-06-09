import {
  DEFAULT_PHONE_COUNTRY_ISO,
  findPhoneCountryByDialCode,
  getDialCodeFromIso,
  getUniqueDialCodesLongestFirst,
} from '@/lib/phone/country-codes'
import { signupFormContent } from '@/lib/content'

export type SignupFormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  hometownCity: string
  hometownState: string
  universityWebsite: string
  currentYear: string
  isVirginiaResident: string
  interestReason: string
  communitySupport: string
  smsConsent: string
}

export type SignupFormatError = { error: string }

export type ParsedPhone = {
  countryIso: string
  nationalDigits: string
}

export function isSignupFormatError(
  result: SignupFormData | SignupFormatError
): result is SignupFormatError {
  return 'error' in result
}

function titleCaseWord(word: string) {
  if (!word) return word
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export function formatPersonName(value: string) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((part) => part.split('-').map(titleCaseWord).join('-'))
    .join(' ')
}

export function formatEmail(value: string) {
  return value.trim().toLowerCase()
}

function getMaxNationalDigits(countryIso: string) {
  return getDialCodeFromIso(countryIso) === '1' ? 10 : 15
}

function usesUsPhoneFormatting(countryIso: string) {
  return getDialCodeFromIso(countryIso) === '1'
}

export function parseStoredPhone(value: string): ParsedPhone {
  const trimmed = value.trim()
  if (!trimmed) {
    return { countryIso: DEFAULT_PHONE_COUNTRY_ISO, nationalDigits: '' }
  }

  if (trimmed.startsWith('+')) {
    const digitsOnly = trimmed.slice(1).replace(/\D/g, '')
    for (const dialCode of getUniqueDialCodesLongestFirst()) {
      if (digitsOnly.startsWith(dialCode)) {
        const country = findPhoneCountryByDialCode(dialCode)
        const nationalDigits = digitsOnly.slice(dialCode.length)
        const maxDigits = dialCode === '1' ? 10 : 15
        return {
          countryIso: country?.isoCode ?? DEFAULT_PHONE_COUNTRY_ISO,
          nationalDigits: nationalDigits.slice(0, maxDigits),
        }
      }
    }
  }

  let digits = trimmed.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) {
    return {
      countryIso: DEFAULT_PHONE_COUNTRY_ISO,
      nationalDigits: digits.slice(1, 11),
    }
  }

  return {
    countryIso: DEFAULT_PHONE_COUNTRY_ISO,
    nationalDigits: digits.slice(0, 10),
  }
}

export function formatNationalPhoneDisplay(nationalDigits: string, countryIso = DEFAULT_PHONE_COUNTRY_ISO) {
  if (!nationalDigits) return ''

  if (!usesUsPhoneFormatting(countryIso)) {
    return nationalDigits
  }

  const area = nationalDigits.slice(0, 3)
  const prefix = nationalDigits.slice(3, 6)
  const line = nationalDigits.slice(6, 10)

  if (nationalDigits.length <= 3) {
    return `(${area}`
  }

  if (nationalDigits.length <= 6) {
    return `(${area}) ${prefix}`
  }

  return `(${area}) ${prefix}-${line}`
}

export function getCursorAfterDigitIndex(formatted: string, digitIndex: number) {
  if (digitIndex <= 0) {
    return formatted.startsWith('(') ? 1 : 0
  }

  let digitsSeen = 0
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      digitsSeen++
      if (digitsSeen === digitIndex) {
        return i + 1
      }
    }
  }

  return formatted.length
}

export function isCompletePhoneNumber(
  nationalDigits: string,
  countryIso = DEFAULT_PHONE_COUNTRY_ISO
) {
  if (usesUsPhoneFormatting(countryIso)) {
    return nationalDigits.length === 10
  }

  return nationalDigits.length >= 6
}

export function composePhoneNumber(countryIso: string, nationalDigits: string): string | null {
  const dialCode = getDialCodeFromIso(countryIso)
  if (!isCompletePhoneNumber(nationalDigits, countryIso)) {
    return null
  }

  if (usesUsPhoneFormatting(countryIso)) {
    const formatted = formatNationalPhoneDisplay(nationalDigits, countryIso)
    return `+${dialCode} ${formatted}`
  }

  return `+${dialCode} ${nationalDigits}`
}

/** @deprecated Use composePhoneNumber with country ISO + national digits */
export function formatPhoneInput(value: string) {
  const parsed = parseStoredPhone(value)
  const dialCode = getDialCodeFromIso(parsed.countryIso)
  const display = formatNationalPhoneDisplay(parsed.nationalDigits, parsed.countryIso)
  if (!display) return ''
  return `+${dialCode} ${display}`
}

export function formatPhoneNumber(value: string): string | null {
  const parsed = parseStoredPhone(value)
  return composePhoneNumber(parsed.countryIso, parsed.nationalDigits)
}

export function formatCityName(value: string) {
  return formatPersonName(value)
}

export function formatUniversityWebsite(value: string) {
  let website = value.trim().toLowerCase()
  website = website.replace(/^https?:\/\//, '')
  website = website.replace(/^www\./, '')
  website = website.replace(/\/+$/, '')
  return website.split('/')[0] ?? website
}

export function formatYesNo(value: string) {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'yes') return 'Yes'
  if (normalized === 'no') return 'No'
  return value.trim()
}

/** HubSpot enumeration properties that expect lowercase yes/no. */
export function formatHubSpotYesNo(value: string) {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'yes') return 'yes'
  if (normalized === 'no') return 'no'
  return value.trim()
}

export function formatLongText(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function formatSignupFormData(data: SignupFormData): SignupFormData | SignupFormatError {
  const phone = formatPhoneNumber(data.phone)
  if (!phone) {
    return { error: signupFormContent.messages.invalidPhone }
  }

  return {
    firstName: formatPersonName(data.firstName),
    lastName: formatPersonName(data.lastName),
    email: formatEmail(data.email),
    phone,
    hometownCity: formatCityName(data.hometownCity),
    hometownState: data.hometownState.trim(),
    universityWebsite: formatUniversityWebsite(data.universityWebsite),
    currentYear: data.currentYear.trim(),
    isVirginiaResident: formatHubSpotYesNo(data.isVirginiaResident),
    interestReason: formatLongText(data.interestReason),
    communitySupport: formatLongText(data.communitySupport),
    smsConsent: data.smsConsent ? formatHubSpotYesNo(data.smsConsent) : '',
  }
}
