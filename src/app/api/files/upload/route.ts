import { NextResponse } from 'next/server'
import { uploadFileToHubSpot } from '@/lib/hubspot/api'

const ALLOWED_ORIGINS = new Set([
  'https://www-trustedcarefoundation-org.sandbox.hs-sites.com',
  'https://www.trustedcarefoundation.org',
])

const BASE_CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true',
}

export const dynamic = 'force-dynamic'

function getAllowedOrigin(req: Request) {
  const origin = req.headers.get('origin')
  return origin && ALLOWED_ORIGINS.has(origin) ? origin : null
}

function jsonWithCors(body: unknown, req: Request, init?: ResponseInit) {
  const allowedOrigin = getAllowedOrigin(req)
  return NextResponse.json(body, {
    ...init,
    headers: {
      ...(allowedOrigin ? { 'Access-Control-Allow-Origin': allowedOrigin } : {}),
      ...BASE_CORS_HEADERS,
      ...(init?.headers as Record<string, string> | undefined),
    },
  })
}

export function OPTIONS(req: Request) {
  const allowedOrigin = getAllowedOrigin(req)
  return new Response(null, {
    status: 204,
    headers: {
      ...(allowedOrigin ? { 'Access-Control-Allow-Origin': allowedOrigin } : {}),
      ...BASE_CORS_HEADERS,
    },
  })
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    if (!file) {
      return jsonWithCors({ error: 'No file provided' }, req, { status: 400 })
    }
    const url = await uploadFileToHubSpot(formData)
    return jsonWithCors({ success: true, url }, req)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return jsonWithCors({ error: message }, req, { status: 500 })
  }
}