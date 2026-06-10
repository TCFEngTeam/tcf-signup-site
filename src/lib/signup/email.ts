import { getAppBaseUrl } from '@/lib/app-url'
import { signupFormContent } from '@/lib/content'
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

export async function sendRegistrationConfirmationEmail(
  input: SendRegistrationConfirmationEmailInput
) {
  const copy = signupFormContent.confirmationEmail
  const program = getTrainingProgram(input.program)
  const programLabel = program?.shortLabel ?? input.program.toUpperCase()
  const scheduleLines = formatTrainingScheduleLines(input.event.schedule)
  const eventUrl = `${getAppBaseUrl()}/${input.program}/events/${input.event.id}`
  const tokenExpiry = resolveUnregisterTokenExpiry(input.event.schedule)
  const token = createUnregisterToken(
    {
      email: input.to,
      program: input.program,
      trainingId: input.event.id,
    },
    { expiresAt: tokenExpiry }
  )
  const cancelLinkExpiry = formatUnregisterTokenExpiry(tokenExpiry)
  const unregisterUrl = `${getAppBaseUrl()}/unregister/confirm?token=${encodeURIComponent(token)}`
  const tokens = {
    firstName: input.firstName,
    program: programLabel,
    trainingTitle: input.event.title,
    cancelLinkExpiry,
  }

  const subject = replaceTemplateTokens(copy.subject, tokens)
  const greeting = replaceTemplateTokens(copy.greeting, tokens)
  const intro = replaceTemplateTokens(copy.intro, tokens)
  const cancelRegistrationIntro = replaceTemplateTokens(copy.cancelRegistrationIntro, tokens)

  const text = [
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
    ...(program?.successNextSteps ?? []).map((step) => `• ${step}`),
    '',
    `${copy.viewEventLink}: ${eventUrl}`,
    '',
    `${cancelRegistrationIntro} ${unregisterUrl}`,
    '',
    copy.closing,
  ].join('\n')

  const scheduleHtml = scheduleLines
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join('')
  const nextStepsHtml = (program?.successNextSteps ?? [])
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join('')

  const html = `
    <p>${escapeHtml(greeting)}</p>
    <p>${escapeHtml(intro)}</p>
    <p><strong>${escapeHtml(input.event.title)}</strong> (${escapeHtml(programLabel)})</p>
    <p><strong>${escapeHtml(copy.scheduleHeading)}</strong></p>
    <ul>${scheduleHtml}</ul>
    <p><strong>${escapeHtml(copy.locationHeading)}</strong><br>${escapeHtml(input.event.location)}</p>
    <p><strong>${escapeHtml(copy.nextStepsHeading)}</strong></p>
    <ul>${nextStepsHtml}</ul>
    <p><a href="${escapeHtml(eventUrl)}">${escapeHtml(copy.viewEventLink)}</a></p>
    <p>${escapeHtml(cancelRegistrationIntro)} <a href="${escapeHtml(unregisterUrl)}">${escapeHtml(copy.cancelRegistrationLink)}</a></p>
    <p>${escapeHtml(copy.closing)}</p>
  `.trim()

  return sendResendEmail({
    to: input.to,
    subject,
    text,
    html,
    logLabel: 'signup',
  })
}
