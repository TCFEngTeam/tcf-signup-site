import siteJson from '../../../content/site.json'
import mhfaJson from '../../../content/programs/mhfa.json'
import qprJson from '../../../content/programs/qpr.json'
import type { ProgramContent, SiteContent } from './types'

export type { ProgramContent, SiteContent }

/** Site-wide copy and links — edit `content/site.json`. */
export const siteContent = siteJson as SiteContent

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
