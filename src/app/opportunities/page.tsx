import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export const dynamic = 'force-dynamic'

export default function OpportunitiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold">Opportunities</h1>
      </main>

      <Footer />
    </div>
  )
}
