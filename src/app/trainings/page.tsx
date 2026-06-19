import { redirect } from 'next/navigation'
import { siteContent } from '@/lib/content'

export const dynamic = 'force-dynamic'

/** Former home redirect — TCF youth mental health program page on the main site. */
export default function TrainingsIndexPage() {
  redirect(siteContent.mainSiteUrl)
}
