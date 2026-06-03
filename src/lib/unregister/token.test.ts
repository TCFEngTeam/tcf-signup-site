import { createHmac } from 'crypto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createUnregisterToken, verifyUnregisterToken } from '@/lib/unregister/token'

describe('unregister token', () => {
  beforeEach(() => {
    process.env.UNREGISTER_TOKEN_SECRET = 'test-secret-for-unregister-tokens'
    process.env.UNREGISTER_TOKEN_TTL_HOURS = '1'
  })

  afterEach(() => {
    delete process.env.UNREGISTER_TOKEN_SECRET
    delete process.env.UNREGISTER_TOKEN_TTL_HOURS
  })

  it('round-trips a valid token', () => {
    const token = createUnregisterToken({
      email: 'user@example.com',
      program: 'mhfa',
      trainingId: '999',
    })
    const payload = verifyUnregisterToken(token)
    expect(payload.email).toBe('user@example.com')
    expect(payload.program).toBe('mhfa')
    expect(payload.trainingId).toBe('999')
  })

  it('issues a unique random jti per token', () => {
    const input = {
      email: 'user@example.com',
      program: 'mhfa' as const,
      trainingId: '999',
    }
    const a = createUnregisterToken(input)
    const b = createUnregisterToken(input)
    expect(a).not.toBe(b)
    expect(verifyUnregisterToken(a).jti).not.toBe(verifyUnregisterToken(b).jti)
  })

  it('rejects tampered tokens', () => {
    const token = createUnregisterToken({
      email: 'user@example.com',
      program: 'qpr',
      trainingId: '1',
    })
    expect(() => verifyUnregisterToken(`${token}x`)).toThrow()
  })

  it('rejects invalid program in payload', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600
    const body = {
      jti: 'a'.repeat(32),
      email: 'user@example.com',
      program: 'invalid',
      trainingId: '1',
      exp,
    }
    const encoded = Buffer.from(JSON.stringify(body), 'utf8').toString('base64url')
    const signature = createHmac('sha256', process.env.UNREGISTER_TOKEN_SECRET!)
      .update(encoded)
      .digest('base64url')

    expect(() => verifyUnregisterToken(`${encoded}.${signature}`)).toThrow()
  })
})
