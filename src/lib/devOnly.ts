/** Mock routes and HubSpot fallbacks are limited to local development. */
export function isDevMockEnabled() {
  return process.env.NODE_ENV === 'development'
}
