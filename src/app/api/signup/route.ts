import { NextResponse } from 'next/server'
import {
  AlreadyRegisteredError,
  associateContactToCompany,
  associateContactToTraining,
  createOrUpdateContact,
  getContactByEmail,
  getOrCreateCompanyByWebsite,
  isContactRegisteredForTraining,
  type ContactData,
} from '@/lib/hubspot/api'
import { signupFormContent } from '@/lib/content'
import { formatSignupFormData, isSignupFormatError } from '@/lib/signup/format-fields'
import { loadProgramEventById } from '@/lib/programs/events'
import { isTrainingProgramId } from '@/lib/programs/config'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const messages = signupFormContent.messages

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
      !data.communitySupport
    ) {
      return NextResponse.json({ error: messages.missingRequiredFields }, { status: 400 })
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
      return NextResponse.json({ error: messages.trainingNotFound }, { status: 404 })
    }

    if (ev.registrationClosed) {
      return NextResponse.json({ error: messages.registrationClosed }, { status: 409 })
    }

    if (ev.isFull) {
      return NextResponse.json({ error: messages.trainingFull }, { status: 409 })
    }

    const existingContact = await getContactByEmail(formatted.email)
    if (
      existingContact?.id &&
      (await isContactRegisteredForTraining(existingContact.id, eventId))
    ) {
      return NextResponse.json(
        {
          error: messages.alreadyRegistered,
        },
        { status: 409 }
      )
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
    } catch (hsError: unknown) {
      if (hsError instanceof AlreadyRegisteredError) {
        return NextResponse.json({ error: hsError.message }, { status: 409 })
      }
      const hubspotError =
        hsError instanceof Error ? hsError.message : 'HubSpot sync failed'
      console.error('HubSpot integration error:', hubspotError)
      return NextResponse.json({ error: messages.signupUnavailable }, { status: 502 })
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
