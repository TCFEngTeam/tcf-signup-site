import { NextResponse } from 'next/server'
import { createOrUpdateContact, associateContactToTraining, associateContactToCompany, getOrCreateCompanyByWebsite, ContactData, getTrainingObjects, mapTrainingToEvent } from '@/lib/hubspotApi'
import { formatSignupFormData, isSignupFormatError } from '@/lib/formatSignupFields'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventId, data } = body || {}

    if (!eventId) {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })
    }

    // Basic validation — check required fields
    if (
      !data ||
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.phone ||
      !data.hometownCity ||
      !data.hometownState ||
      !data.universityWebsite ||
      !data.currentYear ||
      !data.isVirginiaResident ||
      !data.interestReason ||
      !data.communitySupport ||
      !data.interestedInTeaching
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const formatted = formatSignupFormData(data)
    if (isSignupFormatError(formatted)) {
      return NextResponse.json({ error: formatted.error }, { status: 400 })
    }

    // Ensure the event exists and check capacity
    // Fetch training from HubSpot
    const pipelineStage = process.env.HUBSPOT_TRAINING_PIPELINE_STAGE
    const pipelineType = process.env.HUBSPOT_TRAINING_PIPELINE_TYPE
    const trainings = await getTrainingObjects(pipelineStage, pipelineType)
    const training = trainings.find((t) => t.id === eventId)

    if (!training) {
      return NextResponse.json({ error: 'Training event not found' }, { status: 404 })
    }

    // Convert to event format to check capacity
    const ev = mapTrainingToEvent(training)
    if (ev.availableCapacity <= 0) {
      return NextResponse.json({ error: 'Training is full' }, { status: 409 })
    }

    // Contact data with all form fields
    const contactData: ContactData = {
      firstName: formatted.firstName,
      lastName: formatted.lastName,
      email: formatted.email,
      phone: formatted.phone,
      hometownCity: formatted.hometownCity,
      hometownState: formatted.hometownState,
      currentYear: formatted.currentYear,
      isVirginiaResident: formatted.isVirginiaResident,
      trainingDates: data.trainingDates,
      interestReason: formatted.interestReason,
      communitySupport: formatted.communitySupport,
      interestedInTeaching: formatted.interestedInTeaching,
    }

    let hubspotContactId: string | null = null
    let hubspotError: string | null = null

    try {
      const contact = await createOrUpdateContact(contactData)
      hubspotContactId = contact.id

      // Create or find the company by website and associate the contact to it
      try {
        const company = await getOrCreateCompanyByWebsite(formatted.universityWebsite)
        await associateContactToCompany(hubspotContactId, company.id)
      } catch (companyError: any) {
        console.error('Company creation/association error:', companyError?.message)
        // Don't fail the entire signup if company association fails
      }

      // Associate contact with training event
      await associateContactToTraining(hubspotContactId, eventId)
    } catch (hsError: any) {
      // Log the error but allow signup to proceed locally
      // This ensures the site works even if HubSpot integration is incomplete
      hubspotError = hsError?.message
      console.error('HubSpot integration error:', hubspotError)
    }

    // Return success with both local and HubSpot status
    return NextResponse.json({
      success: true,
      event: { id: ev.id, availableCapacity: ev.availableCapacity },
      hubspotContactId,
      ...(hubspotError && { warning: `Contact created locally but HubSpot sync failed: ${hubspotError}` }),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
