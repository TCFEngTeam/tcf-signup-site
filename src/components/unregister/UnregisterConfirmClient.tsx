'use client'

import { useState } from 'react'
import Link from 'next/link'
import { pagesContent } from '@/lib/content'

const confirm = pagesContent.unregister.confirm

type UnregisterConfirmClientProps = {
  token: string
  trainingTitle: string
  programSlug: string
  programLabel: string
}

export default function UnregisterConfirmClient({
  token,
  trainingTitle,
  programSlug,
  programLabel,
}: UnregisterConfirmClientProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [alreadyCancelled, setAlreadyCancelled] = useState(false)
  const [mode, setMode] = useState<'remove' | 'relabel' | null>(null)

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
        setError(payload?.error ?? confirm.errorFallback)
        return
      }

      setDone(true)
      setAlreadyCancelled(Boolean(payload.alreadyCancelled))
      setMode(payload.mode === 'relabel' ? 'relabel' : 'remove')
    } catch {
      setError(confirm.errorFallback)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div>
        <h2 className="text-xl font-semibold" style={{ color: 'var(--dark-green)' }}>
          {alreadyCancelled ? confirm.alreadyCancelledTitle : confirm.successTitle}
        </h2>
        <p className="mt-3">
          {alreadyCancelled ? (
            confirm.alreadyCancelledBody
          ) : (
            <>
              {confirm.successIntro}{' '}
              <strong>{trainingTitle}</strong>
              {programLabel ? ` (${programLabel})` : ''}.
            </>
          )}
        </p>
        {mode === 'relabel' && !alreadyCancelled ? (
          <p className="mt-3 text-sm helper-text">{confirm.relabelNote}</p>
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
      <h2 className="text-xl font-semibold" style={{ color: 'var(--dark-green)' }}>
        {confirm.previewTitle}
      </h2>
      <p className="mt-3">
        {confirm.previewIntro}{' '}
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
        {submitting ? confirm.confirming : confirm.confirmButton}
      </button>
    </div>
  )
}
