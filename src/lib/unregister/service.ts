import {
  getContactByEmail,
  getContactTrainingAssociations,
  getRegistrantAssociationLabel,
  isContactRegisteredForTraining,
  unregisterContactFromTraining,
} from '@/lib/hubspot/api'
import { formatEmail } from '@/lib/signup/format-fields'
import {
  getTrainingProgram,
  isTrainingProgramId,
  type TrainingProgramId,
} from '@/lib/programs/config'
import { loadProgramEventById, loadProgramEvents } from '@/lib/programs/events'
import { getUnregisterHubSpotMode } from '@/lib/unregister/config'
import { createUnregisterToken, verifyUnregisterToken } from '@/lib/unregister/token'
import { sendUnregisterConfirmationEmail } from '@/lib/unregister/email'

export type RegistrationOption = {
  trainingId: string
  title: string
}

export type RequestUnregisterResult =
  | { status: 'sent'; message: string }
  | { status: 'select_training'; options: RegistrationOption[]; message: string }

/** Same message whether or not the email exists (avoid account enumeration). */
export const UNREGISTER_ACK_MESSAGE =
  'If that email is registered for the selected session, you will receive a confirmation link shortly.'

export async function listRegistrationsForProgram(
  contactId: string,
  programId: TrainingProgramId
): Promise<RegistrationOption[]> {
  const registrantLabel = getRegistrantAssociationLabel()
  const associations = await getContactTrainingAssociations(contactId)
  const registrantTrainingIds = new Set(
    associations
      .filter((row) => (row.associationType ?? '').trim() === registrantLabel)
      .map((row) => row.trainingId)
  )

  const { events } = await loadProgramEvents(programId)
  return events
    .filter((event) => registrantTrainingIds.has(event.id))
    .map((event) => ({ trainingId: event.id, title: event.title }))
}

export async function requestUnregisterEmail(input: {
  email: string
  program: string
  trainingId?: string
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

  const contact = await getContactByEmail(email)
  if (!contact?.id) {
    return { status: 'sent', message: UNREGISTER_ACK_MESSAGE }
  }

  let trainingId = input.trainingId?.trim()
  let trainingTitle = 'Training session'

  if (!trainingId) {
    const options = await listRegistrationsForProgram(contact.id, programId)
    if (options.length === 0) {
      return { status: 'sent', message: UNREGISTER_ACK_MESSAGE }
    }
    if (options.length > 1) {
      return {
        status: 'select_training',
        options,
        message: 'Select the session you want to cancel.',
      }
    }
    trainingId = options[0].trainingId
    trainingTitle = options[0].title
  } else {
    const { event } = await loadProgramEventById(programId, trainingId)
    if (!event) {
      return { status: 'sent', message: UNREGISTER_ACK_MESSAGE }
    }
    trainingTitle = event.title

    if (!(await isContactRegisteredForTraining(contact.id, trainingId))) {
      return { status: 'sent', message: UNREGISTER_ACK_MESSAGE }
    }
  }

  const token = createUnregisterToken({
    email,
    program: programId,
    trainingId,
  })

  await sendUnregisterConfirmationEmail({
    to: email,
    token,
    program: programId,
    trainingTitle,
  })

  return { status: 'sent', message: UNREGISTER_ACK_MESSAGE }
}

export async function confirmUnregister(token: string) {
  const payload = verifyUnregisterToken(token)

  const contact = await getContactByEmail(payload.email)
  if (!contact?.id) {
    throw new Error('Registration not found for this link')
  }

  const mode = getUnregisterHubSpotMode()
  await unregisterContactFromTraining(contact.id, payload.trainingId, mode)

  const { event } = await loadProgramEventById(payload.program, payload.trainingId)

  return {
    program: payload.program,
    trainingId: payload.trainingId,
    trainingTitle: event?.title ?? 'your training session',
    mode,
  }
}
