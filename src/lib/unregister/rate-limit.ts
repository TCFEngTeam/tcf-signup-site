type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

/** Best-effort in-memory rate limit (per server instance). */
export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (bucket.count >= max) {
    return false
  }

  bucket.count += 1
  return true
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}
