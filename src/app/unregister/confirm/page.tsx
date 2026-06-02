import type { ReactNode } from 'react'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { confirmUnregister } from '@/lib/unregister/service'
import { getTrainingProgram } from '@/lib/programs/config'

export const dynamic = 'force-dynamic'

type ConfirmPageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function UnregisterConfirmPage({ searchParams }: ConfirmPageProps) {
  const { token } = await searchParams

  if (!token?.trim()) {
    return (
      <ConfirmShell title="Invalid link">
        <p>This confirmation link is missing or invalid.</p>
        <p className="mt-4">
          <Link href="/unregister" className="underline">
            Request a new cancellation link
          </Link>
        </p>
      </ConfirmShell>
    )
  }

  try {
    const result = await confirmUnregister(token)
    const program = getTrainingProgram(result.program)

    return (
      <ConfirmShell title="Registration cancelled">
        <p>
          You are no longer registered for{' '}
          <strong>{result.trainingTitle}</strong>
          {program ? ` (${program.shortLabel})` : ''}.
        </p>
        {result.mode === 'relabel' ? (
          <p className="mt-3 text-sm helper-text">
            Your registration was marked as cancelled in our system (audit record kept).
          </p>
        ) : null}
        <p className="mt-6">
          <Link href={`/${result.program}`} className="underline">
            View other sessions
          </Link>
        </p>
      </ConfirmShell>
    )
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Could not confirm cancellation.'

    return (
      <ConfirmShell title="Could not confirm">
        <p>{message}</p>
        <p className="mt-4">
          <Link href="/unregister" className="underline">
            Request a new cancellation link
          </Link>
        </p>
      </ConfirmShell>
    )
  }
}

function ConfirmShell({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />
      <main className="container mx-auto px-6 py-10">
        <div className="max-w-lg mx-auto section-panel">
          <h1 className="text-2xl font-bold page-title">{title}</h1>
          <div className="mt-4 text-slate-800">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
