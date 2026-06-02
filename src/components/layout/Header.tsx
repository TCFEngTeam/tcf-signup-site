import React from 'react'
import Link from 'next/link'
import { siteContent } from '@/lib/content'

export default function Header() {
  const { logoText, nav } = siteContent

  return (
    <header className="site-header">
      <div className="container">
        <div className="logo">{logoText}</div>
        {nav.length > 0 ? (
          <nav className="flex gap-4">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm underline">
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  )
}
