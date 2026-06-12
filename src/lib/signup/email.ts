import { getAppBaseUrl } from '@/lib/app-url'
import { signupFormContent } from '@/lib/content'
import type { SignupFormContent } from '@/lib/content/types'
import { formatTrainingScheduleLines } from '@/lib/dates/format-schedule'
import { escapeHtml, replaceTemplateTokens, sendResendEmail } from '@/lib/email/resend'
import type { TrainingProgramId } from '@/lib/programs/config'
import { getTrainingProgram } from '@/lib/programs/config'
import type { ProgramEvent } from '@/lib/programs/events'
import {
  createUnregisterToken,
  formatUnregisterTokenExpiry,
  resolveUnregisterTokenExpiry,
} from '@/lib/unregister/token'

type SendRegistrationConfirmationEmailInput = {
  to: string
  firstName: string
  program: TrainingProgramId
  event: ProgramEvent
}

type ConfirmationEmailCopy =
  | SignupFormContent['confirmationEmail']
  | SignupFormContent['waitlistConfirmationEmail']

function buildConfirmationEmailContent(
  copy: ConfirmationEmailCopy,
  input: SendRegistrationConfirmationEmailInput,
  options: {
    unregisterUrl: string
    cancelLinkExpiry: string
    actionIntro: string
    actionLinkLabel: string
    includeProgramNextSteps?: boolean
    nextStepsBody?: string
  }
) {
  const program = getTrainingProgram(input.program)
  const programLabel = program?.shortLabel ?? input.program.toUpperCase()
  const scheduleLines = formatTrainingScheduleLines(input.event.schedule)
  const eventUrl = `${getAppBaseUrl()}/${input.program}/events/${input.event.id}`
  const tokens = {
    firstName: input.firstName,
    program: programLabel,
    trainingTitle: input.event.title,
    cancelLinkExpiry: options.cancelLinkExpiry,
  }

  const subject = replaceTemplateTokens(copy.subject, tokens)
  const greeting = replaceTemplateTokens(copy.greeting, tokens)
  const intro = replaceTemplateTokens(copy.intro, tokens)
  const actionIntro = replaceTemplateTokens(options.actionIntro, tokens)

  const textParts = [
    greeting,
    '',
    intro,
    '',
    `${input.event.title} (${programLabel})`,
    copy.scheduleHeading,
    ...scheduleLines.map((line) => `  ${line}`),
    copy.locationHeading,
    `  ${input.event.location}`,
    '',
    copy.nextStepsHeading,
  ]

  if (options.nextStepsBody) {
    textParts.push(options.nextStepsBody)
  } else if (options.includeProgramNextSteps) {
    textParts.push(...(program?.successNextSteps ?? []).map((step) => `• ${step}`))
  }

  textParts.push(
    '',
    `${copy.viewEventLink}: ${eventUrl}`,
    '',
    `${actionIntro} ${options.unregisterUrl}`,
    '',
    copy.closing
  )

  const scheduleHtml = scheduleLines
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join('')

  const nextStepsHtml = options.nextStepsBody
    ? `<p>${escapeHtml(options.nextStepsBody)}</p>`
    : options.includeProgramNextSteps
      ? `<ul>${(program?.successNextSteps ?? [])
          .map((step) => `<li>${escapeHtml(step)}</li>`)
          .join('')}</ul>`
      : ''

  const html = `
    <p>${escapeHtml(greeting)}</p>
    <p>${escapeHtml(intro)}</p>
    <p><strong>${escapeHtml(input.event.title)}</strong> (${escapeHtml(programLabel)})</p>
    <p><strong>${escapeHtml(copy.scheduleHeading)}</strong></p>
    <ul>${scheduleHtml}</ul>
    <p><strong>${escapeHtml(copy.locationHeading)}</strong><br>${escapeHtml(input.event.location)}</p>
    <p><strong>${escapeHtml(copy.nextStepsHeading)}</strong></p>
    ${nextStepsHtml}
    <p><a href="${escapeHtml(eventUrl)}">${escapeHtml(copy.viewEventLink)}</a></p>
    <p>${escapeHtml(actionIntro)} <a href="${escapeHtml(options.unregisterUrl)}">${escapeHtml(options.actionLinkLabel)}</a></p>
    <p>${escapeHtml(copy.closing)}</p>
  `.trim()

  return { subject, text: textParts.join('\n'), html }
}

export async function sendRegistrationConfirmationEmail(
  input: SendRegistrationConfirmationEmailInput
) {
  const copy = signupFormContent.confirmationEmail
  const tokenExpiry = resolveUnregisterTokenExpiry(input.event.schedule)
  const token = createUnregisterToken(
    {
      email: input.to,
      program: input.program,
      trainingId: input.event.id,
      kind: 'registration',
    },
    { expiresAt: tokenExpiry }
  )
  const cancelLinkExpiry = formatUnregisterTokenExpiry(tokenExpiry)
  const unregisterUrl = `${getAppBaseUrl()}/unregister/confirm?token=${encodeURIComponent(token)}`
  const { subject, text, html } = buildConfirmationEmailContent(copy, input, {
    unregisterUrl,
    cancelLinkExpiry,
    actionIntro: copy.cancelRegistrationIntro,
    actionLinkLabel: copy.cancelRegistrationLink,
    includeProgramNextSteps: true,
  })

  return sendResendEmail({
    to: input.to,
    subject,
    text,
    html,
    logLabel: 'signup',
  })
}

export async function sendWaitlistConfirmationEmail(input: SendRegistrationConfirmationEmailInput) {
  const copy = signupFormContent.waitlistConfirmationEmail
  const tokenExpiry = resolveUnregisterTokenExpiry(input.event.schedule)
  const token = createUnregisterToken(
    {
      email: input.to,
      program: input.program,
      trainingId: input.event.id,
      kind: 'waitlist',
    },
    { expiresAt: tokenExpiry }
  )
  const cancelLinkExpiry = formatUnregisterTokenExpiry(tokenExpiry)
  const unregisterUrl = `${getAppBaseUrl()}/unregister/confirm?token=${encodeURIComponent(token)}`
  const { subject, text, html } = buildConfirmationEmailContent(copy, input, {
    unregisterUrl,
    cancelLinkExpiry,
    actionIntro: copy.leaveWaitlistIntro,
    actionLinkLabel: copy.leaveWaitlistLink,
    nextStepsBody: copy.nextStepsBody,
  })

  return sendResendEmail({
    to: input.to,
    subject,
    text,
    html,
    logLabel: 'waitlist-signup',
  })
}
