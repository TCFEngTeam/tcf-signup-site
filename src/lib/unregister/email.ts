import { getAppBaseUrl } from '@/lib/app-url'
import type { TrainingProgramId } from '@/lib/programs/config'
import { getTrainingProgram } from '@/lib/programs/config'

type SendUnregisterEmailInput = {
  to: string
  token: string
  program: TrainingProgramId
  trainingTitle: string
}

export async function sendUnregisterConfirmationEmail(input: SendUnregisterEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM_EMAIL?.trim()
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

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[unregister] Email not configured. Confirmation URL:\n', confirmUrl)
      return { delivered: false, devLogged: true as const }
    }
    throw new Error(
      'Email is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL in the environment.'
    )
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject,
      text,
      html,
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Failed to send email (${response.status}): ${body}`)
  }

  return { delivered: true as const, devLogged: false as const }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
