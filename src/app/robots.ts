import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/metadata'

/** Le back-office et l'API de Payload ne sont pas des pages publiques. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
