"use client"

import React, { useEffect, useState } from 'react'
import { loadProfile, saveProfile } from '@/lib/localProfileStore'

type SignupFormProps = {
  eventId: string
  prefillData?: any
  submitUrl?: string
}

export default function EventSignupForm({ eventId, prefillData, submitUrl }: SignupFormProps) {
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
  const [smsMarketing, setSmsMarketing] = useState(prefillData?.smsMarketing ?? false)
  const [smsConsent, setSmsConsent] = useState(prefillData?.smsConsent ?? false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    // Load saved profile if available
    const saved = loadProfile()
    if (saved) {
      setFirstName(saved.firstName ?? firstName)
      setLastName(saved.lastName ?? lastName)
      setEmail(saved.email ?? email)
      setPhone(saved.phone ?? phone)
      setHometownCity(saved.hometownCity ?? hometownCity)
      setHometownState(saved.hometownState ?? hometownState)
      setUniversityWebsite(saved.universityWebsite ?? universityWebsite)
      setCurrentYear(saved.currentYear ?? currentYear)
      setIsVirginiaResident(saved.isVirginiaResident ?? isVirginiaResident)
      setInterestReason(saved.interestReason ?? interestReason)
      setCommunitySupport(saved.communitySupport ?? communitySupport)
      setInterestedInTeaching(saved.interestedInTeaching ?? interestedInTeaching)
      setSmsMarketing(saved.smsMarketing ?? smsMarketing)
      setSmsConsent(saved.smsConsent ?? smsConsent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    // Client-side validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() ||
        !hometownCity.trim() || !hometownState.trim() || !universityWebsite.trim() ||
        !currentYear || !isVirginiaResident || !interestReason.trim() ||
        !communitySupport.trim() || !interestedInTeaching) {
      setMessage('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    // Save profile locally for future autofill
    saveProfile({
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
      smsMarketing,
      smsConsent,
    })

    ;(async () => {
      try {
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
              smsMarketing,
              smsConsent,
            },
          }),
        })

        const payload = await res.json()
        if (!res.ok) {
          setMessage(payload?.error ?? 'Failed to signup')
        } else {
          setMessage('Successfully signed up!')
        }
      } catch (err: any) {
        setMessage(err?.message ?? 'Network error')
      } finally {
        setSubmitting(false)
      }
    })()
  }

  return (
    <form className="event-signup-form signup-card" onSubmit={handleSubmit}>
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="block">
          <div className="field-label text-sm font-medium">First Name *</div>
          <input name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 w-full" required />
        </label>
        <label className="block">
          <div className="field-label text-sm font-medium">Last Name *</div>
          <input name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 w-full" required />
        </label>
      </div>

      {/* Contact Fields */}
      <label className="block mb-4">
        <div className="field-label text-sm font-medium">Email *</div>
        <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full" required />
      </label>

      <label className="block mb-4">
        <div className="field-label text-sm font-medium">Phone Number *</div>
        <input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full" required />
      </label>

      {/* Hometown Fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="block">
          <div className="field-label text-sm font-medium">Hometown City *</div>
          <input name="hometownCity" value={hometownCity} onChange={(e) => setHometownCity(e.target.value)} className="mt-1 w-full" required />
        </label>
        <label className="block">
          <div className="field-label text-sm font-medium">Hometown State *</div>
          <input name="hometownState" value={hometownState} onChange={(e) => setHometownState(e.target.value)} className="mt-1 w-full" required />
        </label>
      </div>

      {/* University Website */}
      <label className="block mb-4">
        <div className="field-label text-sm font-medium">University Website *</div>
        <input name="universityWebsite" value={universityWebsite} onChange={(e) => setUniversityWebsite(e.target.value)} className="mt-1 w-full" placeholder="virginia.edu" required />
      </label>

      {/* Current Year in School */}
      <label className="block mb-4">
        <div className="field-label text-sm font-medium">Current Year in School *</div>
        <select name="currentYear" value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} className="mt-1 w-full" required>
          <option value="">Select a year</option>
          <option value="freshman">Freshman</option>
          <option value="sophomore">Sophomore</option>
          <option value="junior">Junior</option>
          <option value="senior">Senior</option>
          <option value="graduate">Graduate</option>
          <option value="other">Other</option>
        </select>
      </label>

      {/* Virginia Resident Radio */}
      <fieldset className="mb-4">
        <div className="field-label text-sm font-medium mb-2">Are you currently a Virginia resident or attending a college in Virginia? *</div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="isVirginiaResident" value="yes" checked={isVirginiaResident === 'yes'} onChange={(e) => setIsVirginiaResident(e.target.value)} required />
            <span className="text-sm">Yes</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="isVirginiaResident" value="no" checked={isVirginiaResident === 'no'} onChange={(e) => setIsVirginiaResident(e.target.value)} required />
            <span className="text-sm">No</span>
          </label>
        </div>
      </fieldset>

      {/* Why interested */}
      <label className="block mb-4">
        <div className="field-label text-sm font-medium">Why are you interested in this event? *</div>
        <textarea name="interestReason" value={interestReason} onChange={(e) => setInterestReason(e.target.value)} className="mt-1 w-full h-24" required />
      </label>

      {/* Community support */}
      <label className="block mb-4">
        <div className="field-label text-sm font-medium">How do you plan to use this event to support others in your community or on your campus? *</div>
        <textarea name="communitySupport" value={communitySupport} onChange={(e) => setCommunitySupport(e.target.value)} className="mt-1 w-full h-24" required />
      </label>

      {/* Interested in Teaching */}
      <fieldset className="mb-4">
        <div className="field-label text-sm font-medium mb-2">Would you be interested in teaching this event to others after completing the training? *</div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="interestedInTeaching" value="yes" checked={interestedInTeaching === 'yes'} onChange={(e) => setInterestedInTeaching(e.target.value)} required />
            <span className="text-sm">Yes</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="interestedInTeaching" value="no" checked={interestedInTeaching === 'no'} onChange={(e) => setInterestedInTeaching(e.target.value)} required />
            <span className="text-sm">No</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="interestedInTeaching" value="maybe" checked={interestedInTeaching === 'maybe'} onChange={(e) => setInterestedInTeaching(e.target.value)} required />
            <span className="text-sm">Maybe</span>
          </label>
        </div>
      </fieldset>

      {/* Consent Checkboxes */}
      <div className="mb-4 p-3 bg-blue-50 rounded text-sm space-y-2">
        <label className="flex items-start gap-2">
          <input type="checkbox" name="smsMarketing" checked={smsMarketing} onChange={(e) => setSmsMarketing(e.target.checked)} className="mt-1 flex-shrink-0" />
          <span>I consent to receive SMS marketing text messages from Trusted Care Foundation. Message frequency varies. Message and data rates may apply. Reply STOP to opt out.</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" name="smsConsent" checked={smsConsent} onChange={(e) => setSmsConsent(e.target.checked)} className="mt-1 flex-shrink-0" />
          <span>I do not consent to receiving marketing messages.</span>
        </label>
        <div className="text-xs text-gray-600 mt-2">
          See our <a href="#" className="underline">SMS Terms</a> and acknowledge the <a href="#" className="underline">SMS Privacy Policy</a>.
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Submitting…' : 'Next Step'}
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
