import { NextResponse } from 'next/server'
import { createOrUpdateContact, associateContactToTraining, associateContactToCompany, getOrCreateCompanyByWebsite, ContactData } from '@/lib/hubspotApi'
import { formatSignupFormData, isSignupFormatError } from '@/lib/formatSignupFields'
import { loadProgramEventById } from '@/lib/programEvents'
import { isTrainingProgramId } from '@/lib/trainingPrograms'
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventId, program, data } = body || {}

    if (!eventId) {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })
    }

    if (!program || !isTrainingProgramId(program)) {
      return NextResponse.json({ error: 'Missing or invalid program (mhfa or qpr)' }, { status: 400 })
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

    const { event: ev, error: eventError } = await loadProgramEventById(program, eventId)

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 500 })
    }

    if (!ev) {
      return NextResponse.json({ error: 'Training event not found' }, { status: 404 })
    }

    if (ev.isFull) {      return NextResponse.json({ error: 'Training is full' }, { status: 409 })
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
      smsConsent: formatted.smsConsent,
    }

    let hubspotContactId: string

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
      const hubspotError = hsError?.message ?? 'HubSpot sync failed'
      console.error('HubSpot integration error:', hubspotError)
      return NextResponse.json(
        { error: 'Unable to complete signup. Please try again or contact support.' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      event: { id: ev.id, availableCapacity: ev.availableCapacity },
      hubspotContactId,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
