import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { TRAINING_PROGRAM_LIST } from '@/lib/programs/config'

/**
 * Former root page: MHFA / QPR program chooser.
 * Not routed — archived for optional restore. See README.md in this folder.
 */
export default function ProgramChooserHome() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-10">
        <div className="max-w-2xl mx-auto section-panel">
          <div className="page-hero">
            <div className="eyebrow">Trusted Care Foundation</div>
            <h1 className="text-3xl font-bold page-title">Training Sign Up</h1>
            <p className="helper-text">
              Choose a program to view upcoming sessions and register. This page is a placeholder
              layout and can be replaced with final marketing content later.
            </p>
          </div>

          <div className="grid gap-4 mt-8">
            {TRAINING_PROGRAM_LIST.map((program) => (
              <Link
                key={program.id}
                href={`/${program.slug}`}
                className="block rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <div className="text-sm font-semibold uppercase tracking-wide text-green-800">
                  {program.shortLabel}
                </div>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">{program.name}</h2>
                <p className="mt-2 text-sm text-slate-700">{program.listingIntro[0]}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-blue-800">
                  View sessions →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
