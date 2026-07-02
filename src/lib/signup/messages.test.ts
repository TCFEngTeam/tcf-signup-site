import { describe, expect, it } from 'vitest'
import { signupFormContent } from '@/lib/content'
import {
  alreadyRegisteredAnotherTrainingMessage,
  isAlreadyRegisteredAnotherTrainingMessage,
} from '@/lib/signup/messages'

describe('alreadyRegisteredAnotherTrainingMessage', () => {
  it('builds the plain-text API error message', () => {
    expect(alreadyRegisteredAnotherTrainingMessage(signupFormContent.messages)).toBe(
      'You are already registered for another training session. Cancel your registration here or find the link in your email when you signed up previously.'
    )
  })

  it('detects the composed message', () => {
    const message = alreadyRegisteredAnotherTrainingMessage(signupFormContent.messages)
    expect(isAlreadyRegisteredAnotherTrainingMessage(message, signupFormContent.messages)).toBe(true)
  })
})
