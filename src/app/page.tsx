import { redirect } from 'next/navigation'
import { siteContent } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default function Home() {
  redirect(siteContent.homeRedirectUrl)
}
