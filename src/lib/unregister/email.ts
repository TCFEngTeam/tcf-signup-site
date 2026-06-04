import { getAppBaseUrl } from '@/lib/app-url'
import { escapeHtml, sendResendEmail } from '@/lib/email/resend'
import type { TrainingProgramId } from '@/lib/programs/config'
import { getTrainingProgram } from '@/lib/programs/config'

type SendUnregisterEmailInput = {
  to: string
  token: string
  program: TrainingProgramId
  trainingTitle: string
}

export async function sendUnregisterConfirmationEmail(input: SendUnregisterEmailInput) {
  const confirmUrl = `${getAppBaseUrl()}/unregister/confirm?token=${encodeURIComponent(input.token)}`
  const program = getTrainingProgram(input.program)
  const programLabel = program?.shortLabel ?? input.program.toUpperCase()

  const subject = `Confirm cancellation — ${programLabel} training`
  const text = [
    `You asked to cancel your registration for:`,
    ``,
    `${input.trainingTitle} (${programLabel})`,
    ``,
    `Confirm cancellation (link expires in ${process.env.UNREGISTER_TOKEN_TTL_HOURS ?? '48'} hours):`,
    confirmUrl,
    ``,
    `If you did not request this, you can ignore this email.`,
  ].join('\n')

  const html = `
    <p>You asked to cancel your registration for:</p>
    <p><strong>${escapeHtml(input.trainingTitle)}</strong> (${escapeHtml(programLabel)})</p>
    <p><a href="${escapeHtml(confirmUrl)}">Confirm cancellation</a></p>
    <p>If you did not request this, you can ignore this email.</p>
  `.trim()

  return sendResendEmail({
    to: input.to,
    subject,
    text,
    html,
    logLabel: 'unregister',
  })
}
