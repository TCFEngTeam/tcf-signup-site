import type { ReactNode } from 'react'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import UnregisterConfirmClient from '@/components/unregister/UnregisterConfirmClient'
import { pagesContent } from '@/lib/content'
import { getTrainingProgram } from '@/lib/programs/config'
import { peekUnregisterToken } from '@/lib/unregister/token'
import { loadProgramEventById } from '@/lib/programs/events'
import { getTrainingById } from '@/lib/hubspot/api'

const confirm = pagesContent.unregister.confirm

export const dynamic = 'force-dynamic'

type ConfirmPageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function UnregisterConfirmPage({ searchParams }: ConfirmPageProps) {
  const { token } = await searchParams

  if (!token?.trim()) {
    return (
      <ConfirmShell title={confirm.invalidLinkTitle}>
        <p>{confirm.invalidLinkBody}</p>
        <p className="mt-4">
          <Link href="/unregister" className="underline">
            {confirm.requestNewLink}
          </Link>
        </p>
      </ConfirmShell>
    )
  }

  try {
    const payload = peekUnregisterToken(token)
    const program = getTrainingProgram(payload.program)
    const { event } = await loadProgramEventById(payload.program, payload.trainingId)

    let trainingTitle = event?.title
    if (!trainingTitle) {
      const training = await getTrainingById(payload.trainingId)
      trainingTitle =
        training?.properties.hs_course_name ||
        training?.properties.name ||
        pagesContent.unregister.confirm.fallbackSessionTitle
    }

    return (
      <ConfirmShell title={confirm.previewTitle}>
        <UnregisterConfirmClient
          token={token}
          trainingTitle={trainingTitle}
          programSlug={payload.program}
          programLabel={program?.shortLabel ?? payload.program.toUpperCase()}
        />
      </ConfirmShell>
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : confirm.errorFallback

    return (
      <ConfirmShell title={confirm.errorTitle}>
        <p>{message}</p>
        <p className="mt-4">
          <Link href="/unregister" className="underline">
            {confirm.requestNewLink}
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
