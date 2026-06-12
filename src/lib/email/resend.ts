type SendResendEmailInput = {
  to: string
  subject: string
  text: string
  html: string
  /** Prefix for dev console logging when email is not configured. */
  logLabel?: string
}

export async function sendResendEmail(input: SendResendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM_EMAIL?.trim()

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === 'development') {
      console.info(
        `[${input.logLabel ?? 'email'}] Email not configured. Would send to ${input.to}:\n`,
        input.text
      )
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
      subject: input.subject,
      text: input.text,
      html: input.html,
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Failed to send email (${response.status}): ${body}`)
  }

  return { delivered: true as const, devLogged: false as const }
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function replaceTemplateTokens(
  template: string,
  tokens: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => tokens[key] ?? '')
}
