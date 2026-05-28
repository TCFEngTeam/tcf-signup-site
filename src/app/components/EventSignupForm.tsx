"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

type SignupFormProps = {
  eventId: string
  prefillData?: any
  submitUrl?: string
}

const requiredFieldLabels = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  phone: 'Phone Number',
  hometownCity: 'Hometown City',
  hometownState: 'Hometown State',
  universityWebsite: 'University Website',
  currentYear: 'Current Year in School',
  isVirginiaResident: 'Virginia Resident / College in Virginia',
  interestReason: 'Why are you interested in this event?',
  communitySupport: 'How do you plan to use this event to support others?',
  interestedInTeaching: 'Interest in teaching after training',
} as const

function RequiredText({ show }: { show: boolean }) {
  if (!show) return null
  return <p className="mt-1 text-xs text-red-600">Required*</p>
}

const US_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'District of Columbia',
]

export default function EventSignupForm({ eventId, prefillData, submitUrl }: SignupFormProps) {
  const router = useRouter()
  const [firstName, setFirstName] = useState(prefillData?.firstName ?? '')
  const [lastName, setLastName] = useState(prefillData?.lastName ?? '')
  const [email, setEmail] = useState(prefillData?.email ?? '')
  const [phone, setPhone] = useState(prefillData?.phone ?? '')
  const [hometownCity, setHometownCity] = useState(prefillData?.hometownCity ?? '')
  const [hometownState, setHometownState] = useState(prefillData?.hometownState ?? '')
  const [universityWebsite, setUniversityWebsite] = useState(prefillData?.universityWebsite ?? '')
  const [currentYear, setCurrentYear] = useState(prefillData?.currentYear ?? '')
  const [isVirginiaResident, setIsVirginiaResident] = useState(prefillData?.isVirginiaResident ?? '')
  const [interestReason, setInterestReason] = useState(prefillData?.interestReason ?? '')
  const [communitySupport, setCommunitySupport] = useState(prefillData?.communitySupport ?? '')
  const [interestedInTeaching, setInterestedInTeaching] = useState(prefillData?.interestedInTeaching ?? '')
  const [smsConsent, setSmsConsent] = useState(prefillData?.smsConsent ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const shouldRedirectOnSuccess = !submitUrl || submitUrl === '/api/signup'

  const missingFieldLabels = (() => {
    const missing: string[] = []
    if (!firstName.trim()) missing.push(requiredFieldLabels.firstName)
    if (!lastName.trim()) missing.push(requiredFieldLabels.lastName)
    if (!email.trim()) missing.push(requiredFieldLabels.email)
    if (!phone.trim()) missing.push(requiredFieldLabels.phone)
    if (!hometownCity.trim()) missing.push(requiredFieldLabels.hometownCity)
    if (!hometownState.trim()) missing.push(requiredFieldLabels.hometownState)
    if (!universityWebsite.trim()) missing.push(requiredFieldLabels.universityWebsite)
    if (!currentYear) missing.push(requiredFieldLabels.currentYear)
    if (!isVirginiaResident) missing.push(requiredFieldLabels.isVirginiaResident)
    if (!interestReason.trim()) missing.push(requiredFieldLabels.interestReason)
    if (!communitySupport.trim()) missing.push(requiredFieldLabels.communitySupport)
    if (!interestedInTeaching) missing.push(requiredFieldLabels.interestedInTeaching)
    return missing
  })()

  function isFieldMissing(label: string) {
    return missingFieldLabels.includes(label)
  }

  function shouldShowError(label: string) {
    return isFieldMissing(label) && (touchedFields[label] || submitAttempted)
  }

  function markTouched(label: string) {
    setTouchedFields((current) => ({ ...current, [label]: true }))
  }

  function getMissingFieldLabelsFromForm(form: HTMLFormElement) {
    const formData = new FormData(form)
    const missing: string[] = []

    if (!String(formData.get('firstName') ?? '').trim()) missing.push(requiredFieldLabels.firstName)
    if (!String(formData.get('lastName') ?? '').trim()) missing.push(requiredFieldLabels.lastName)
    if (!String(formData.get('email') ?? '').trim()) missing.push(requiredFieldLabels.email)
    if (!String(formData.get('phone') ?? '').trim()) missing.push(requiredFieldLabels.phone)
    if (!String(formData.get('hometownCity') ?? '').trim()) missing.push(requiredFieldLabels.hometownCity)
    if (!String(formData.get('hometownState') ?? '').trim()) missing.push(requiredFieldLabels.hometownState)
    if (!String(formData.get('universityWebsite') ?? '').trim()) missing.push(requiredFieldLabels.universityWebsite)
    if (!String(formData.get('currentYear') ?? '').trim()) missing.push(requiredFieldLabels.currentYear)
    if (!String(formData.get('isVirginiaResident') ?? '').trim()) missing.push(requiredFieldLabels.isVirginiaResident)
    if (!String(formData.get('interestReason') ?? '').trim()) missing.push(requiredFieldLabels.interestReason)
    if (!String(formData.get('communitySupport') ?? '').trim()) missing.push(requiredFieldLabels.communitySupport)
    if (!String(formData.get('interestedInTeaching') ?? '').trim()) missing.push(requiredFieldLabels.interestedInTeaching)

    return missing
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setSubmitAttempted(true)

    const form = e.currentTarget as HTMLFormElement
    const missing = getMissingFieldLabelsFromForm(form)

    if (missing.length > 0) {
      setTouchedFields((current) => {
        const next = { ...current }
        missing.forEach((label) => {
          next[label] = true
        })
        return next
      })
      setMessage('Please fill in the highlighted required fields')
      return
    }

    setSubmitting(true)

    ;(async () => {
      try {
        // Check if event is still available (not over capacity)
        const eventRes = await fetch(`/api/events`)
        if (eventRes.ok) {
          const allEvents: any[] = await eventRes.json()
          const currentEvent = allEvents.find((e: any) => e.id === eventId)
          if (currentEvent && currentEvent.isFull) {
            setMessage('Sorry, this event is now full. Please try another event.')
            setSubmitting(false)
            return
          }
        }

        const endpoint = submitUrl || '/api/signup'
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId,
            data: {
              firstName,
              lastName,
              email,
              phone,
              hometownCity,
              hometownState,
              universityWebsite,
              currentYear,
              isVirginiaResident,
              interestReason,
              communitySupport,
              interestedInTeaching,
              smsConsent,
            },
          }),
        })

        // Robust response parsing: read text first, then try JSON.parse.
        const text = await res.text().catch(() => '')
        let payload: any = null
        if (text) {
          try {
            payload = JSON.parse(text)
          } catch (e) {
            payload = { text }
          }
        }

        console.log('signup response payload:', payload)

        if (!res.ok) {
          const errMsg = payload?.error ?? payload?.text ?? 'Failed to signup'
          setMessage(errMsg)
        } else {
          setMessage('Successfully signed up!')
          if (shouldRedirectOnSuccess) {
            router.push('/')
          }
        }
      } catch (err: any) {
        setMessage(err?.message ?? 'Network error')
      } finally {
        setSubmitting(false)
      }
    })()
  }

  function fieldHasError(label: string) {
    return shouldShowError(label)
  }

  return (
    <form className="event-signup-form signup-card" onSubmit={handleSubmit} noValidate>
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="block">
          <div className={`field-label text-sm font-medium ${fieldHasError(requiredFieldLabels.firstName) ? 'text-red-600' : ''}`}>First Name *</div>
          <input name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} onBlur={() => markTouched(requiredFieldLabels.firstName)} className="mt-1 w-full" required />
          <RequiredText show={fieldHasError(requiredFieldLabels.firstName)} />
        </label>
        <label className="block">
          <div className={`field-label text-sm font-medium ${fieldHasError(requiredFieldLabels.lastName) ? 'text-red-600' : ''}`}>Last Name *</div>
          <input name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={() => markTouched(requiredFieldLabels.lastName)} className="mt-1 w-full" required />
          <RequiredText show={fieldHasError(requiredFieldLabels.lastName)} />
        </label>
      </div>

      {/* Contact Fields */}
      <label className="block mb-4">
        <div className={`field-label text-sm font-medium ${fieldHasError(requiredFieldLabels.email) ? 'text-red-600' : ''}`}>Email *</div>
        <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => markTouched(requiredFieldLabels.email)} className="mt-1 w-full" required />
        <RequiredText show={fieldHasError(requiredFieldLabels.email)} />
      </label>

      <label className="block mb-4">
        <div className={`field-label text-sm font-medium ${fieldHasError(requiredFieldLabels.phone) ? 'text-red-600' : ''}`}>Phone Number *</div>
        <input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => markTouched(requiredFieldLabels.phone)} className="mt-1 w-full" required />
        <RequiredText show={fieldHasError(requiredFieldLabels.phone)} />
      </label>

      {/* Hometown Fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="block">
          <div className={`field-label text-sm font-medium ${fieldHasError(requiredFieldLabels.hometownCity) ? 'text-red-600' : ''}`}>Hometown City *</div>
          <input name="hometownCity" value={hometownCity} onChange={(e) => setHometownCity(e.target.value)} onBlur={() => markTouched(requiredFieldLabels.hometownCity)} className="mt-1 w-full" required />
          <RequiredText show={fieldHasError(requiredFieldLabels.hometownCity)} />
        </label>
        <label className="block">
          <div className={`field-label text-sm font-medium ${fieldHasError(requiredFieldLabels.hometownState) ? 'text-red-600' : ''}`}>Hometown State *</div>
          <select name="hometownState" value={hometownState} onChange={(e) => setHometownState(e.target.value)} onBlur={() => markTouched(requiredFieldLabels.hometownState)} className="mt-1 w-full" required>
            <option value="">Select a state</option>
            {US_STATES.map((state: string) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <RequiredText show={fieldHasError(requiredFieldLabels.hometownState)} />
        </label>
      </div>

      {/* University Website */}
      {/* TODO: University website should eventually map to the company object in HubSpot. */}
      <label className="block mb-4">
        <div className={`field-label text-sm font-medium ${fieldHasError(requiredFieldLabels.universityWebsite) ? 'text-red-600' : ''}`}>University Website *</div>
        <input name="universityWebsite" value={universityWebsite} onChange={(e) => setUniversityWebsite(e.target.value)} onBlur={() => markTouched(requiredFieldLabels.universityWebsite)} className="mt-1 w-full" placeholder="virginia.edu" required />
        <RequiredText show={fieldHasError(requiredFieldLabels.universityWebsite)} />
      </label>

      {/* Current Year in School */}
      <label className="block mb-4">
        <div className={`field-label text-sm font-medium ${fieldHasError(requiredFieldLabels.currentYear) ? 'text-red-600' : ''}`}>Current Year in School *</div>
        <select name="currentYear" value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} onBlur={() => markTouched(requiredFieldLabels.currentYear)} className="mt-1 w-full" required>
          <option value="">Select a year</option>
          <option value="Graduate School">Graduate School</option>
          <option value="High School">High School</option>
          <option value="Senior">Senior</option>
          <option value="Junior">Junior</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Freshman">Freshman</option>
          <option value="Other">Other</option>
          <option value="Gap Year">Gap Year</option>
          <option value="N/A">N/A</option>
        </select>
        <RequiredText show={fieldHasError(requiredFieldLabels.currentYear)} />
      </label>

      {/* Virginia Resident Radio */}
      <fieldset className="mb-4">
        <div className={`field-label text-sm font-medium mb-2 ${fieldHasError(requiredFieldLabels.isVirginiaResident) ? 'text-red-600' : ''}`}>Are you currently a Virginia resident or attending a college in Virginia? *</div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="isVirginiaResident" value="yes" checked={isVirginiaResident === 'yes'} onChange={(e) => setIsVirginiaResident(e.target.value)} onBlur={() => markTouched(requiredFieldLabels.isVirginiaResident)} required />
            <span className="text-sm">Yes</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="isVirginiaResident" value="no" checked={isVirginiaResident === 'no'} onChange={(e) => setIsVirginiaResident(e.target.value)} onBlur={() => markTouched(requiredFieldLabels.isVirginiaResident)} required />
            <span className="text-sm">No</span>
          </label>
        </div>
        <RequiredText show={fieldHasError(requiredFieldLabels.isVirginiaResident)} />
      </fieldset>

      {/* Why interested */}
      <label className="block mb-4">
        <div className={`field-label text-sm font-medium ${fieldHasError(requiredFieldLabels.interestReason) ? 'text-red-600' : ''}`}>Why are you interested in this event? *</div>
        <textarea
          name="interestReason"
          value={interestReason}
          onChange={(e) => setInterestReason(e.target.value)}
          onBlur={() => markTouched(requiredFieldLabels.interestReason)}
          className="mt-1 w-full h-24"
          required
        />
        <RequiredText show={fieldHasError(requiredFieldLabels.interestReason)} />
      </label>

      {/* Community support */}
      <label className="block mb-4">
        <div className={`field-label text-sm font-medium ${fieldHasError(requiredFieldLabels.communitySupport) ? 'text-red-600' : ''}`}>How do you plan to use this event to support others in your community or on your campus? *</div>
        <textarea
          name="communitySupport"
          value={communitySupport}
          onChange={(e) => setCommunitySupport(e.target.value)}
          onBlur={() => markTouched(requiredFieldLabels.communitySupport)}
          className="mt-1 w-full h-24"
          required
        />
        <RequiredText show={fieldHasError(requiredFieldLabels.communitySupport)} />
      </label>

      {/* Interested in Teaching */}
      <fieldset className="mb-4">
        <div className={`field-label text-sm font-medium mb-2 ${fieldHasError(requiredFieldLabels.interestedInTeaching) ? 'text-red-600' : ''}`}>Would you be interested in teaching this event to others after completing the training? *</div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="interestedInTeaching" value="Yes" checked={interestedInTeaching === 'Yes'} onChange={(e) => setInterestedInTeaching(e.target.value)} onBlur={() => markTouched(requiredFieldLabels.interestedInTeaching)} required />
            <span className="text-sm">Yes</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="interestedInTeaching" value="No" checked={interestedInTeaching === 'No'} onChange={(e) => setInterestedInTeaching(e.target.value)} onBlur={() => markTouched(requiredFieldLabels.interestedInTeaching)} required />
            <span className="text-sm">No</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="interestedInTeaching" value="Maybe" checked={interestedInTeaching === 'Maybe'} onChange={(e) => setInterestedInTeaching(e.target.value)} onBlur={() => markTouched(requiredFieldLabels.interestedInTeaching)} required />
            <span className="text-sm">Maybe</span>
          </label>
        </div>
        <RequiredText show={fieldHasError(requiredFieldLabels.interestedInTeaching)} />
      </fieldset>

      {/* SMS Consent Radio */}
      <div className="mb-4 bg-blue-50 rounded-lg text-sm p-4 border border-blue-100">
        <div className="field-label text-sm font-medium mb-3">
          SMS Communication Consent
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-2">
            <input
              type="radio"
              name="smsConsent"
              value="yes"
              checked={smsConsent === 'yes'}
              onChange={(e) => setSmsConsent(e.target.value)}
              className="flex-shrink-0 mt-1"
            />
            <span>
              I consent to receive SMS marketing text messages from Trusted Care Foundation.
              Message frequency varies. Message and data rates may apply. Reply STOP to opt out.
            </span>
          </label>

          <label className="flex items-start gap-2">
            <input
              type="radio"
              name="smsConsent"
              value="no"
              checked={smsConsent === 'no'}
              onChange={(e) => setSmsConsent(e.target.value)}
              className="flex-shrink-0 mt-1"
            />
            <span>
              I do not consent to receiving marketing messages.
            </span>
          </label>
        </div>

        <div className="text-xs text-gray-600 mt-3">
          See our <a href="#" className="underline">SMS Terms</a> and acknowledge the{" "}
          <a href="#" className="underline">SMS Privacy Policy</a>.
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
        {message && (
          <div className={`text-sm ${message.toLowerCase().includes('success') ? 'success-chip' : 'error-chip'}`}>
            {message}
          </div>
        )}
      </div>
    </form>
  )
}
