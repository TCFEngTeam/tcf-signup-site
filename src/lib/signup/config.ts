/** Staff inbox for waitlist and unregister alerts. */
export function getStaffNotifyEmail(): string {
  return process.env.STAFF_NOTIFY_EMAIL?.trim() ?? ''
}
