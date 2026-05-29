import type { SignupFormData } from '@/lib/signup/format-fields'

const KEY = 'tcf_user_profile_v1'

export function saveProfile(profile: SignupFormData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile))
  } catch {
    // ignore quota / private browsing errors
  }
}

export function loadProfile(): Partial<SignupFormData> | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Partial<SignupFormData>) : null
  } catch {
    return null
  }
}
