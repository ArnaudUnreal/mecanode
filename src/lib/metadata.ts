import type { Metadata } from 'next'

import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/lib/content'

/** Adresse publique du site, base de toutes les adresses canoniques. */
export const SITE_URL = (process.env.SITE_URL || 'https://mecanode.com').replace(/\/$/, '')

type Href = Parameters<typeof getPathname>[0]['href']

/** Adresse canonique de la page dans la langue courante, et ses équivalents par langue. */
export function alternates(href: Href, locale: Locale): Metadata['alternates'] {
  const languages: Record<string, string> = {}
  for (const other of routing.locales) {
    languages[other] = SITE_URL + getPathname({ href, locale: other })
  }

  return {
    canonical: SITE_URL + getPathname({ href, locale }),
    languages,
  }
}

/** Métadonnées d'une page : titre, description, adresses et partage social. */
export function pageMetadata({
  href,
  locale,
  title,
  description,
  image,
}: {
  href: Href
  locale: Locale
  title: string
  description: string
  image?: { url: string; alt: string } | null
}): Metadata {
  const canonical = SITE_URL + getPathname({ href, locale })

  return {
    title,
    description,
    alternates: alternates(href, locale),
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_GB',
      siteName: 'MECANODE',
      title,
      description,
      url: canonical,
      ...(image ? { images: [{ url: image.url, alt: image.alt }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
