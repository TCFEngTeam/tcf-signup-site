import { NextResponse } from 'next/server'
import { pagesContent } from '@/lib/content'
import { isTrainingProgramId } from '@/lib/programs/config'
import { lookupUnregisterRegistrations } from '@/lib/unregister/service'
import { checkRateLimit, getClientIp } from '@/lib/unregister/rate-limit'

export const dynamic = 'force-dynamic'

const RATE_LIMIT_MAX = 12
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const program = typeof body?.program === 'string' ? body.program : ''

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!program || !isTrainingProgramId(program)) {
      return NextResponse.json(
        { error: 'Program is required (mhfa or qpr)' },
        { status: 400 }
      )
    }

    const rateKey = `${getClientIp(req)}:lookup:${program}:${email}`
    if (!checkRateLimit(rateKey, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const result = await lookupUnregisterRegistrations({ email, program })

    if (result.status === 'none') {
      return NextResponse.json({
        status: 'none',
        message: pagesContent.unregister.request.noRegistrations,
      })
    }

    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lookup failed'
    console.error('[api/unregister/lookup]', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
