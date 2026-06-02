import React from 'react'
import { siteContent } from '@/lib/content'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">{siteContent.footerText}</div>
    </footer>
  )
}
