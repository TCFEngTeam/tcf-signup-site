import type { SignupFormData } from '@/lib/formatSignupFields'

export const validSignupFormData: SignupFormData = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.edu',
  phone: '+1 (571) 482-0864',
  hometownCity: 'Charlottesville',
  hometownState: 'Virginia',
  universityWebsite: 'virginia.edu',
  currentYear: 'Junior',
  isVirginiaResident: 'yes',
  interestReason: 'I want to support peers on campus.',
  communitySupport: 'I will share resources with my residence hall.',
  interestedInTeaching: 'Maybe',
  smsConsent: 'no',
}

export function signupRequestBody(overrides?: {
  eventId?: string
  program?: string
  data?: Partial<SignupFormData>
}) {
  return {
    eventId: overrides?.eventId ?? 'event-123',
    program: overrides?.program ?? 'mhfa',
    data: { ...validSignupFormData, ...overrides?.data },
  }
}
