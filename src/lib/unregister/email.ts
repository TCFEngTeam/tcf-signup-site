import { getAppBaseUrl } from '@/lib/app-url'
import { pagesContent } from '@/lib/content'
import { formatTrainingScheduleLines } from '@/lib/dates/format-schedule'
import { escapeHtml, replaceTemplateTokens, sendResendEmail } from '@/lib/email/resend'
import type { TrainingProgramId } from '@/lib/programs/config'
import { getTrainingProgram } from '@/lib/programs/config'
import type { ProgramEvent } from '@/lib/programs/events'
import { getStaffNotifyEmail } from '@/lib/signup/config'
import type { UnregisterKind } from '@/lib/unregister/token'

type SendUnregisterEmailInput = {
  to: string
  token: string
  program: TrainingProgramId
  trainingTitle: string
  linkExpiresAt: string
  kind: UnregisterKind
}

export async function sendUnregisterConfirmationEmail(input: SendUnregisterEmailInput) {
  const confirmUrl = `${getAppBaseUrl()}/unregister/confirm?token=${encodeURIComponent(input.token)}`
  const program = getTrainingProgram(input.program)
  const programLabel = program?.shortLabel ?? input.program.toUpperCase()
  const isWaitlist = input.kind === 'waitlist'

  const subject = isWaitlist
    ? `Confirm leaving the waitlist — ${programLabel} training`
    : `Confirm cancellation — ${programLabel} training`

  const intro = isWaitlist
    ? 'You asked to leave the waitlist for:'
    : 'You asked to cancel your registration for:'

  const confirmLabel = isWaitlist ? 'Confirm leaving the waitlist' : 'Confirm cancellation'

  const text = [
    intro,
    ``,
    `${input.trainingTitle} (${programLabel})`,
    ``,
    `${confirmLabel} (link valid until ${input.linkExpiresAt}):`,
    confirmUrl,
    ``,
    `If you did not request this, you can ignore this email.`,
  ].join('\n')

  const html = `
    <p>${escapeHtml(intro)}</p>
    <p><strong>${escapeHtml(input.trainingTitle)}</strong> (${escapeHtml(programLabel)})</p>
    <p>This link is valid until ${escapeHtml(input.linkExpiresAt)}.</p>
    <p><a href="${escapeHtml(confirmUrl)}">${escapeHtml(confirmLabel)}</a></p>
    <p>If you did not request this, you can ignore this email.</p>
  `.trim()

  return sendResendEmail({
    to: input.to,
    subject,
    text,
    html,
    logLabel: isWaitlist ? 'unwaitlist' : 'unregister',
  })
}

type SendUnregisterStaffNotificationInput = {
  studentFirstName: string
  studentLastName: string
  studentEmail: string
  studentPhone: string
  program: TrainingProgramId
  event: ProgramEvent
  kind: UnregisterKind
}

export async function sendUnregisterStaffNotificationEmail(
  input: SendUnregisterStaffNotificationInput
) {
  const notifyTo = getStaffNotifyEmail()
  if (!notifyTo) {
    if (process.env.NODE_ENV === 'development') {
      console.info(
        '[unregister-staff-notify] STAFF_NOTIFY_EMAIL is not set; skipping staff notification.'
      )
    }
    return { delivered: false, skipped: true as const }
  }

  const copy = pagesContent.unregister.staffNotificationEmail
  const kindCopy = input.kind === 'waitlist' ? copy.waitlist : copy.registration
  const program = getTrainingProgram(input.program)
  const programLabel = program?.shortLabel ?? input.program.toUpperCase()
  const scheduleLines = formatTrainingScheduleLines(input.event.schedule)
  const eventUrl = `${getAppBaseUrl()}/${input.program}/events/${input.event.id}`
  const studentName = `${input.studentFirstName} ${input.studentLastName}`.trim()
  const tokens = {
    program: programLabel,
    trainingTitle: input.event.title,
    studentName,
    studentEmail: input.studentEmail,
    studentPhone: input.studentPhone,
  }

  const subject = replaceTemplateTokens(kindCopy.subject, tokens)
  const intro = replaceTemplateTokens(kindCopy.intro, tokens)

  const text = [
    intro,
    '',
    copy.studentNameLabel,
    `  ${studentName}`,
    copy.studentEmailLabel,
    `  ${input.studentEmail}`,
    copy.studentPhoneLabel,
    `  ${input.studentPhone}`,
    '',
    copy.sessionHeading,
    `  ${input.event.title} (${programLabel})`,
    copy.scheduleHeading,
    ...scheduleLines.map((line) => `  ${line}`),
    '',
    `${copy.viewEventLink}: ${eventUrl}`,
  ].join('\n')

  const scheduleHtml = scheduleLines
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join('')

  const html = `
    <p>${escapeHtml(intro)}</p>
    <p><strong>${escapeHtml(copy.studentNameLabel)}</strong><br>${escapeHtml(studentName)}</p>
    <p><strong>${escapeHtml(copy.studentEmailLabel)}</strong><br>${escapeHtml(input.studentEmail)}</p>
    <p><strong>${escapeHtml(copy.studentPhoneLabel)}</strong><br>${escapeHtml(input.studentPhone)}</p>
    <p><strong>${escapeHtml(copy.sessionHeading)}</strong><br>${escapeHtml(input.event.title)} (${escapeHtml(programLabel)})</p>
    <p><strong>${escapeHtml(copy.scheduleHeading)}</strong></p>
    <ul>${scheduleHtml}</ul>
    <p><a href="${escapeHtml(eventUrl)}">${escapeHtml(copy.viewEventLink)}</a></p>
  `.trim()

  return sendResendEmail({
    to: notifyTo,
    subject,
    text,
    html,
    logLabel: input.kind === 'waitlist' ? 'unwaitlist-staff-notify' : 'unregister-staff-notify',
  })
}
