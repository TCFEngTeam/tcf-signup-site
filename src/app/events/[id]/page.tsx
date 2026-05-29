import { redirect } from 'next/navigation'

type LegacyEventPageProps = {
  params: Promise<{ id: string }>
}

export default async function LegacyEventPage({ params }: LegacyEventPageProps) {
  await params
  redirect('/')
}
