import type { ReactNode } from 'react'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import UnregisterConfirmClient from '@/components/unregister/UnregisterConfirmClient'
import { pagesContent } from '@/lib/content'
import { getTrainingProgram } from '@/lib/programs/config'
import { peekUnregisterToken, resolveUnregisterKind } from '@/lib/unregister/token'
import { loadProgramEventById } from '@/lib/programs/events'
import { getTrainingById } from '@/lib/hubspot/api'
import { trainingsUnregisterPath } from '@/lib/routes'

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
          <Link href={trainingsUnregisterPath()} className="underline">
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

    const kind = resolveUnregisterKind(payload)
    const previewTitle =
      kind === 'waitlist' ? confirm.waitlistPreviewTitle : confirm.previewTitle

    return (
      <ConfirmShell title={previewTitle}>
        <UnregisterConfirmClient
          token={token}
          trainingTitle={trainingTitle}
          programSlug={payload.program}
          programLabel={program?.shortLabel ?? payload.program.toUpperCase()}
          kind={kind}
        />
      </ConfirmShell>
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : confirm.errorFallback

    return (
      <ConfirmShell title={confirm.errorTitle}>
        <p>{message}</p>
        <p className="mt-4">
          <Link href={trainingsUnregisterPath()} className="underline">
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
