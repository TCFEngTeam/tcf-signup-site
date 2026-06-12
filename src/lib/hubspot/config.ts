import hubspotJson from '../../../config/hubspot.json'
import type { TrainingProgramId } from '@/lib/programs/config'

export type HubSpotProgramPipelineConfig = {
  pipelineType: string
  pipelineStage: string
  closedPipelineStage?: string
}

export type HubSpotConfig = {
  training: {
    objectId: string
    properties: string[]
    scheduleProperties: {
      session1Start: string
      session1End: string
      session2Start: string
      session2End: string
      cutoffTime: string
    }
  }
  associations: {
    registrant: string
    cancelled: string
    waitlist?: string
    registrantTypeId?: string
    cancelledTypeId?: string
    waitlistTypeId?: string
  }
  programs: Record<TrainingProgramId, HubSpotProgramPipelineConfig>
  contactProperties: {
    firstName: string
    lastName: string
    email: string
    phone: string
    hometownCity: string
    hometownState: string
    currentYear: string
    virginiaResident: string
    interestReason: string
    communitySupport: string
  }
  smsConsent: {
    property: string
    yesValue: string
    noValue: string
  }
  unregister: {
    mode: 'remove' | 'relabel'
  }
}

export const hubspotConfig = hubspotJson as HubSpotConfig

export function getHubSpotApiKey() {
  return process.env.HUBSPOT_API_KEY?.trim() ?? ''
}

export function getTrainingObjectId() {
  return hubspotConfig.training.objectId
}

export function getTrainingProperties() {
  return hubspotConfig.training.properties
}

export function getTrainingSchedulePropertyKeys() {
  return hubspotConfig.training.scheduleProperties
}

export function getTrainingCutoffPropertyKey() {
  return hubspotConfig.training.scheduleProperties.cutoffTime
}

export function getRegistrantAssociationLabel() {
  return hubspotConfig.associations.registrant
}

export function getCancelledAssociationLabel() {
  return hubspotConfig.associations.cancelled
}

export function getWaitlistAssociationLabel() {
  return hubspotConfig.associations.waitlist ?? 'waitlist'
}

export function getRegistrantAssociationTypeId() {
  return hubspotConfig.associations.registrantTypeId?.trim()
}

export function getCancelledAssociationTypeId() {
  return hubspotConfig.associations.cancelledTypeId?.trim()
}

export function getWaitlistAssociationTypeId() {
  return hubspotConfig.associations.waitlistTypeId?.trim()
}

export function getProgramPipelineConfigFromHubSpot(programId: TrainingProgramId) {
  return hubspotConfig.programs[programId]
}

export function getContactPropertyKeys() {
  return hubspotConfig.contactProperties
}

export function getSmsConsentConfig() {
  return hubspotConfig.smsConsent
}

export function getUnregisterHubSpotModeFromConfig() {
  return hubspotConfig.unregister.mode === 'relabel' ? 'relabel' : 'remove'
}
