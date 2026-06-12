import { getAppBaseUrl } from '@/lib/app-url'
import { escapeHtml, sendResendEmail } from '@/lib/email/resend'
import type { TrainingProgramId } from '@/lib/programs/config'
import { getTrainingProgram } from '@/lib/programs/config'
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
