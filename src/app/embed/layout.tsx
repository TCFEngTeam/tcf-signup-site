import type { Metadata } from 'next'
import { Lato } from 'next/font/google'

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <div className={`embed-root ${lato.className}`}>{children}</div>
}
