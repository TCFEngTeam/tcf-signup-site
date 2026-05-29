import fs from 'fs'
import https from 'https'

const url =
  'https://gist.githubusercontent.com/gugazimmermann/635dac160396fc9b5e5d75d1b03c1194/raw'

const data = await new Promise((resolve, reject) => {
  https
    .get(url, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })
      res.on('end', () => resolve(body))
    })
    .on('error', reject)
})

const cleaned = String(data).replace(/export\s+default\s+PHONECODESEN;?\s*$/, '')
const fn = new Function(`${cleaned}; return PHONECODESEN;`)
const codes = fn()

const entries = Object.entries(codes).map(([isoCode, value]) => ({
  isoCode,
  name: value.primary,
  dialCode: value.secondary.replace(/^\+/, ''),
}))

entries.sort((a, b) => a.name.localeCompare(b.name))
const us = entries.find((entry) => entry.isoCode === 'US')
const sorted = us ? [us, ...entries.filter((entry) => entry.isoCode !== 'US')] : entries

const output = `// Country phone codes from https://gist.github.com/gugazimmermann/635dac160396fc9b5e5d75d1b03c1194
export type PhoneCountryEntry = {
  isoCode: string
  name: string
  dialCode: string
}

export const DEFAULT_PHONE_COUNTRY_ISO = 'US'

export const PHONE_COUNTRIES: PhoneCountryEntry[] = ${JSON.stringify(sorted, null, 2)}

const byIso = new Map(PHONE_COUNTRIES.map((country) => [country.isoCode, country]))

export function getPhoneCountryByIso(isoCode: string): PhoneCountryEntry | undefined {
  return byIso.get(isoCode)
}

export function getDialCodeFromIso(isoCode: string): string {
  return getPhoneCountryByIso(isoCode)?.dialCode ?? '1'
}

export function findPhoneCountryByDialCode(dialCode: string): PhoneCountryEntry | undefined {
  const normalized = dialCode.replace(/^\\+/, '')
  return PHONE_COUNTRIES.find((country) => country.dialCode === normalized)
}
`

fs.writeFileSync('src/lib/phoneCountryCodes.ts', output)
console.log(`Wrote ${sorted.length} countries to src/lib/phoneCountryCodes.ts`)
