import { notFound } from 'next/navigation'
import ProgramListing from '@/components/events/ProgramListing'
import { fetchEventsForProgram } from '@/lib/programs/fetch'
import { getTrainingProgram } from '@/lib/programs/config'

type ProgramPageProps = {
  params: Promise<{ program: string }>
}

export function generateStaticParams() {
  return [{ program: 'mhfa' }, { program: 'qpr' }]
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { program: programSlug } = await params
  const program = getTrainingProgram(programSlug)

  if (!program) {
    notFound()
  }

  const { events, error } = await fetchEventsForProgram(program.id)

  return <ProgramListing program={program} events={events} error={error} />
}
