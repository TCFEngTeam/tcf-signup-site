import {
  getCancelledAssociationLabel,
  getCancelledAssociationTypeId,
  getContactPropertyKeys,
  getRegistrantAssociationTypeId,
  getWaitlistAssociationLabel,
  getWaitlistAssociationTypeId,
} from '@/lib/hubspot/config'
import {
  getContactByEmail,
  getContactTrainingAssociations,
  getRegistrantAssociationLabel,
  getTrainingById,
  isContactOnWaitlistForTraining,
  isContactRegisteredForTraining,
  mapTrainingToEvent,
  unregisterContactFromTraining,
  unwaitlistContactFromTraining,
} from '@/lib/hubspot/api'
import { pagesContent } from '@/lib/content'
import {
  isTrainingEventEnded,
  type TrainingSchedule,
} from '@/lib/dates/format-schedule'
import { formatEmail } from '@/lib/signup/format-fields'
import {
  getProgramPipelineConfig,
  getTrainingProgram,
  isTrainingProgramId,
  type TrainingProgramId,
} from '@/lib/programs/config'
import { loadProgramEventById } from '@/lib/programs/events'
import {
  findRegistrantAssociationsForTraining,
  findWaitlistAssociationsForTraining,
} from '@/lib/hubspot/field-mappers'
import { getUnregisterHubSpotMode } from '@/lib/unregister/config'
import {
  createUnregisterToken,
  formatUnregisterTokenExpiry,
  resolveUnregisterKind,
  resolveUnregisterTokenExpiry,
  verifyUnregisterToken,
  type UnregisterKind,
} from '@/lib/unregister/token'
import { sendUnregisterConfirmationEmail, sendUnregisterStaffNotificationEmail } from '@/lib/unregister/email'

const eventLabels = pagesContent.events

export type UnregisterOption = {
  trainingId: string
  title: string
  kind: UnregisterKind
}

/** @deprecated Use UnregisterOption */
export type RegistrationOption = UnregisterOption

export type LookupUnregisterResult =
  | { status: 'found'; options: UnregisterOption[] }
  | { status: 'none' }

export type RequestUnregisterResult = { status: 'sent'; message: string }

/** Same message whether or not the email exists (avoid account enumeration). */
export const UNREGISTER_ACK_MESSAGE =
  'If that email has an active registration or waitlist spot for the selected session, you will receive a confirmation link shortly.'

function readContactNameAndPhone(contact: { properties: Record<string, string> }) {
  const keys = getContactPropertyKeys()
  return {
    firstName: contact.properties[keys.firstName]?.trim() ?? '',
    lastName: contact.properties[keys.lastName]?.trim() ?? '',
    phone: contact.properties[keys.phone]?.trim() ?? '',
  }
}

function readTrainingTitle(training: { properties: Record<string, string> }) {
  return (
    training.properties.hs_course_name ||
    training.properties.name ||
    eventLabels.untitledEvent
  )
}

function trainingMatchesProgram(
  training: { properties: Record<string, string> },
  programId: TrainingProgramId
) {
  const { pipelineType } = getProgramPipelineConfig(programId)
  if (!pipelineType) return true
  return (training.properties.hs_pipeline ?? '').trim() === pipelineType.trim()
}

async function getTrainingScheduleForUnregister(
  programId: TrainingProgramId,
  trainingId: string
): Promise<TrainingSchedule | undefined> {
  const { event } = await loadProgramEventById(programId, trainingId)
  if (event) return event.schedule

  const training = await getTrainingById(trainingId)
  if (training) return mapTrainingToEvent(training).schedule

  return undefined
}

function isUnregisterableTraining(schedule?: TrainingSchedule): boolean {
  if (!schedule) return true
  return !isTrainingEventEnded(schedule)
}

export async function listUnregisterableForProgram(
  contactId: string,
  programId: TrainingProgramId
): Promise<UnregisterOption[]> {
  const registrantLabel = getRegistrantAssociationLabel()
  const registrantTypeId = getRegistrantAssociationTypeId()
  const waitlistLabel = getWaitlistAssociationLabel()
  const waitlistTypeId = getWaitlistAssociationTypeId()
  const associations = await getContactTrainingAssociations(contactId)

  const uniqueIds = [...new Set(associations.map((row) => row.trainingId))]
  const options: UnregisterOption[] = []

  for (const trainingId of uniqueIds) {
    const hasRegistration =
      findRegistrantAssociationsForTraining(
        associations,
        trainingId,
        registrantLabel,
        registrantTypeId,
        getCancelledAssociationLabel(),
        getCancelledAssociationTypeId()
      ).length > 0
    const hasWaitlist =
      findWaitlistAssociationsForTraining(
        associations,
        trainingId,
        waitlistLabel,
        waitlistTypeId
      ).length > 0

    if (!hasRegistration && !hasWaitlist) continue

    const training = await getTrainingById(trainingId)
    if (!training || !trainingMatchesProgram(training, programId)) continue

    const schedule = mapTrainingToEvent(training).schedule
    if (!isUnregisterableTraining(schedule)) continue

    options.push({
      trainingId,
      title: readTrainingTitle(training),
      kind: hasRegistration ? 'registration' : 'waitlist',
    })
  }

  return options.sort((a, b) => a.title.localeCompare(b.title))
}

/** @deprecated Use listUnregisterableForProgram */
export async function listRegistrationsForProgram(
  contactId: string,
  programId: TrainingProgramId
): Promise<UnregisterOption[]> {
  return listUnregisterableForProgram(contactId, programId)
}

export async function lookupUnregisterRegistrations(input: {
  email: string
  program: string
}): Promise<LookupUnregisterResult> {
  if (!isTrainingProgramId(input.program)) {
    throw new Error('Invalid program')
  }

  const programId = input.program
  if (!getTrainingProgram(programId)) {
    throw new Error('Unknown program')
  }

  const email = formatEmail(input.email)
  if (!email) {
    throw new Error('Enter a valid email address')
  }

  const contact = await getContactByEmail(email)
  if (!contact?.id) {
    return { status: 'none' }
  }

  const options = await listUnregisterableForProgram(contact.id, programId)
  if (options.length === 0) {
    return { status: 'none' }
  }

  return { status: 'found', options }
}

async function resolveUnregisterKindForContact(
  contactId: string,
  trainingId: string
): Promise<UnregisterKind | null> {
  if (await isContactRegisteredForTraining(contactId, trainingId)) {
    return 'registration'
  }
  if (await isContactOnWaitlistForTraining(contactId, trainingId)) {
    return 'waitlist'
  }
  return null
}

export async function requestUnregisterEmail(input: {
  email: string
  program: string
  trainingId: string
}): Promise<RequestUnregisterResult> {
  if (!isTrainingProgramId(input.program)) {
    throw new Error('Invalid program')
  }

  const programId = input.program
  if (!getTrainingProgram(programId)) {
    throw new Error('Unknown program')
  }

  const email = formatEmail(input.email)
  if (!email) {
    throw new Error('Enter a valid email address')
  }

  const trainingId = input.trainingId?.trim()
  if (!trainingId) {
    throw new Error('Select a session to cancel')
  }

  const contact = await getContactByEmail(email)
  const kind = contact?.id
    ? await resolveUnregisterKindForContact(contact.id, trainingId)
    : null

  if (!contact?.id || !kind) {
    throw new Error(pagesContent.unregister.request.notRegisteredForSession)
  }

  const eventSchedule = await getTrainingScheduleForUnregister(programId, trainingId)
  if (!isUnregisterableTraining(eventSchedule)) {
    throw new Error(pagesContent.unregister.request.sessionEnded)
  }

  let trainingTitle = eventLabels.untitledEvent

  const { event } = await loadProgramEventById(programId, trainingId)
  if (event) {
    trainingTitle = event.title
  } else {
    const training = await getTrainingById(trainingId)
    if (training) {
      trainingTitle = readTrainingTitle(training)
    }
  }

  const tokenExpiry = resolveUnregisterTokenExpiry(eventSchedule)
  const token = createUnregisterToken(
    {
      email,
      program: programId,
      trainingId,
      kind,
    },
    { expiresAt: tokenExpiry }
  )

  await sendUnregisterConfirmationEmail({
    to: email,
    token,
    program: programId,
    trainingTitle,
    linkExpiresAt: formatUnregisterTokenExpiry(tokenExpiry),
    kind,
  })

  return { status: 'sent', message: UNREGISTER_ACK_MESSAGE }
}

export async function confirmUnregister(token: string) {
  const payload = verifyUnregisterToken(token)
  const kind = resolveUnregisterKind(payload)

  const eventSchedule = await getTrainingScheduleForUnregister(
    payload.program,
    payload.trainingId
  )
  if (!isUnregisterableTraining(eventSchedule)) {
    throw new Error(pagesContent.unregister.request.sessionEnded)
  }

  const contact = await getContactByEmail(payload.email)
  if (!contact?.id) {
    throw new Error('Registration not found for this link')
  }

  const mode = getUnregisterHubSpotMode()
  let alreadyCancelled = false

  if (kind === 'waitlist') {
    const { alreadyLeft } = await unwaitlistContactFromTraining(
      contact.id,
      payload.trainingId,
      mode
    )
    alreadyCancelled = alreadyLeft
  } else {
    const result = await unregisterContactFromTraining(
      contact.id,
      payload.trainingId,
      mode
    )
    alreadyCancelled = result.alreadyCancelled
  }

  const { event } = await loadProgramEventById(payload.program, payload.trainingId)
  let trainingTitle = event?.title

  if (!trainingTitle) {
    const training = await getTrainingById(payload.trainingId)
    if (training) {
      trainingTitle = readTrainingTitle(training)
    }
  }

  if (!alreadyCancelled && event) {
    const { firstName, lastName, phone } = readContactNameAndPhone(contact)
    try {
      await sendUnregisterStaffNotificationEmail({
        studentFirstName: firstName,
        studentLastName: lastName,
        studentEmail: payload.email,
        studentPhone: phone,
        program: payload.program,
        event,
        kind,
      })
    } catch (staffEmailError) {
      console.error('Unregister staff notification email failed:', staffEmailError)
    }
  }

  return {
    program: payload.program,
    trainingId: payload.trainingId,
    trainingTitle: trainingTitle ?? pagesContent.unregister.confirm.fallbackSessionTitle,
    mode,
    kind,
    alreadyCancelled,
  }
}
