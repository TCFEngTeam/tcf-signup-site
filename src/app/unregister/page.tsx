import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import UnregisterForm from '@/components/unregister/UnregisterForm'
import { pagesContent } from '@/lib/content'
import { isTrainingProgramId, type TrainingProgramId } from '@/lib/programs/config'

const page = pagesContent.unregister.page

export const dynamic = 'force-dynamic'

type UnregisterPageProps = {
  searchParams: Promise<{
    program?: string
    eventId?: string
  }>
}

export default async function UnregisterPage({ searchParams }: UnregisterPageProps) {
  const params = await searchParams
  const programParam = params.program ?? ''
  const initialProgram: TrainingProgramId | undefined = isTrainingProgramId(programParam)
    ? programParam
    : undefined
  const initialTrainingId = params.eventId?.trim() || undefined

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-10">
        <div className="max-w-lg mx-auto section-panel">
          <div className="page-hero">
            <div className="eyebrow">{page.eyebrow}</div>
            <h1 className="text-3xl font-bold page-title">{page.title}</h1>
            <p className="helper-text">{page.intro}</p>
          </div>

          <div className="mt-8">
            <UnregisterForm
              initialProgram={initialProgram}
              initialTrainingId={initialTrainingId}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
