import { NextResponse } from 'next/server'
import { isTrainingProgramId } from '@/lib/programs/config'
import { requestUnregisterEmail } from '@/lib/unregister/service'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = typeof body?.email === 'string' ? body.email : ''
    const program = typeof body?.program === 'string' ? body.program : ''
    const trainingId =
      typeof body?.trainingId === 'string' ? body.trainingId.trim() : undefined

    if (!email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!program || !isTrainingProgramId(program)) {
      return NextResponse.json(
        { error: 'Program is required (mhfa or qpr)' },
        { status: 400 }
      )
    }

    const result = await requestUnregisterEmail({ email, program, trainingId })

    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Request failed'
    console.error('[api/unregister/request]', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
