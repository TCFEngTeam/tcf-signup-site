import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import {
  DEFAULT_SCHEDULE_TIME_ZONE,
  getTrainingEventEndUnix,
  type TrainingSchedule,
} from '@/lib/dates/format-schedule'
import { isTrainingProgramId, type TrainingProgramId } from '@/lib/programs/config'
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
  return Buffer.from(value, 'utf8').toString('base64url')
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(encodedPayload: string) {
  return createHmac('sha256', getUnregisterTokenSecret())
    .update(encodedPayload)
    .digest('base64url')
}

export function resolveUnregisterTokenExpiry(schedule?: TrainingSchedule): number {
  const now = Math.floor(Date.now() / 1000)
  const eventEnd = schedule ? getTrainingEventEndUnix(schedule) : null
  if (eventEnd && eventEnd > now) return eventEnd
  return now + getUnregisterTokenTtlHours() * 60 * 60
}

export function formatUnregisterTokenExpiry(
  exp: number,
  timeZone: string = DEFAULT_SCHEDULE_TIME_ZONE
): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone,
  }).format(new Date(exp * 1000))
}

export function createUnregisterToken(
  payload: Omit<UnregisterTokenPayload, 'exp' | 'jti'>,
  options?: { expiresAt?: number }
) {
  const exp = options?.expiresAt ?? resolveUnregisterTokenExpiry()
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
  const dotIndex = token.lastIndexOf('.')
  if (dotIndex <= 0) {
    throw new Error('Invalid confirmation link')
  }

  const encodedPayload = token.slice(0, dotIndex)
  const signature = token.slice(dotIndex + 1)
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

  if (!isTrainingProgramId(payload.program)) {
    throw new Error('Invalid confirmation link')
  }

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('This confirmation link has expired. Request a new email.')
  }

  return payload
}

/** Validates token shape/expiry without performing HubSpot changes. */
export function peekUnregisterToken(token: string): UnregisterTokenPayload {
  return verifyUnregisterToken(token)
}
