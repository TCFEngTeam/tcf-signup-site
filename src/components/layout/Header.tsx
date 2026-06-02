import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { siteContent } from '@/lib/content'

export default function Header() {
  const { logo, nav } = siteContent
  const showLogoImage = Boolean(logo.imageSrc?.trim())

  return (
    <header className="site-header">
      <div className="container flex items-center justify-between gap-4">
        {showLogoImage ? (
          <Image
            src={logo.imageSrc}
            alt={logo.imageAlt}
            width={160}
            height={48}
            className="h-10 w-auto"
            priority
          />
        ) : (
          <div className="logo">{logo.text}</div>
        )}
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
