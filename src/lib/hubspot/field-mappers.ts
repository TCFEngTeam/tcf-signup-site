/** Pure HubSpot field/value helpers (unit-tested, no API calls). */

export function mapSmsConsentToHubSpot(value: string) {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'yes') {
    return (
      process.env.HUBSPOT_SMS_CONSENT_YES_VALUE ?? 'nABLB1wXwnWES39Rff7ZO'
    )
  }
  if (normalized === 'no') {
    return (
      process.env.HUBSPOT_SMS_CONSENT_NO_VALUE ?? 'MTlPSCzKCtIey_DQUT4aW'
    )
  }
  return value.trim()
}

export function isDuplicateAssociationResponse(parsed: unknown, status: number) {
  if (status === 409) return true
  const text = JSON.stringify(parsed ?? '').toLowerCase()
  return (
    text.includes('already') &&
    (text.includes('associat') || text.includes('exist') || text.includes('duplicate'))
  )
}

export type TrainingAssociationRow = {
  trainingId: string
  associationType?: string
  associationCategory?: string
  associationTypeId?: number
}

function readAssociationTypeId(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}

/** Normalize HubSpot v3 or v4 association list responses. */
export function parseTrainingAssociationRows(results: unknown): TrainingAssociationRow[] {
  if (!Array.isArray(results)) return []

  const rows: TrainingAssociationRow[] = []

  for (const entry of results) {
    if (!entry || typeof entry !== 'object') continue
    const row = entry as Record<string, unknown>

    if (row.toObjectId !== undefined && Array.isArray(row.associationTypes)) {
      for (const associationType of row.associationTypes) {
        if (!associationType || typeof associationType !== 'object') continue
        const typed = associationType as Record<string, unknown>
        rows.push({
          trainingId: String(row.toObjectId),
          associationType:
            (typeof typed.label === 'string' && typed.label) ||
            (typed.typeId !== undefined ? String(typed.typeId) : undefined),
          associationCategory:
            typeof typed.category === 'string' ? typed.category : undefined,
          associationTypeId: readAssociationTypeId(typed.typeId),
        })
      }
      continue
    }

    if (row.id !== undefined) {
      rows.push({
        trainingId: String(row.id),
        associationType: row.type !== undefined ? String(row.type) : undefined,
      })
    }
  }

  return rows
}

export function matchesAssociationLabel(
  row: TrainingAssociationRow,
  label: string,
  configuredTypeId?: string
): boolean {
  const normalizedLabel = label.trim().toLowerCase()
  const rowType = (row.associationType ?? '').trim().toLowerCase()

  if (rowType && rowType === normalizedLabel) return true

  if (configuredTypeId && row.associationTypeId !== undefined) {
    return String(row.associationTypeId) === configuredTypeId.trim()
  }

  return false
}

export function contactHasTrainingAssociation(
  associations: Array<{ id?: string; type?: string }> | undefined,
  trainingId: string,
  associationType?: string
) {
  return (associations ?? []).some((row) => {
    if (String(row.id) !== String(trainingId)) return false
    if (associationType === undefined) return true
    return (row.type ?? '').trim().toLowerCase() === associationType.trim().toLowerCase()
  })
}

export function contactHasAssociationForTraining(
  rows: TrainingAssociationRow[],
  trainingId: string,
  label: string,
  configuredTypeId?: string
): boolean {
  return rows.some(
    (row) =>
      row.trainingId === String(trainingId) &&
      matchesAssociationLabel(row, label, configuredTypeId)
  )
}
