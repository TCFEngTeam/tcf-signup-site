import { NextResponse } from 'next/server'
import { findMockEvent, registerMockEvent } from '../_mockData'
import { createOrUpdateContact, associateContactToTraining, ContactData } from '@/lib/hubspotApi'

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
      !data.trainingDates ||
      !data.interestReason ||
      !data.communitySupport ||
      !data.interestedInTeaching
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Ensure the event exists and check capacity
    const ev = findMockEvent(eventId)
    if (!ev) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    if (ev.registered >= ev.capacity) {
      return NextResponse.json({ error: 'Event is full' }, { status: 409 })
    }

    // Contact data with all form fields
    const contactData: ContactData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      hometownCity: data.hometownCity,
      hometownState: data.hometownState,
      universityWebsite: data.universityWebsite,
      currentYear: data.currentYear,
      isVirginiaResident: data.isVirginiaResident,
      trainingDates: data.trainingDates,
      interestReason: data.interestReason,
      communitySupport: data.communitySupport,
      interestedInTeaching: data.interestedInTeaching,
    }

    let hubspotContactId: string | null = null
    let hubspotError: string | null = null

    // Attempt HubSpot integration
    try {
      const contact = await createOrUpdateContact(contactData)
      hubspotContactId = contact.id

      // Associate contact with training event
      await associateContactToTraining(hubspotContactId, eventId)
    } catch (hsError: any) {
      // Log the error but allow signup to proceed locally
      // This ensures the site works even if HubSpot integration is incomplete
      hubspotError = hsError?.message
      console.error('HubSpot integration error:', hubspotError)
    }

    // Register in local mock data
    const updated = registerMockEvent(eventId)

    // Return success with both local and HubSpot status
    return NextResponse.json({
      success: true,
      event: { id: updated.id, registered: updated.registered },
      hubspotContactId,
      ...(hubspotError && { warning: `Contact created locally but HubSpot sync failed: ${hubspotError}` }),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
