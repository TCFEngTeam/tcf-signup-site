import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import type { TrainingProgramId } from '@/lib/programs/config'
import { getUnregisterTokenSecret, getUnregisterTokenTtlHours } from '@/lib/unregister/config'

export type UnregisterTokenPayload = {
  /** Random id — new value per email so links are not guessable or repeatable. */
  jti: string
  email: string
  program: TrainingProgramId
  trainingId: string
  exp: number
}

function createTokenJti() {
  return randomBytes(32).toString('base64url')
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8')
    .toString('base64url')
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(encodedPayload: string) {
  return createHmac('sha256', getUnregisterTokenSecret())
    .update(encodedPayload)
    .digest('base64url')
}

export function createUnregisterToken(
  payload: Omit<UnregisterTokenPayload, 'exp' | 'jti'>
) {
  const exp =
    Math.floor(Date.now() / 1000) + getUnregisterTokenTtlHours() * 60 * 60
  const body: UnregisterTokenPayload = {
    ...payload,
    jti: createTokenJti(),
    exp,
  }
  const encodedPayload = base64UrlEncode(JSON.stringify(body))
  const signature = sign(encodedPayload)
  return `${encodedPayload}.${signature}`
}

export function verifyUnregisterToken(token: string): UnregisterTokenPayload {
  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) {
    throw new Error('Invalid confirmation link')
  }

  const expected = sign(encodedPayload)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error('Invalid confirmation link')
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as UnregisterTokenPayload
  if (
    !payload?.jti ||
    typeof payload.jti !== 'string' ||
    payload.jti.length < 16 ||
    !payload?.email ||
    !payload?.program ||
    !payload?.trainingId ||
    !payload?.exp
  ) {
    throw new Error('Invalid confirmation link')
  }

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('This confirmation link has expired. Request a new email.')
  }

  return payload
}
