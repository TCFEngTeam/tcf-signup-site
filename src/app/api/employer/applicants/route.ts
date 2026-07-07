import { NextResponse } from 'next/server'
import { getApplicantsForOpportunities } from '@/lib/hubspot/api'

const ALLOWED_ORIGINS = new Set([
  'https://www-trustedcarefoundation-org.sandbox.hs-sites.com',
  'https://www.trustedcarefoundation.org',
])

const BASE_CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true',
}

export const dynamic = 'force-dynamic';

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

function normalizeOpportunityIds(body: unknown): string[] {
  if (Array.isArray(body)) {
    return body.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
  }

  if (body && typeof body === 'object') {
    const opportunityIds = (body as { opportunityIds?: unknown }).opportunityIds
    if (Array.isArray(opportunityIds)) {
      return opportunityIds.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    }
  }

  return []
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const opportunityIds = normalizeOpportunityIds(body)

    if (opportunityIds.length === 0) {
      return jsonWithCors({ error: 'At least one opportunity ID is required' }, req, { status: 400 })
    }

    const results = await getApplicantsForOpportunities(opportunityIds)
    return jsonWithCors({ success: true, results }, req)
    
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return jsonWithCors({ error: message }, req, { status: 500 })
  }
}
