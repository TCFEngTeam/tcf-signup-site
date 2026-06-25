/** Public URL paths under the trainings section. */
export const TRAININGS_PATH = '/trainings'

/** Public URL path for the opportunities section. */
export const OPPORTUNITIES_PATH = '/opportunities'

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

export const EMBED_TRAININGS_PATH = '/embed/trainings'

export function embedTrainingsProgramPath(programSlug: string): string {
  return `${EMBED_TRAININGS_PATH}/${programSlug}`
}

/** Program slugs that had top-level URLs before the `/trainings` prefix. */
const LEGACY_PROGRAM_SLUGS = ['mhfa', 'qpr'] as const

export type LegacyRedirect = {
  source: string
  destination: string
  permanent: true
}

/** Permanent redirects from pre-`/trainings` public URLs. */
export function legacyTrainingRedirects(): LegacyRedirect[] {
  const redirects: LegacyRedirect[] = []

  for (const program of LEGACY_PROGRAM_SLUGS) {
    const programPath = trainingsProgramPath(program)
    redirects.push(
      { source: `/${program}`, destination: programPath, permanent: true },
      {
        source: `/${program}/events/:id`,
        destination: `${programPath}/events/:id`,
        permanent: true,
      },
      {
        source: `/${program}/events/:id/success`,
        destination: `${programPath}/events/:id/success`,
        permanent: true,
      }
    )
  }

  redirects.push(
    { source: '/unregister', destination: trainingsUnregisterPath(), permanent: true },
    {
      source: '/unregister/confirm',
      destination: `${TRAININGS_PATH}/unregister/confirm`,
      permanent: true,
    }
  )

  return redirects
}
