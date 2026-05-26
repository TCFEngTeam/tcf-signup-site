"use client"

import React, { useEffect, useState } from 'react'
import { loadProfile, saveProfile } from '@/lib/localProfileStore'

type SignupFormProps = {
  eventId: string
  prefillData?: any
}

export default function EventSignupForm({ eventId, prefillData }: SignupFormProps) {
  const [name, setName] = useState(prefillData?.name ?? '')
  const [email, setEmail] = useState(prefillData?.email ?? '')
  const [phone, setPhone] = useState(prefillData?.phone ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    // Load saved profile if available
    const saved = loadProfile()
    if (saved) {
      setName(saved.name ?? name)
      setEmail(saved.email ?? email)
      setPhone(saved.phone ?? phone)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setSubmitting(true)
    // Save profile locally for future autofill
    saveProfile({ name, email, phone })

    ;(async () => {
      try {
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId, data: { name, email, phone } }),
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
    <form className="event-signup-form" onSubmit={handleSubmit}>
      <label className="block mb-2">
        <div className="text-sm font-medium">Name</div>
        <input name="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full" />
      </label>

      <label className="block mb-2">
        <div className="text-sm font-medium">Email</div>
        <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full" />
      </label>

      <label className="block mb-4">
        <div className="text-sm font-medium">Phone (placeholder)</div>
        <input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full" />
      </label>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={submitting} className="rounded bg-blue-600 px-4 py-2 text-white">
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
        {message && <div className="text-sm text-zinc-700">{message}</div>}
      </div>
    </form>
  )
}
