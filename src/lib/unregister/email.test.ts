import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sendUnregisterStaffNotificationEmail } from '@/lib/unregister/email'

const { sendResendEmail } = vi.hoisted(() => ({
  sendResendEmail: vi.fn(),
}))

vi.mock('@/lib/email/resend', () => ({
  sendResendEmail,
  escapeHtml: (value: string) => value,
  replaceTemplateTokens: (template: string, tokens: Record<string, string>) =>
    template.replace(/\{(\w+)\}/g, (_, key: string) => tokens[key] ?? ''),
}))

const sampleEvent = {
  id: 'training-1',
  title: 'MHFA Session A',
  schedule: {
    session1Start: '2026-07-01T09:00:00-04:00',
    session1End: '2026-07-01T17:00:00-04:00',
  },
  location: 'Richmond, VA',
  capacity: 30,
  registered: 10,
  availableCapacity: 20,
  active: true,
  isFull: false,
  registrationClosed: false,
}

describe('sendUnregisterStaffNotificationEmail', () => {
  beforeEach(() => {
    sendResendEmail.mockResolvedValue({ delivered: true, devLogged: false })
    process.env.WAITLIST_NOTIFY_EMAIL = 'staff@example.com'
  })

  afterEach(() => {
    delete process.env.WAITLIST_NOTIFY_EMAIL
    vi.clearAllMocks()
  })

  it('sends registration cancellation staff notification', async () => {
    await sendUnregisterStaffNotificationEmail({
      studentFirstName: 'Jane',
      studentLastName: 'Doe',
      studentEmail: 'jane@example.edu',
      studentPhone: '555-0100',
      program: 'mhfa',
      event: sampleEvent,
      kind: 'registration',
    })

    expect(sendResendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'staff@example.com',
        subject: 'Registration cancelled — MHFA: MHFA Session A',
        logLabel: 'unregister-staff-notify',
      })
    )
  })

  it('sends waitlist leave staff notification', async () => {
    await sendUnregisterStaffNotificationEmail({
      studentFirstName: 'Jane',
      studentLastName: 'Doe',
      studentEmail: 'jane@example.edu',
      studentPhone: '555-0100',
      program: 'mhfa',
      event: sampleEvent,
      kind: 'waitlist',
    })

    expect(sendResendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Left waitlist — MHFA: MHFA Session A',
        logLabel: 'unwaitlist-staff-notify',
      })
    )
  })

  it('skips when WAITLIST_NOTIFY_EMAIL is unset', async () => {
    delete process.env.WAITLIST_NOTIFY_EMAIL

    const result = await sendUnregisterStaffNotificationEmail({
      studentFirstName: 'Jane',
      studentLastName: 'Doe',
      studentEmail: 'jane@example.edu',
      studentPhone: '555-0100',
      program: 'mhfa',
      event: sampleEvent,
      kind: 'registration',
    })

    expect(result).toEqual({ delivered: false, skipped: true })
    expect(sendResendEmail).not.toHaveBeenCalled()
  })
})
