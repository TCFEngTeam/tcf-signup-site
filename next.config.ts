import type { NextConfig } from 'next'
import { legacyTrainingRedirects } from './src/lib/routes'

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return legacyTrainingRedirects()
  },
}

export default nextConfig
