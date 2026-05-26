import React from 'react'

type SignupFormProps = {
  eventId: string
  prefillData?: any
}

export default function EventSignupForm({ eventId, prefillData }: SignupFormProps) {
  // Placeholder form scaffold. Fields will be finalized later.
  return (
    <form className="event-signup-form" onSubmit={(e) => e.preventDefault()}>
      <label>
        Name
        <input name="name" defaultValue={prefillData?.name ?? ''} />
      </label>

      <label>
        Email
        <input name="email" defaultValue={prefillData?.email ?? ''} />
      </label>

      <label>
        Phone (placeholder)
        <input name="phone" defaultValue={prefillData?.phone ?? ''} />
      </label>

      <button type="submit">Submit</button>
    </form>
  )
}
