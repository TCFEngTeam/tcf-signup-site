/**
 * HubSpot API utilities for contact creation and association.
 * This is a framework implementation - property names and association details
 * should be configured in .env.local
 */

const HUBSPOT_API_BASE = 'https://api.hubapi.com'
const API_KEY = process.env.HUBSPOT_API_KEY

if (!API_KEY) {
  console.warn('HUBSPOT_API_KEY is not set in environment variables')
}

export interface ContactData {
  firstName: string
  lastName: string
  email: string
  phone: string
  hometownCity: string
  hometownState: string
  universityWebsite: string
  currentYear: string
  isVirginiaResident: string
  trainingDates: string
  interestReason: string
  communitySupport: string
  interestedInTeaching: string
}

export interface HubSpotContact {
  id: string
  properties: {
    [key: string]: string
  }
}

export interface HubSpotTraining {
  id: string
  properties: {
    [key: string]: string
  }
}

export interface TrainingEvent {
  id: string
  title: string
  startDate?: string
  endDate?: string
  location: string
  capacity: number
  registered: number
  availableCapacity: number
  active: boolean
  description?: string
}

function parseDateProperty(value?: string) {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDateLabel(value?: string) {
  if (!value) return ''

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parsed)
}

export function formatTrainingSchedule(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return 'Date to be announced'

  if (startDate && endDate) {
    const formattedStart = formatDateLabel(startDate)
    const formattedEnd = formatDateLabel(endDate)

    if (formattedStart && formattedStart === formattedEnd) {
      return formattedStart
    }

    if (formattedStart && formattedEnd) {
      return `${formattedStart} – ${formattedEnd}`
    }

    if (startDate === endDate) {
      return formatDateLabel(startDate)
    }

    return `${formatDateLabel(startDate) || startDate} – ${formatDateLabel(endDate) || endDate}`
  }

  return formatDateLabel(startDate || endDate) || startDate || endDate || 'Date to be announced'
}

/**
 * Maps form data to HubSpot contact properties using environment variables
 */
function mapContactProperties(data: ContactData): { [key: string]: string } {
  return {
    [process.env.HUBSPOT_FIRST_NAME_PROPERTY || 'firstname']: data.firstName,
    [process.env.HUBSPOT_LAST_NAME_PROPERTY || 'lastname']: data.lastName,
    [process.env.HUBSPOT_EMAIL_PROPERTY || 'email']: data.email,
    [process.env.HUBSPOT_PHONE_PROPERTY || 'phone']: data.phone,
    [process.env.HUBSPOT_HOMETOWN_CITY_PROPERTY || 'hometown_city']: data.hometownCity,
    [process.env.HUBSPOT_HOMETOWN_STATE_PROPERTY || 'hometown_state']: data.hometownState,
    // TODO: University website should be stored on the company object instead of the contact.
    // [process.env.HUBSPOT_UNIVERSITY_WEBSITE_PROPERTY || 'university_website']: data.universityWebsite,
    [process.env.HUBSPOT_CURRENT_YEAR_PROPERTY || 'current_year_in_school']: data.currentYear,
    [process.env.HUBSPOT_VIRGINIA_RESIDENT_PROPERTY || 'virginia_resident']: data.isVirginiaResident,
    [process.env.HUBSPOT_INTEREST_REASON_PROPERTY || 'interest_reason']: data.interestReason,
    [process.env.HUBSPOT_COMMUNITY_SUPPORT_PROPERTY || 'community_support_plan']: data.communitySupport,
    [process.env.HUBSPOT_TEACHING_INTEREST_PROPERTY || 'interested_in_teaching']: data.interestedInTeaching,
  }
}

async function safeParseResponse(res: Response): Promise<any> {
  // Read text and attempt JSON.parse; return null for empty bodies
  let text = ''
  try {
    text = await res.text()
  } catch (e) {
    return null
  }
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch (e) {
    return { text }
  }
}

/**
 * Create or update a contact in HubSpot by email
 * @param data Form submission data
 * @returns HubSpot contact with ID
 */
export async function createOrUpdateContact(data: ContactData): Promise<HubSpotContact> {
  if (!API_KEY) {
    throw new Error('HUBSPOT_API_KEY is not configured')
  }

  const properties = mapContactProperties(data)
  const existing = await getContactByEmail(data.email)

  if (existing?.id) {
    const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${existing.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties,
      }),
    })

    if (!response.ok) {
      const error = await safeParseResponse(response)
      const msg = (error && (error.message || error.error || error.text)) || response.statusText
      throw new Error(`HubSpot API error: ${msg}`)
    }

    const parsed = await safeParseResponse(response)
    return parsed ?? { id: existing.id }
  }

  const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties,
    }),
  })

  if (!response.ok) {
    const error = await safeParseResponse(response)
    const msg = (error && (error.message || error.error || error.text)) || response.statusText
    throw new Error(`HubSpot API error: ${msg}`)
  }

  const parsed = await safeParseResponse(response)
  return parsed
}

/**
 * Associate a contact with a training event
 * @param contactId HubSpot contact ID
 * @param trainingId Training event ID (e.g., from eventId in form data)
 */
export async function associateContactToTraining(contactId: string, trainingId: string): Promise<void> {
  if (!API_KEY) {
    throw new Error('HUBSPOT_API_KEY is not configured')
  }

  const associationLabel = process.env.HUBSPOT_TRAINING_ASSOCIATION_LABEL || 'training_signup'

  const response = await fetch(
    `${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${contactId}/associations/training/${trainingId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        associationCategory: 'HUBSPOT_DEFINED',
        associationTypeId: associationLabel,
      }),
    }
  )

  if (!response.ok) {
    const error = await safeParseResponse(response)
    console.error('Association error:', error)
    const msg = (error && (error.message || error.error || error.text)) || response.statusText
    throw new Error(`Failed to associate contact with training: ${msg}`)
  }
}

/**
 * Get an existing contact by email
 * @param email Contact email
 * @returns HubSpot contact or null if not found
 */
export async function getContactByEmail(email: string): Promise<HubSpotContact | null> {
  if (!API_KEY) {
    throw new Error('HUBSPOT_API_KEY is not configured')
  }

  const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: 'EQ',
              value: email,
            },
          ],
        },
      ],
      properties: ['email'],
      limit: 1,
    }),
  })

  if (!response.ok) {
    const error = await safeParseResponse(response)
    const msg = (error && (error.message || error.error || error.text)) || response.statusText
    throw new Error(`HubSpot API error: ${msg}`)
  }

  const data = await safeParseResponse(response)
  return data?.results?.[0] ?? null
}

/**
 * Fetch training objects from HubSpot filtered by pipeline stage.
 * The stage is matched against the custom object property `hs_pipeline`.
 *
 * @param pipelineStage The exact stage name from .env.local (for example, "Accepting Applications")
 * @param pipelineType The exact pipeline stage name from .env.local
 * @returns Array of training objects from HubSpot
 */
export async function getTrainingObjects(pipelineStage?: string, pipelineType?: string): Promise<HubSpotTraining[]> {
  if (!API_KEY) {
    throw new Error('HUBSPOT_API_KEY is not configured')
  }

  const limit = 100
  let allResults: HubSpotTraining[] = []
  let after: string | null = null
  const requestedProperties = (
    process.env.HUBSPOT_TRAINING_PROPERTIES ||
    'hs_pipeline,hs_pipeline_stage,start_date,end_date,available_capacity,name,location,capacity,description'
  )
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  try {
    const objectType = process.env.HUBSPOT_TRAINING_OBJECT_ID || '0-410'

    do {
      const url = new URL(`${HUBSPOT_API_BASE}/crm/v3/objects/${objectType}`)
      url.searchParams.set('limit', limit.toString())
      url.searchParams.set('properties', requestedProperties.join(','))
      if (after) url.searchParams.set('after', after)

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        let bodyText = ''
        try {
          bodyText = await response.text()
        } catch {
          bodyText = response.statusText
        }
        throw new Error(`HubSpot API error: ${response.status} ${bodyText}`)
      }

      const data = await response.json()
      allResults = allResults.concat(data.results || [])
      after = data.paging?.next?.after || null
    } while (after)

    // console.log(allResults)

    console.debug('[hubspotApi] raw training objects fetched', {
      objectType,
      pipelineStage,
      pipelineType,
      requestedProperties,
      count: allResults.length,
      sampleProperties: allResults[0]?.properties ? Object.keys(allResults[0].properties).slice(0, 20) : [],
      sampleHsPipeline: allResults[0]?.properties?.hs_pipeline,
    })

    if (pipelineType) {
        const targetStage = pipelineType.trim()
        allResults = allResults.filter((training) => {
            const stage = (training.properties?.hs_pipeline ?? '').trim()
            //console.debug('[hubspotApi] comparing pipeline stage', { trainingId: training.id, stage, targetStage })
            return stage === targetStage
        })
    }
    if (pipelineStage) {
      const targetStage = pipelineStage.trim()
        allResults = allResults.filter((training) => {
            const stage = (training.properties?.hs_pipeline_stage ?? '').trim()
            //console.debug('[hubspotApi] comparing pipeline stage', { trainingId: training.id, stage, targetStage })
            return stage === targetStage
        })
    }

    return allResults
  } catch (error: any) {
    console.error('Error fetching training objects:', error)
    throw error
  }
}

  /**
   * Convert HubSpot training object to app TrainingEvent format
   */
export function mapTrainingToEvent(training: HubSpotTraining): TrainingEvent {
  const props = training.properties
  const capacity = parseInt(props.hs_enrollment_capacity || '0', 10)
  const availableCapacity = parseInt(props.available_capacity || '0', 10)
  const startDateRaw = props.training_start_date
  const endDateRaw = props.training_end_date
  const parsedStartDate = parseDateProperty(startDateRaw)
  const parsedEndDate = parseDateProperty(endDateRaw)

  return {
    id: training.id,
    title: props.hs_course_name || 'Untitled Training',
    startDate: parsedStartDate?.toISOString() || startDateRaw,
    endDate: parsedEndDate?.toISOString() || endDateRaw,
    location: 'Virtual',
    capacity,
    registered: Math.max(0, capacity - availableCapacity),
    availableCapacity,
    active: true,
    description: props.description,
  }
}
