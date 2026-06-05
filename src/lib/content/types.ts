export type SiteContent = {
  organizationName: string
  siteName: string
  logo: {
    text: string
    imageSrc: string
    imageAlt: string
  }
  footerText: string
  mainSiteUrl: string
  homeRedirectUrl: string
  metadata: {
    defaultTitle: string
    titleTemplate: string
    description: string
  }
  links: {
    smsPolicy: string
  }
  form: {
    universityWebsitePlaceholder: string
    submitLabel: string
    waitlistSubmitLabel: string
    submittingLabel: string
    smsConsent: {
      heading: string
      introBold: string
      legalBeforeLink: string
      policyLinkText: string
      yesLabel: string
      noLabel: string
    }
  }
  nav: Array<{ label: string; href: string }>
}

export type SignupFormFieldKey =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'hometownCity'
  | 'hometownState'
  | 'universityWebsite'
  | 'currentYear'
  | 'isVirginiaResident'
  | 'interestReason'
  | 'communitySupport'
  | 'interestedInTeaching'

export type SignupFormContent = {
  requiredSuffix: string
  requiredHint: string
  messages: {
    missingFields: string
    missingRequiredFields: string
    eventFull: string
    signupSuccess: string
    waitlistSuccess: string
    signupFailed: string
    networkError: string
    trainingNotFound: string
    trainingFull: string
    trainingUnavailable: string
    alreadyRegistered: string
    alreadyOnWaitlist: string
    signupUnavailable: string
  }
  fields: Record<SignupFormFieldKey, string>
  placeholders: {
    hometownState: string
    currentYear: string
  }
  currentYearOptions: string[]
  choices: {
    yes: string
    no: string
    maybe: string
  }
  usStates: string[]
}

export type PagesContent = {
  listing: {
    backToMainSite: string
  }
  capacity: {
    full: string
    oneSeatRemaining: string
    seatsRemaining: string
  }
  eventCard: {
    badgeFull: string
    badgeWaitlist: string
    badgeOpen: string
    signUp: string
    joinWaitlist: string
    fallbackTitle: string
    fallbackLocation: string
  }
  eventDetail: {
    backToEvents: string
    inactive: string
    full: string
    waitlistNotice: string
    signupHeading: string
    waitlistHeading: string
    registrationClosed: string
    browseOtherEvents: string
    eventNotFoundEyebrow: string
    eventNotFoundTitle: string
    eventNotFoundBody: string
    eventNotFoundTry: string
    eventNotFoundLink: string
    eventNotFoundAfterLink: string
  }
  success: {
    metadataTitle: string
    metadataDescription: string
    waitlistMetadataTitle: string
    waitlistMetadataDescription: string
    eyebrow: string
    waitlistEyebrow: string
    heading: string
    waitlistHeading: string
    thankYou: string
    waitlistThankYou: string
    nextStepsHeading: string
    waitlistNextStepsHeading: string
    backToEvents: string
    viewEventDetails: string
  }
}

export type ProgramContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

export type ProgramContent = {
  id: 'mhfa' | 'qpr'
  name: string
  shortLabel: string
  listingTitle: string
  listingIntro: ProgramContentBlock[]
  signupNotice: ProgramContentBlock[]
  successNextSteps: string[]
}
