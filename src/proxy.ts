import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Les routes Payload — /admin et /api — ne passent jamais par ce middleware.
  matcher: ['/', '/(en|fr)/:path*'],
}
