"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  composePhoneNumber,
  formatCityName,
  formatEmail,
  formatPersonName,
  formatSignupFormData,
  formatUniversityWebsite,
  isCompletePhoneNumber,
  isSignupFormatError,
  parseStoredPhone,
  type SignupFormData,
} from '@/lib/signup/format-fields'
import { siteContent, signupFormContent, type SignupFormFieldKey } from '@/lib/content'
import { loadProfile, saveProfile } from '@/lib/signup/profile-store'
import PhoneNumberField from './PhoneNumberField'
import type { TrainingProgramId } from '@/lib/programs/config'

const { form: formContent, links } = siteContent
const sms = formContent.smsConsent
const {
  fields: fieldLabels,
  messages: formMessages,
  placeholders: formPlaceholders,
  choices: formChoices,
  usStates,
  requiredSuffix,
  requiredHint,
} = signupFormContent

function displayLabel(key: SignupFormFieldKey) {
  return `${fieldLabels[key]}${requiredSuffix}`
}

type SignupFormProps = {
  eventId: string
  programId?: TrainingProgramId
  prefillData?: Partial<SignupFormData>
  submitUrl?: string
}

function RequiredText({ show }: { show: boolean }) {
  if (!show) return null
  return <p className="mt-1 text-xs text-red-600">{requiredHint}</p>
}

export default function EventSignupForm({ eventId, programId, prefillData, submitUrl }: SignupFormProps) {
  const router = useRouter()
  const initialPhone = parseStoredPhone(prefillData?.phone ?? '')
  const [firstName, setFirstName] = useState<string>(prefillData?.firstName ?? '')
  const [lastName, setLastName] = useState<string>(prefillData?.lastName ?? '')
  const [email, setEmail] = useState<string>(prefillData?.email ?? '')
  const [phoneCountryIso, setPhoneCountryIso] = useState<string>(initialPhone.countryIso)
  const [phoneNationalDigits, setPhoneNationalDigits] = useState<string>(initialPhone.nationalDigits)
  const [hometownCity, setHometownCity] = useState<string>(prefillData?.hometownCity ?? '')
  const [hometownState, setHometownState] = useState<string>(prefillData?.hometownState ?? '')
  const [universityWebsite, setUniversityWebsite] = useState<string>(prefillData?.universityWebsite ?? '')
  const [currentYear, setCurrentYear] = useState<string>(prefillData?.currentYear ?? '')
  const [isVirginiaResident, setIsVirginiaResident] = useState<string>(prefillData?.isVirginiaResident ?? '')
  const [interestReason, setInterestReason] = useState<string>(prefillData?.interestReason ?? '')
  const [communitySupport, setCommunitySupport] = useState<string>(prefillData?.communitySupport ?? '')
  const [interestedInTeaching, setInterestedInTeaching] = useState<string>(prefillData?.interestedInTeaching ?? '')
  const [smsConsent, setSmsConsent] = useState<string>(prefillData?.smsConsent ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  useEffect(() => {
    if (prefillData) return

    const saved = loadProfile()
    if (!saved) return

    if (saved.firstName) setFirstName(saved.firstName)
    if (saved.lastName) setLastName(saved.lastName)
    if (saved.email) setEmail(saved.email)
    if (saved.phone) {
      const parsedPhone = parseStoredPhone(saved.phone)
      setPhoneCountryIso(parsedPhone.countryIso)
      setPhoneNationalDigits(parsedPhone.nationalDigits)
    }
    if (saved.hometownCity) setHometownCity(saved.hometownCity)
    if (saved.hometownState) setHometownState(saved.hometownState)
    if (saved.universityWebsite) setUniversityWebsite(saved.universityWebsite)
    if (saved.currentYear) setCurrentYear(saved.currentYear)
    if (saved.isVirginiaResident) setIsVirginiaResident(saved.isVirginiaResident)
    if (saved.interestReason) setInterestReason(saved.interestReason)
    if (saved.communitySupport) setCommunitySupport(saved.communitySupport)
    if (saved.interestedInTeaching) setInterestedInTeaching(saved.interestedInTeaching)
    if (saved.smsConsent) setSmsConsent(saved.smsConsent)
  }, [prefillData])

  const shouldRedirectOnSuccess = !submitUrl || submitUrl === '/api/signup'
  const shouldUseProgramEvents = shouldRedirectOnSuccess && Boolean(programId)
  const composedPhone = composePhoneNumber(phoneCountryIso, phoneNationalDigits) ?? ''

  const missingFieldLabels = (() => {
    const missing: string[] = []
    if (!firstName.trim()) missing.push(fieldLabels.firstName)
    if (!lastName.trim()) missing.push(fieldLabels.lastName)
    if (!email.trim()) missing.push(fieldLabels.email)
    if (!isCompletePhoneNumber(phoneNationalDigits, phoneCountryIso)) {
      missing.push(fieldLabels.phone)
    }
    if (!hometownCity.trim()) missing.push(fieldLabels.hometownCity)
    if (!hometownState.trim()) missing.push(fieldLabels.hometownState)
    if (!universityWebsite.trim()) missing.push(fieldLabels.universityWebsite)
    if (!currentYear) missing.push(fieldLabels.currentYear)
    if (!isVirginiaResident) missing.push(fieldLabels.isVirginiaResident)
    if (!interestReason.trim()) missing.push(fieldLabels.interestReason)
    if (!communitySupport.trim()) missing.push(fieldLabels.communitySupport)
    if (!interestedInTeaching) missing.push(fieldLabels.interestedInTeaching)
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

    if (!String(formData.get('firstName') ?? '').trim()) missing.push(fieldLabels.firstName)
    if (!String(formData.get('lastName') ?? '').trim()) missing.push(fieldLabels.lastName)
    if (!String(formData.get('email') ?? '').trim()) missing.push(fieldLabels.email)
    if (!isCompletePhoneNumber(phoneNationalDigits, phoneCountryIso)) {
      missing.push(fieldLabels.phone)
    }
    if (!String(formData.get('hometownCity') ?? '').trim()) missing.push(fieldLabels.hometownCity)
    if (!String(formData.get('hometownState') ?? '').trim()) missing.push(fieldLabels.hometownState)
    if (!String(formData.get('universityWebsite') ?? '').trim()) missing.push(fieldLabels.universityWebsite)
    if (!String(formData.get('currentYear') ?? '').trim()) missing.push(fieldLabels.currentYear)
    if (!String(formData.get('isVirginiaResident') ?? '').trim()) missing.push(fieldLabels.isVirginiaResident)
    if (!String(formData.get('interestReason') ?? '').trim()) missing.push(fieldLabels.interestReason)
    if (!String(formData.get('communitySupport') ?? '').trim()) missing.push(fieldLabels.communitySupport)
    if (!String(formData.get('interestedInTeaching') ?? '').trim()) missing.push(fieldLabels.interestedInTeaching)

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
      setMessage(formMessages.missingFields)
      return
    }

    const formatted = formatSignupFormData({
      firstName,
      lastName,
      email,
      phone: composedPhone,
      hometownCity,
      hometownState,
      universityWebsite,
      currentYear,
      isVirginiaResident,
      interestReason,
      communitySupport,
      interestedInTeaching,
      smsConsent,
    })

    if (isSignupFormatError(formatted)) {
      setTouchedFields((current) => ({ ...current, [fieldLabels.phone]: true }))
      setMessage(formatted.error)
      return
    }

    setFirstName(formatted.firstName)
    setLastName(formatted.lastName)
    setEmail(formatted.email)
    const parsedPhone = parseStoredPhone(formatted.phone)
    setPhoneCountryIso(parsedPhone.countryIso)
    setPhoneNationalDigits(parsedPhone.nationalDigits)
    setHometownCity(formatted.hometownCity)
    setHometownState(formatted.hometownState)
    setUniversityWebsite(formatted.universityWebsite)
    setCurrentYear(formatted.currentYear)
    setIsVirginiaResident(formatted.isVirginiaResident.toLowerCase())
    setInterestReason(formatted.interestReason)
    setCommunitySupport(formatted.communitySupport)
    setInterestedInTeaching(formatted.interestedInTeaching)
    setSmsConsent(formatted.smsConsent.toLowerCase())

    setSubmitting(true)

    ;(async () => {
      try {
        // Check if event is still available (not over capacity)
        if (shouldUseProgramEvents) {
          const eventRes = await fetch(`/api/events?program=${programId}`)
          if (eventRes.ok) {
            const allEvents: { id: string; isFull?: boolean }[] = await eventRes.json()
            const currentEvent = allEvents.find((entry) => entry.id === eventId)
            if (currentEvent?.isFull) {
              setMessage(formMessages.eventFull)
              setSubmitting(false)
              return
            }
          }
        }

        const endpoint = submitUrl || '/api/signup'
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId,
            ...(programId ? { program: programId } : {}),
            data: formatted,
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
          const errMsg = payload?.error ?? payload?.text ?? formMessages.signupFailed
          setMessage(errMsg)
        } else {
          saveProfile(formatted)
          setMessage(formMessages.signupSuccess)
          if (shouldRedirectOnSuccess && programId) {
            router.push(`/${programId}/events/${eventId}/success`)
          }
        }
      } catch (err: any) {
        setMessage(err?.message ?? formMessages.networkError)
      } finally {
        setSubmitting(false)
      }
    })()
  }

  function applyBlurFormat(
    label: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    formatter: (value: string) => string
  ) {
    markTouched(label)
    setter((value: string) => formatter(value))
  }

  function fieldHasError(label: string) {
    return shouldShowError(label)
  }

  return (
    <form className="event-signup-form signup-card" onSubmit={handleSubmit} noValidate>
      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <label className="block">
          <div className={`field-label text-sm font-medium ${fieldHasError(fieldLabels.firstName) ? 'text-red-600' : ''}`}>{displayLabel('firstName')}</div>
          <input name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} onBlur={() => applyBlurFormat(fieldLabels.firstName, setFirstName, formatPersonName)} className="mt-1 w-full" required />
          <RequiredText show={fieldHasError(fieldLabels.firstName)} />
        </label>
        <label className="block">
          <div className={`field-label text-sm font-medium ${fieldHasError(fieldLabels.lastName) ? 'text-red-600' : ''}`}>{displayLabel('lastName')}</div>
          <input name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={() => applyBlurFormat(fieldLabels.lastName, setLastName, formatPersonName)} className="mt-1 w-full" required />
          <RequiredText show={fieldHasError(fieldLabels.lastName)} />
        </label>
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <label className="block">
          <div className={`field-label text-sm font-medium ${fieldHasError(fieldLabels.email) ? 'text-red-600' : ''}`}>{displayLabel('email')}</div>
          <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => applyBlurFormat(fieldLabels.email, setEmail, formatEmail)} className="mt-1 w-full" required />
          <RequiredText show={fieldHasError(fieldLabels.email)} />
        </label>

        <label className="block">
          <div className={`field-label text-sm font-medium ${fieldHasError(fieldLabels.phone) ? 'text-red-600' : ''}`}>{displayLabel('phone')}</div>
          <input type="hidden" name="phone" value={composedPhone} />
          <div className="mt-1">
            <PhoneNumberField
              countryIso={phoneCountryIso}
              nationalDigits={phoneNationalDigits}
              onCountryIsoChange={setPhoneCountryIso}
              onNationalDigitsChange={setPhoneNationalDigits}
              onBlur={() => markTouched(fieldLabels.phone)}
              hasError={fieldHasError(fieldLabels.phone)}
            />
          </div>
          <RequiredText show={fieldHasError(fieldLabels.phone)} />
        </label>
      </div>

      {/* Hometown Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <label className="block">
          <div className={`field-label text-sm font-medium ${fieldHasError(fieldLabels.hometownCity) ? 'text-red-600' : ''}`}>{displayLabel('hometownCity')}</div>
          <input name="hometownCity" value={hometownCity} onChange={(e) => setHometownCity(e.target.value)} onBlur={() => applyBlurFormat(fieldLabels.hometownCity, setHometownCity, formatCityName)} className="mt-1 w-full" required />
          <RequiredText show={fieldHasError(fieldLabels.hometownCity)} />
        </label>
        <label className="block">
          <div className={`field-label text-sm font-medium ${fieldHasError(fieldLabels.hometownState) ? 'text-red-600' : ''}`}>{displayLabel('hometownState')}</div>
          <select name="hometownState" value={hometownState} onChange={(e) => setHometownState(e.target.value)} onBlur={() => markTouched(fieldLabels.hometownState)} className="mt-1 w-full" required>
            <option value="">{formPlaceholders.hometownState}</option>
            {usStates.map((state: string) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <RequiredText show={fieldHasError(fieldLabels.hometownState)} />
        </label>
      </div>

      {/* University Website */}
      <label className="block mb-4">
        <div className={`field-label text-sm font-medium ${fieldHasError(fieldLabels.universityWebsite) ? 'text-red-600' : ''}`}>{displayLabel('universityWebsite')}</div>
        <input name="universityWebsite" value={universityWebsite} onChange={(e) => setUniversityWebsite(e.target.value)} onBlur={() => applyBlurFormat(fieldLabels.universityWebsite, setUniversityWebsite, formatUniversityWebsite)} className="mt-1 w-full" placeholder={formContent.universityWebsitePlaceholder} required />
        <RequiredText show={fieldHasError(fieldLabels.universityWebsite)} />
      </label>

      {/* Current Year in School */}
      <label className="block mb-4">
        <div className={`field-label text-sm font-medium ${fieldHasError(fieldLabels.currentYear) ? 'text-red-600' : ''}`}>{displayLabel('currentYear')}</div>
        <select name="currentYear" value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} onBlur={() => markTouched(fieldLabels.currentYear)} className="mt-1 w-full" required>
          <option value="">{formPlaceholders.currentYear}</option>
          {signupFormContent.currentYearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <RequiredText show={fieldHasError(fieldLabels.currentYear)} />
      </label>

      {/* Virginia Resident Radio */}
      <fieldset className="mb-4">
        <div className={`field-label text-sm font-medium mb-2 ${fieldHasError(fieldLabels.isVirginiaResident) ? 'text-red-600' : ''}`}>{displayLabel('isVirginiaResident')}</div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="isVirginiaResident" value="yes" checked={isVirginiaResident === 'yes'} onChange={(e) => setIsVirginiaResident(e.target.value)} onBlur={() => markTouched(fieldLabels.isVirginiaResident)} required />
            <span className="text-sm">{formChoices.yes}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="isVirginiaResident" value="no" checked={isVirginiaResident === 'no'} onChange={(e) => setIsVirginiaResident(e.target.value)} onBlur={() => markTouched(fieldLabels.isVirginiaResident)} required />
            <span className="text-sm">{formChoices.no}</span>
          </label>
        </div>
        <RequiredText show={fieldHasError(fieldLabels.isVirginiaResident)} />
      </fieldset>

      {/* Why interested */}
      <label className="block mb-4">
        <div className={`field-label text-sm font-medium ${fieldHasError(fieldLabels.interestReason) ? 'text-red-600' : ''}`}>{displayLabel('interestReason')}</div>
        <textarea
          name="interestReason"
          value={interestReason}
          onChange={(e) => setInterestReason(e.target.value)}
          onBlur={() => markTouched(fieldLabels.interestReason)}
          className="mt-1 w-full h-24"
          required
        />
        <RequiredText show={fieldHasError(fieldLabels.interestReason)} />
      </label>

      {/* Community support */}
      <label className="block mb-4">
        <div className={`field-label text-sm font-medium ${fieldHasError(fieldLabels.communitySupport) ? 'text-red-600' : ''}`}>{displayLabel('communitySupport')}</div>
        <textarea
          name="communitySupport"
          value={communitySupport}
          onChange={(e) => setCommunitySupport(e.target.value)}
          onBlur={() => markTouched(fieldLabels.communitySupport)}
          className="mt-1 w-full h-24"
          required
        />
        <RequiredText show={fieldHasError(fieldLabels.communitySupport)} />
      </label>

      {/* Interested in Teaching */}
      <fieldset className="mb-4">
        <div className={`field-label text-sm font-medium mb-2 ${fieldHasError(fieldLabels.interestedInTeaching) ? 'text-red-600' : ''}`}>{displayLabel('interestedInTeaching')}</div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="interestedInTeaching" value="Yes" checked={interestedInTeaching === 'Yes'} onChange={(e) => setInterestedInTeaching(e.target.value)} onBlur={() => markTouched(fieldLabels.interestedInTeaching)} required />
            <span className="text-sm">{formChoices.yes}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="interestedInTeaching" value="No" checked={interestedInTeaching === 'No'} onChange={(e) => setInterestedInTeaching(e.target.value)} onBlur={() => markTouched(fieldLabels.interestedInTeaching)} required />
            <span className="text-sm">{formChoices.no}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="interestedInTeaching" value="Maybe" checked={interestedInTeaching === 'Maybe'} onChange={(e) => setInterestedInTeaching(e.target.value)} onBlur={() => markTouched(fieldLabels.interestedInTeaching)} required />
            <span className="text-sm">{formChoices.maybe}</span>
          </label>
        </div>
        <RequiredText show={fieldHasError(fieldLabels.interestedInTeaching)} />
      </fieldset>

      {/* SMS Consent */}
      <div className="mb-4 bg-blue-50 rounded-lg text-sm p-4 border border-blue-100">
        <div className="field-label text-sm font-medium mb-2">{sms.heading}</div>

        <p className="font-semibold text-slate-900 mb-3">{sms.introBold}</p>

        <p className="text-xs text-gray-600 italic mb-4">
          {sms.legalBeforeLink}{' '}
          <a
            href={links.smsPolicy}
            className="underline not-italic font-medium text-slate-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            {sms.policyLinkText}
          </a>
          .
        </p>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="smsConsent"
              value="yes"
              checked={smsConsent === 'yes'}
              onChange={(e) => setSmsConsent(e.target.value)}
            />
            <span className="text-sm">{sms.yesLabel}</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="smsConsent"
              value="no"
              checked={smsConsent === 'no'}
              onChange={(e) => setSmsConsent(e.target.value)}
            />
            <span className="text-sm">{sms.noLabel}</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? formContent.submittingLabel : formContent.submitLabel}
        </button>
        {message && (
          <div className={`text-sm ${message === formMessages.signupSuccess ? 'success-chip' : 'error-chip'}`}>
            {message}
          </div>
        )}
      </div>
    </form>
  )
}
