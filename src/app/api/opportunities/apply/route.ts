import { NextResponse } from 'next/server'
import { associateContactToOpportunity, getContactProperty, updateContactProperties } from '@/lib/hubspot/api'

const ALLOWED_ORIGINS = new Set([
  'https://www-trustedcarefoundation-org.sandbox.hs-sites.com',
  'https://www.trustedcarefoundation.org',
])

const BASE_CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true',
}

const ALLOWED_PROPERTIES = new Set([
  'firstname',
  'lastname',
  'phone',
  'email',
  'hometown_city',
  'hometown_state',
  'college_major',
  'current_year_in_school',
  'why_are_you_interested_in_this_role_',
])

const WHY_PROPERTY = 'why_are_you_interested_in_this_role_'

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

function getSourcePayload(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {}
  }

  const record = body as Record<string, unknown>
  const nestedProperties = record.properties

  return nestedProperties &&
    typeof nestedProperties === 'object' &&
    !Array.isArray(nestedProperties)
    ? (nestedProperties as Record<string, unknown>)
    : record
}

function normalizeProperties(body: unknown) {
  const source = getSourcePayload(body)

  const properties: Record<string, string> = {}

  for (const key of ALLOWED_PROPERTIES) {
    if (key === WHY_PROPERTY) {
      continue
    }

    const value = source[key];
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      properties[key] = String(value)
    }
  }

  return properties
}

function buildWhyPropertyValue(opportunityId: string, answer: unknown, oldValue: unknown) {
  const parsedExisting: Record<string, string> = {}

  if (typeof oldValue === 'string' && oldValue.trim()) {
    try {
      const parsed = JSON.parse(oldValue)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        for (const [key, value] of Object.entries(parsed)) {
          if (typeof value === 'string') {
            parsedExisting[key] = value
          }
        }
      }
    } catch {
      // Ignore invalid JSON and start from an empty object.
    }
  }

  if (typeof answer === 'string' && answer.trim()) {
    parsedExisting[opportunityId] = answer
  }

  return JSON.stringify(parsedExisting)
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
    const body = await req.json();
    const contactId = typeof body?.contactId === 'string' ? body.contactId.trim() : undefined;
    const opportunityId = typeof body?.opportunityId === 'string' ? body.opportunityId.trim() : undefined;
    const properties = normalizeProperties(body);

    if (!contactId) {
      return jsonWithCors({ error: 'Missing contactId' }, req, { status: 400 })
    }

    if (!opportunityId) {
      return jsonWithCors({ error: 'Missing opportunityId' }, req, { status: 400 })
    }

    const source = body && typeof body === 'object' && !Array.isArray(body)
      ? getSourcePayload(body)
      : {}

    const answer = source[WHY_PROPERTY]
    const oldInterestReasons = await getContactProperty(contactId, WHY_PROPERTY)

    if (answer !== undefined && answer !== null) {
      properties[WHY_PROPERTY] = buildWhyPropertyValue(opportunityId, answer, oldInterestReasons)
    }

    if (!properties || Object.keys(properties).length === 0) {
      return jsonWithCors({ error: 'Missing or invalid properties' }, req, { status: 400 })
    }

    await updateContactProperties(contactId, properties)
    await associateContactToOpportunity(contactId, opportunityId, "USER_DEFINED", 41);
    await associateContactToOpportunity(contactId, opportunityId, "USER_DEFINED", 19);
    return jsonWithCors({ success: true }, req)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = message === 'Contact not found' ? 404 : 500
    return jsonWithCors({ error: message }, req, { status })
  }
}
