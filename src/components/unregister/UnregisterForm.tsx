'use client'

import { useMemo, useState } from 'react'
import { pagesContent } from '@/lib/content'
import { TRAINING_PROGRAM_LIST, type TrainingProgramId } from '@/lib/programs/config'
import { formatEmail } from '@/lib/signup/format-fields'
import { UNREGISTER_ACK_MESSAGE, type RegistrationOption } from '@/lib/unregister/service'

const request = pagesContent.unregister.request

type FormPhase = 'enter_email' | 'select_session' | 'sent'

type UnregisterFormProps = {
  initialProgram?: TrainingProgramId
  initialTrainingId?: string
}

export default function UnregisterForm({
  initialProgram,
  initialTrainingId,
}: UnregisterFormProps) {
  const [phase, setPhase] = useState<FormPhase>('enter_email')
  const [email, setEmail] = useState('')
  const [checkedEmail, setCheckedEmail] = useState('')
  const [program, setProgram] = useState<TrainingProgramId>(
    initialProgram ?? 'mhfa'
  )
  const [trainingId, setTrainingId] = useState(initialTrainingId ?? '')
  const [sessionOptions, setSessionOptions] = useState<RegistrationOption[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const programOptions = useMemo(() => TRAINING_PROGRAM_LIST, [])

  function resetToEmailStep() {
    setPhase('enter_email')
    setCheckedEmail('')
    setSessionOptions([])
    setTrainingId('')
    setMessage(null)
    setError(null)
  }

  async function handleCheckRegistrations(event: React.FormEvent) {
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
      const res = await fetch('/api/unregister/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          program,
        }),
      })

      const payload = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(payload?.error ?? request.requestFailed)
        return
      }

      if (payload.status === 'found' && Array.isArray(payload.options)) {
        setCheckedEmail(normalizedEmail)
        setSessionOptions(payload.options)

        const preferredId =
          initialTrainingId &&
          payload.options.some(
            (option: RegistrationOption) => option.trainingId === initialTrainingId
          )
            ? initialTrainingId
            : payload.options.length === 1
              ? payload.options[0].trainingId
              : ''

        setTrainingId(preferredId)
        setPhase('select_session')
        setMessage(request.selectSession)
        return
      }

      setMessage(payload.message ?? request.noRegistrations)
    } catch {
      setError(request.networkError)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSendConfirmation(event: React.FormEvent) {
    event.preventDefault()
    setMessage(null)
    setError(null)

    if (!trainingId) {
      setError(request.sessionRequired)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/unregister/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: checkedEmail,
          program,
          trainingId,
        }),
      })

      const payload = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(payload?.error ?? request.requestFailed)
        return
      }

      setPhase('sent')
      setMessage(payload.message ?? UNREGISTER_ACK_MESSAGE)
    } catch {
      setError(request.networkError)
    } finally {
      setSubmitting(false)
    }
  }

  const isSelectingSession = phase === 'select_session'
  const isSent = phase === 'sent'

  return (
    <form
      onSubmit={isSelectingSession ? handleSendConfirmation : handleCheckRegistrations}
      className="space-y-5"
    >
      <div>
        <label htmlFor="unregister-program" className="block text-sm font-medium">
          {request.programLabel}
        </label>
        <select
          id="unregister-program"
          value={program}
          onChange={(e) => {
            setProgram(e.target.value as TrainingProgramId)
            resetToEmailStep()
          }}
          className="mt-1 w-full"
          disabled={Boolean(initialProgram) || isSelectingSession || isSent}
        >
          {programOptions.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.shortLabel} — {entry.name}
            </option>
          ))}
        </select>
      </div>

      {isSelectingSession || isSent ? (
        <>
          <div>
            <div className="text-sm font-medium">{request.checkedEmailLabel}</div>
            <p className="mt-1 text-sm text-slate-800">{checkedEmail}</p>
            {!isSent ? (
              <button
                type="button"
                className="mt-2 text-sm underline text-slate-700"
                onClick={resetToEmailStep}
              >
                {request.changeEmail}
              </button>
            ) : null}
          </div>

          {!isSent ? (
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
              <p className="mt-2 text-sm helper-text">{request.linkExpiryHint}</p>
            </div>
          ) : null}
        </>
      ) : (
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
          />
        </div>
      )}

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

      {isSent ? (
        <button type="button" className="btn-primary" onClick={resetToEmailStep}>
          {request.startOver}
        </button>
      ) : (
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting
            ? isSelectingSession
              ? request.submitSending
              : request.submitChecking
            : isSelectingSession
              ? request.submitSendEmail
              : request.submitCheck}
        </button>
      )}
    </form>
  )
}
