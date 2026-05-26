// Simple wrapper around localStorage for storing a small user profile.

const KEY = 'tcf_user_profile_v1'

export function saveProfile(profile: any) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile))
  } catch (e) {
    // ignore
  }
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}
