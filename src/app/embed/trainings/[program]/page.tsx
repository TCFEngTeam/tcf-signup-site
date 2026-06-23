import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProgramListingEmbed from '@/components/events/ProgramListingEmbed'
import { fetchEventsForProgram } from '@/lib/programs/fetch'
import { getTrainingProgram } from '@/lib/programs/config'

export const dynamic = 'force-dynamic'

type EmbedProgramPageProps = {
  params: Promise<{ program: string }>
}

export function generateStaticParams() {
  return [{ program: 'mhfa' }, { program: 'qpr' }]
}

export async function generateMetadata({ params }: EmbedProgramPageProps): Promise<Metadata> {
  const { program: programSlug } = await params
  const program = getTrainingProgram(programSlug)

  return {
    title: program ? `${program.shortLabel} sessions` : 'Training sessions',
    robots: { index: false, follow: false },
  }
}

export default async function EmbedProgramPage({ params }: EmbedProgramPageProps) {
  const { program: programSlug } = await params
  const program = getTrainingProgram(programSlug)

  if (!program) {
    notFound()
  }

  const { events, error } = await fetchEventsForProgram(program.id)

  return <ProgramListingEmbed program={program} events={events} error={error} />
}
