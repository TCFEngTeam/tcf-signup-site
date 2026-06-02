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
    smsTerms: string
    smsPrivacy: string
  }
  form: {
    universityWebsitePlaceholder: string
    submitLabel: string
    submittingLabel: string
    smsConsent: {
      heading: string
      yesLabel: string
      noLabel: string
      termsLinkText: string
      privacyLinkText: string
      legalIntro: string
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
    eventFull: string
    signupSuccess: string
    signupFailed: string
    networkError: string
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
  eventCard: {
    badgeFull: string
    badgeOpen: string
    signUp: string
    fallbackTitle: string
    fallbackLocation: string
  }
  eventDetail: {
    backToEvents: string
    inactive: string
    full: string
    signupHeading: string
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
    eyebrow: string
    heading: string
    thankYou: string
    nextStepsHeading: string
    backToEvents: string
    viewEventDetails: string
  }
}

export type ProgramContent = {
  id: 'mhfa' | 'qpr'
  name: string
  shortLabel: string
  listingTitle: string
  listingIntro: string[]
  signupNotice: string[]
  successNextSteps: string[]
}
