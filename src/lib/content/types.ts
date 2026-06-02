export type SiteContent = {
  organizationName: string
  siteName: string
  logoText: string
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

export type ProgramContent = {
  id: 'mhfa' | 'qpr'
  name: string
  shortLabel: string
  listingTitle: string
  listingIntro: string[]
  signupNotice: string[]
  successNextSteps: string[]
}
