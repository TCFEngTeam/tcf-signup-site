'use client'

import { useMemo, useState } from 'react'
import { formatContent, pagesContent } from '@/lib/content'
import { TRAINING_PROGRAM_LIST, type TrainingProgramId } from '@/lib/programs/config'
import { formatEmail } from '@/lib/signup/format-fields'
import { UNREGISTER_ACK_MESSAGE, type RegistrationOption } from '@/lib/unregister/service'

const request = pagesContent.unregister.request

type UnregisterFormProps = {
  initialProgram?: TrainingProgramId
  initialTrainingId?: string
}

export default function UnregisterForm({
  initialProgram,
  initialTrainingId,
}: UnregisterFormProps) {
  const [email, setEmail] = useState('')
  const [program, setProgram] = useState<TrainingProgramId>(
    initialProgram ?? 'mhfa'
  )
  const [trainingId, setTrainingId] = useState(initialTrainingId ?? '')
  const [sessionOptions, setSessionOptions] = useState<RegistrationOption[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const needsSessionPick = sessionOptions.length > 0
  const programOptions = useMemo(() => TRAINING_PROGRAM_LIST, [])
  const linkExpiryHint = formatContent(request.linkExpiryHint, {
    hours: process.env.NEXT_PUBLIC_UNREGISTER_TOKEN_TTL_HOURS ?? '48',
  })

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setMessage(null)
    setError(null)

    const normalizedEmail = formatEmail(email)
    if (!normalizedEmail) {
      setError(request.invalidEmail)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/unregister/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          program,
          trainingId: trainingId.trim() || undefined,
        }),
      })

      const payload = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(payload?.error ?? request.requestFailed)
        return
      }

      if (payload.status === 'select_training' && Array.isArray(payload.options)) {
        setSessionOptions(payload.options)
        setMessage(payload.message ?? request.selectSession)
        return
      }

      setSessionOptions([])
      setMessage(payload.message ?? UNREGISTER_ACK_MESSAGE)
    } catch {
      setError(request.networkError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="unregister-program" className="block text-sm font-medium">
          {request.programLabel}
        </label>
        <select
          id="unregister-program"
          value={program}
          onChange={(e) => {
            setProgram(e.target.value as TrainingProgramId)
            setSessionOptions([])
            setTrainingId('')
          }}
          className="mt-1 w-full"
          disabled={Boolean(initialProgram) || needsSessionPick}
        >
          {programOptions.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.shortLabel} — {entry.name}
            </option>
          ))}
        </select>
      </div>

      {needsSessionPick ? (
        <div>
          <label htmlFor="unregister-session" className="block text-sm font-medium">
            {request.sessionLabel}
          </label>
          <select
            id="unregister-session"
            value={trainingId}
            onChange={(e) => setTrainingId(e.target.value)}
            className="mt-1 w-full"
            required
          >
            <option value="">{request.sessionPlaceholder}</option>
            {sessionOptions.map((option) => (
              <option key={option.trainingId} value={option.trainingId}>
                {option.title}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <label htmlFor="unregister-email" className="block text-sm font-medium">
          {request.emailLabel}
        </label>
        <input
          id="unregister-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full"
          required
          disabled={needsSessionPick && !trainingId}
        />
        <p className="mt-2 text-sm helper-text">{linkExpiryHint}</p>
      </div>

      {error ? (
        <p className="text-sm" style={{ color: 'var(--error-red)' }} role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-slate-700" role="status">
          {message}
        </p>
      ) : null}

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting
          ? request.submitSending
          : needsSessionPick
            ? request.submitSelectSession
            : request.submitDefault}
      </button>
    </form>
  )
}
