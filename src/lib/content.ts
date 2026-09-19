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

export type GalleryEntry = {
  id: number
  kind: 'image' | 'video'
  videoUrl?: string
  url: string
  alt: string
  width: number | null
  height: number | null
  toolName: string
  toolSlug: string
  categorySlug: string | null
  categoryName: string | null
  tagSlugs: string[]
}

/**
 * Tous les visuels des outils publiés, visuel principal compris, à plat.
 * Chaque entrée porte de quoi filtrer : catégorie et étiquettes de son outil.
 */
export async function getGalleryEntries(locale: Locale): Promise<GalleryEntry[]> {
  const tools = await getTools(locale)
  const entries: GalleryEntry[] = []

  for (const tool of tools) {
    const category = asTag(tool.category)
    const tagSlugs = (tool.tags ?? [])
      .map(asTag)
      .filter(Boolean)
      .map((tag) => tag!.slug)

    // La vidéo passe devant : c'est l'aperçu le plus parlant d'un outil.
    const poster = asMedia(tool.videoPoster) ?? asMedia(tool.mainImage)
    if (tool.videoUrl && poster?.url) {
      entries.push({
        id: -poster.id,
        kind: 'video',
        videoUrl: tool.videoUrl,
        url: poster.url,
        alt: poster.alt ?? '',
        width: poster.width ?? null,
        height: poster.height ?? null,
        toolName: tool.name,
        toolSlug: tool.slug,
        categorySlug: category?.slug ?? null,
        categoryName: category?.name ?? null,
        tagSlugs,
      })
    }

    for (const value of [tool.mainImage, ...(tool.gallery ?? [])]) {
      const media = asMedia(value)
      if (!media?.url) continue

      entries.push({
        kind: 'image',
        id: media.id,
        url: media.url,
        alt: media.alt ?? '',
        width: media.width ?? null,
        height: media.height ?? null,
        toolName: tool.name,
        toolSlug: tool.slug,
        categorySlug: category?.slug ?? null,
        categoryName: category?.name ?? null,
        tagSlugs,
      })
    }
  }

  return entries
}

export type Facet = { slug: string; name: string; count: number }

/** Catégories et étiquettes réellement présentes dans la galerie, avec leur décompte. */
export async function getGalleryFacets(locale: Locale) {
  const payload = await client()
  const entries = await getGalleryEntries(locale)

  const tags = await payload.find({ collection: 'tags', locale, depth: 0, limit: 100 })
  const nameOf = new Map(tags.docs.map((tag) => [tag.slug, tag.name]))

  const count = (slugs: string[]) =>
    slugs.reduce<Record<string, number>>((acc, slug) => {
      acc[slug] = (acc[slug] ?? 0) + 1
      return acc
    }, {})

  const categories = count(entries.map((e) => e.categorySlug).filter(Boolean) as string[])
  const tagCounts = count(entries.flatMap((e) => e.tagSlugs))

  const toFacets = (counts: Record<string, number>): Facet[] =>
    Object.entries(counts)
      .map(([slug, value]) => ({ slug, name: nameOf.get(slug) ?? slug, count: value }))
      .sort((a, b) => b.count - a.count)

  return { categories: toFacets(categories), tags: toFacets(tagCounts) }
}
