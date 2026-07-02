import type { SignupFormContent } from '@/lib/content/types'

type AlreadyRegisteredAnotherTrainingCopy = Pick<
  SignupFormContent['messages'],
  | 'alreadyRegisteredAnotherTrainingIntro'
  | 'alreadyRegisteredAnotherTrainingBeforeLink'
  | 'alreadyRegisteredAnotherTrainingLinkLabel'
  | 'alreadyRegisteredAnotherTrainingOutro'
>

export function alreadyRegisteredAnotherTrainingMessage(
  messages: AlreadyRegisteredAnotherTrainingCopy
): string {
  return `${messages.alreadyRegisteredAnotherTrainingIntro} ${messages.alreadyRegisteredAnotherTrainingBeforeLink} ${messages.alreadyRegisteredAnotherTrainingLinkLabel} ${messages.alreadyRegisteredAnotherTrainingOutro}`
}

export function isAlreadyRegisteredAnotherTrainingMessage(
  message: string,
  messages: AlreadyRegisteredAnotherTrainingCopy
): boolean {
  return message === alreadyRegisteredAnotherTrainingMessage(messages)
}
