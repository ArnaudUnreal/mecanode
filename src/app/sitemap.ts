import type { MetadataRoute } from 'next'

import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { getToolSlugs } from '@/lib/content'
import { SITE_URL } from '@/lib/metadata'

type Href = Parameters<typeof getPathname>[0]['href']

/** Une entrée par page et par langue, chacune listant ses équivalents dans l'autre langue. */
function entry(href: Href, priority: number): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    languages[locale] = SITE_URL + getPathname({ href, locale })
  }

  return routing.locales.map((locale) => ({
    url: SITE_URL + getPathname({ href, locale }),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority,
    alternates: { languages },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getToolSlugs()

  return [
    ...entry('/', 1),
    ...entry('/gallery', 0.7),
    ...entry('/about', 0.7),
    ...entry('/contact', 0.5),
    ...slugs.flatMap((slug) => entry({ pathname: '/tools/[slug]', params: { slug } }, 0.9)),
  ]
}
