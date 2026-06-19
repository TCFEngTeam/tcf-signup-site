/** Public URL paths under the trainings section. */
export const TRAININGS_PATH = '/trainings'

export function trainingsProgramPath(programSlug: string): string {
  return `${TRAININGS_PATH}/${programSlug}`
}

export function trainingsEventPath(programSlug: string, eventId: string): string {
  return `${TRAININGS_PATH}/${programSlug}/events/${eventId}`
}

export function trainingsEventSuccessPath(
  programSlug: string,
  eventId: string,
  search = ''
): string {
  return `${TRAININGS_PATH}/${programSlug}/events/${eventId}/success${search}`
}

export function trainingsUnregisterPath(): string {
  return `${TRAININGS_PATH}/unregister`
}

export function trainingsUnregisterConfirmPath(token: string): string {
  return `${TRAININGS_PATH}/unregister/confirm?token=${encodeURIComponent(token)}`
}
