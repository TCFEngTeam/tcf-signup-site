import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function Home() {
  redirect('https://www.trustedcarefoundation.org/youth-mental-health-program')
}
