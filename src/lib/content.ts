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

/** Ordre officiel des versions d'Unreal proposées sur une fiche outil. */
const ENGINE_ORDER = [
  '4.25',
  '4.26',
  '4.27',
  '5.0',
  '5.1',
  '5.2',
  '5.3',
  '5.4',
  '5.5',
  '5.6',
  '5.7',
]

/**
 * Compatibilité affichée sur les cartes : les versions qui se suivent forment une plage,
 * les trous coupent la liste. « 4.25 → 4.27 · 5.3 → 5.6 ».
 */
export function engineRange(versions: string[] | null | undefined): string | null {
  if (!versions || versions.length === 0) return null

  const ordered = versions
    .filter((version) => ENGINE_ORDER.includes(version))
    .sort((a, b) => ENGINE_ORDER.indexOf(a) - ENGINE_ORDER.indexOf(b))

  if (ordered.length === 0) return null

  const groups: string[][] = [[ordered[0]]]
  for (let index = 1; index < ordered.length; index += 1) {
    const previous = groups[groups.length - 1]
    const isNext =
      ENGINE_ORDER.indexOf(ordered[index]) === ENGINE_ORDER.indexOf(previous[previous.length - 1]) + 1

    if (isNext) previous.push(ordered[index])
    else groups.push([ordered[index]])
  }

  return groups
    .map((group) => (group.length === 1 ? group[0] : group[0] + ' → ' + group[group.length - 1]))
    .join(' · ')
}

/** Identifiants d'URL de tous les outils publiés, pour le rendu statique des fiches. */
export async function getToolSlugs(): Promise<string[]> {
  const payload = await client()

  const result = await payload.find({
    collection: 'tools',
    depth: 0,
    limit: 200,
    pagination: false,
    where: { _status: { equals: 'published' } },
  })

  return result.docs.map((tool) => tool.slug)
}
