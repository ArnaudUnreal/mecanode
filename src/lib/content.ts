import config from '@payload-config'
import { getPayload } from 'payload'

import type { Media, Page, SiteSetting, Tag, Tool } from '@/payload-types'

export type Locale = 'en' | 'fr'

/** Accès à la base par l'API locale de Payload, jamais par HTTP. */
async function client() {
  return getPayload({ config })
}

export async function getSiteSettings(locale: Locale): Promise<SiteSetting> {
  const payload = await client()

  return payload.findGlobal({ slug: 'site-settings', locale, depth: 1 })
}

export async function getTools(locale: Locale, options?: { featuredOnly?: boolean }): Promise<Tool[]> {
  const payload = await client()

  const result = await payload.find({
    collection: 'tools',
    locale,
    depth: 1,
    limit: 50,
    sort: '-releaseDate',
    where: {
      and: [
        { _status: { equals: 'published' } },
        ...(options?.featuredOnly ? [{ featured: { equals: true } }] : []),
      ],
    },
  })

  return result.docs
}

export async function getTool(slug: string, locale: Locale): Promise<Tool | null> {
  const payload = await client()

  const result = await payload.find({
    collection: 'tools',
    locale,
    depth: 2,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
  })

  return result.docs[0] ?? null
}

export async function getPage(slug: string, locale: Locale): Promise<Page | null> {
  const payload = await client()

  const result = await payload.find({
    collection: 'pages',
    locale,
    depth: 1,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
  })

  return result.docs[0] ?? null
}

/** Un champ `upload` arrive soit résolu, soit sous forme d'identifiant selon la profondeur. */
export function asMedia(value: number | Media | null | undefined): Media | null {
  return value && typeof value === 'object' ? value : null
}

export function asTag(value: number | Tag | null | undefined): Tag | null {
  return value && typeof value === 'object' ? value : null
}

/** Bornes de compatibilité affichées sur les cartes : « 5.3 → 5.7 ». */
export function engineRange(versions: string[] | null | undefined): string | null {
  if (!versions || versions.length === 0) return null
  const sorted = [...versions].sort()

  return sorted.length === 1 ? sorted[0] : `${sorted[0]} → ${sorted[sorted.length - 1]}`
}
