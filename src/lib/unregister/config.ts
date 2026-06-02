export type UnregisterHubSpotMode = 'remove' | 'relabel'

export function getUnregisterHubSpotMode(): UnregisterHubSpotMode {
  const mode = process.env.UNREGISTER_HUBSPOT_MODE?.trim().toLowerCase()
  return mode === 'relabel' ? 'relabel' : 'remove'
}

export function getUnregisterTokenSecret(): string {
  const secret = process.env.UNREGISTER_TOKEN_SECRET?.trim()
  if (!secret) {
    throw new Error(
      'UNREGISTER_TOKEN_SECRET is not set. Add a long random string to .env.local and Vercel.'
    )
  }
  return secret
}

export function getUnregisterTokenTtlHours(): number {
  const raw = process.env.UNREGISTER_TOKEN_TTL_HOURS?.trim()
  const hours = raw ? Number.parseInt(raw, 10) : 48
  return Number.isFinite(hours) && hours > 0 ? hours : 48
}
