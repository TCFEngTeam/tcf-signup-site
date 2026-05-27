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
  date: string
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
    [process.env.HUBSPOT_UNIVERSITY_WEBSITE_PROPERTY || 'university_website']: data.universityWebsite,
    [process.env.HUBSPOT_CURRENT_YEAR_PROPERTY || 'current_year_in_school']: data.currentYear,
    [process.env.HUBSPOT_VIRGINIA_RESIDENT_PROPERTY || 'virginia_resident']: data.isVirginiaResident,
    [process.env.HUBSPOT_INTEREST_REASON_PROPERTY || 'interest_reason']: data.interestReason,
    [process.env.HUBSPOT_COMMUNITY_SUPPORT_PROPERTY || 'community_support_plan']: data.communitySupport,
    [process.env.HUBSPOT_TEACHING_INTEREST_PROPERTY || 'interested_in_teaching']: data.interestedInTeaching,
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
    const error = await response.json()
    throw new Error(`HubSpot API error: ${error.message || response.statusText}`)
  }

  return await response.json()
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
    const error = await response.json()
    console.error('Association error:', error)
    throw new Error(`Failed to associate contact with training: ${error.message || response.statusText}`)
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

  const response = await fetch(
    `${HUBSPOT_API_BASE}/crm/v3/objects/contacts?limit=1&after=0&properties=*&filterGroups=[{"filters":[{"propertyName":"email","operator":"EQ","value":"${encodeURIComponent(
      email
    )}"}]}]`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`HubSpot API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.results?.[0] ?? null
}

/**
 * Fetch training objects from HubSpot filtered by pipeline stage.
 * The stage is matched against the custom object property `hs_pipeline`.
 *
 * @param pipelineStage The exact stage name from .env.local (for example, "Accepting Applications")
 * @returns Array of training objects from HubSpot
 */
export async function getTrainingObjects(pipelineStage?: string): Promise<HubSpotTraining[]> {
  if (!API_KEY) {
    throw new Error('HUBSPOT_API_KEY is not configured')
  }

  const limit = 100
  let allResults: HubSpotTraining[] = []
  let after: string | null = null

  try {
    const objectType = process.env.HUBSPOT_TRAINING_OBJECT_ID || 'trainings'

    do {
      const url = new URL(`${HUBSPOT_API_BASE}/crm/v3/objects/${objectType}`)
      url.searchParams.set('limit', limit.toString())
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

    console.debug('[hubspotApi] raw training objects fetched', {
      objectType,
      pipelineStage,
      count: allResults.length,
      sampleProperties: allResults[0]?.properties ? Object.keys(allResults[0].properties).slice(0, 20) : [],
      sampleHsPipeline: allResults[0]?.properties?.hs_pipeline,
    })

    if (pipelineStage) {
      const targetStage = pipelineStage.trim()
      allResults = allResults.filter((training) => {
        const stage = (training.properties?.hs_pipeline ?? '').trim()
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
  const capacity = parseInt(props.capacity || '0', 10)
  const availableCapacity = parseInt(props.available_capacity || '0', 10)
  const datePropertyName = process.env.HUBSPOT_TRAINING_DATE_PROPERTY || 'date'
  const rawDate = props[datePropertyName] || props.date || props.start_date || props.hs_timestamp
  const parsedDate = parseDateProperty(rawDate)

  return {
    id: training.id,
    title: props.name || 'Untitled Training',
    date: parsedDate?.toISOString() || rawDate || new Date().toISOString(),
    location: props.location || 'TBD',
    capacity,
    registered: Math.max(0, capacity - availableCapacity),
    availableCapacity,
    active: true,
    description: props.description,
  }
}

  /**
   * Update the availableCapacity of a training object
   * @param trainingId HubSpot training ID
   * @param newCapacity New available capacity value
   */
  export async function updateTrainingCapacity(trainingId: string, newCapacity: number): Promise<void> {
    if (!API_KEY) {
      throw new Error('HUBSPOT_API_KEY is not configured')
    }

    const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/trainings/${trainingId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          available_capacity: newCapacity.toString(),
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to update training capacity: ${error.message || response.statusText}`)
    }
  }
