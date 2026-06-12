'use client'

import { useState } from 'react'
import Link from 'next/link'
import { pagesContent } from '@/lib/content'
import type { UnregisterKind } from '@/lib/unregister/token'

const confirm = pagesContent.unregister.confirm

type UnregisterConfirmClientProps = {
  token: string
  trainingTitle: string
  programSlug: string
  programLabel: string
  kind: UnregisterKind
}

export default function UnregisterConfirmClient({
  token,
  trainingTitle,
  programSlug,
  programLabel,
  kind,
}: UnregisterConfirmClientProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [alreadyCancelled, setAlreadyCancelled] = useState(false)
  const [mode, setMode] = useState<'remove' | 'relabel' | null>(null)

  const isWaitlist = kind === 'waitlist'

  async function handleConfirm() {
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/unregister/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const payload = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(
          payload?.error ??
            (isWaitlist ? confirm.waitlistErrorFallback : confirm.errorFallback)
        )
        return
      }

      setDone(true)
      setAlreadyCancelled(Boolean(payload.alreadyCancelled))
      setMode(payload.mode === 'relabel' ? 'relabel' : 'remove')
    } catch {
      setError(isWaitlist ? confirm.waitlistErrorFallback : confirm.errorFallback)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div>
        <h2 className="text-xl font-semibold" style={{ color: 'var(--dark-green)' }}>
          {alreadyCancelled
            ? isWaitlist
              ? confirm.waitlistAlreadyLeftTitle
              : confirm.alreadyCancelledTitle
            : isWaitlist
              ? confirm.waitlistSuccessTitle
              : confirm.successTitle}
        </h2>
        <p className="mt-3">
          {alreadyCancelled ? (
            isWaitlist ? confirm.waitlistAlreadyLeftBody : confirm.alreadyCancelledBody
          ) : (
            <>
              {isWaitlist ? confirm.waitlistSuccessIntro : confirm.successIntro}{' '}
              <strong>{trainingTitle}</strong>
              {programLabel ? ` (${programLabel})` : ''}.
            </>
          )}
        </p>
        {mode === 'relabel' && !alreadyCancelled ? (
          <p className="mt-3 text-sm helper-text">
            {isWaitlist ? confirm.waitlistRelabelNote : confirm.relabelNote}
          </p>
        ) : null}
        <p className="mt-6">
          <Link href={`/${programSlug}`} className="underline">
            {confirm.viewOtherSessions}
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="mt-3">
        {isWaitlist ? confirm.waitlistPreviewIntro : confirm.previewIntro}{' '}
        <strong>{trainingTitle}</strong>
        {programLabel ? ` (${programLabel})` : ''}.
      </p>

      {error ? (
        <p className="mt-4 text-sm" style={{ color: 'var(--error-red)' }} role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        className="btn-primary mt-6"
        onClick={handleConfirm}
        disabled={submitting}
      >
        {submitting
          ? isWaitlist
            ? confirm.waitlistConfirming
            : confirm.confirming
          : isWaitlist
            ? confirm.waitlistConfirmButton
            : confirm.confirmButton}
      </button>
    </div>
  )
}
