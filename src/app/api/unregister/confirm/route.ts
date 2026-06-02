import { NextResponse } from 'next/server'
import { confirmUnregister } from '@/lib/unregister/service'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const token =
      (typeof body?.token === 'string' ? body.token : '') ||
      new URL(req.url).searchParams.get('token') ||
      ''

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const result = await confirmUnregister(token)
    return NextResponse.json({ success: true, ...result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Confirmation failed'
    console.error('[api/unregister/confirm]', error)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  try {
    const result = await confirmUnregister(token)
    return NextResponse.json({ success: true, ...result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Confirmation failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
