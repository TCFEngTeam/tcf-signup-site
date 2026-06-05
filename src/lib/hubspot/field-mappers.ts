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
