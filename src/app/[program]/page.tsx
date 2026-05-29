import { notFound } from 'next/navigation'
import ProgramListing from '@/app/components/ProgramListing'
import { fetchEventsForProgram } from '@/lib/fetchProgramEvents'
import { getTrainingProgram } from '@/lib/trainingPrograms'

type ProgramPageProps = {
  params: Promise<{ program: string }>
}

export function generateStaticParams() {
  return [{ program: 'mhfa' }, { program: 'qpa' }]
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
