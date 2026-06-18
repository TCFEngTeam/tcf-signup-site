/** Staff inbox notified when a student joins a session waitlist. */
export function getWaitlistNotifyEmail(): string {
  return process.env.WAITLIST_NOTIFY_EMAIL?.trim() ?? ''
}
