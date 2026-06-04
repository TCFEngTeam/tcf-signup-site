import siteJson from '../../../content/site.json'
import pagesJson from '../../../content/pages.json'
import signupFormJson from '../../../content/signup-form.json'
import mhfaJson from '../../../content/programs/mhfa.json'
import qprJson from '../../../content/programs/qpr.json'
import type { PagesContent, ProgramContent, SignupFormContent, SiteContent } from './types'

export type {
  PagesContent,
  ProgramContent,
  ProgramContentBlock,
  SignupFormContent,
  SiteContent,
  SignupFormFieldKey,
} from './types'
export { formatContent } from './format'
export { getProgramIntroPreview } from './program-blocks'

/** Site-wide copy and links — edit `content/site.json`. */
export const siteContent = siteJson as SiteContent

/** Signup form labels and messages — edit `content/signup-form.json`. */
export const signupFormContent = signupFormJson as SignupFormContent

/** Page chrome (cards, event detail, success) — edit `content/pages.json`. */
export const pagesContent = pagesJson as PagesContent

const programById = {
  mhfa: mhfaJson as ProgramContent,
  qpr: qprJson as ProgramContent,
} as const

export type ProgramContentId = keyof typeof programById

/** Program page copy — edit `content/programs/*.json`. */
export function getProgramContent(programId: ProgramContentId): ProgramContent {
  return programById[programId]
}

export const programContentList = Object.values(programById)
