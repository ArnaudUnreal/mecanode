'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

import { VideoFacade } from '@/components/tool/VideoFacade'
import { Link } from '@/i18n/navigation'
import type { Facet, GalleryEntry } from '@/lib/content'

type Filter = { kind: 'all' } | { kind: 'video' } | { kind: 'category' | 'tag'; slug: string }

const isActive = (filter: Filter, kind: string, slug?: string) =>
  filter.kind === kind && (filter.kind === 'all' || filter.kind === 'video' || filter.slug === slug)

/**
 * Galerie filtrable. Le filtrage se fait dans le navigateur : la page reste statique
 * et le visiteur ne subit aucun aller-retour serveur. Une vignette de vidéo n'appelle
 * YouTube qu'au clic sur le bouton de lecture.
 */
export function GalleryGrid({
  entries,
  categories,
  tags,
}: {
  entries: GalleryEntry[]
  categories: Facet[]
  tags: Facet[]
}) {
  const t = useTranslations('gallery')
  const tool = useTranslations('tool')
  const [filter, setFilter] = React.useState<Filter>({ kind: 'all' })

  const videos = entries.filter((entry) => entry.kind === 'video').length

  const visible = React.useMemo(() => {
    if (filter.kind === 'all') return entries
    if (filter.kind === 'video') return entries.filter((e) => e.kind === 'video')
    if (filter.kind === 'category') return entries.filter((e) => e.categorySlug === filter.slug)

    return entries.filter((e) => e.tagSlugs.includes(filter.slug))
  }, [entries, filter])

  const chip = (label: string, active: boolean, onClick: () => void, key: string) => (
    <button
      aria-pressed={active}
      className={`font-mono text-[11px] tracking-[0.07em] uppercase border px-3.5 py-[7px] transition-colors ${
        active
          ? 'border-cyan bg-cyan font-semibold text-[#04161B]'
          : 'border-line-strong bg-panel text-ink-2 hover:border-cyan hover:text-ink'
      }`}
      key={key}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2.5 border-b border-line-soft pb-7">
        {chip(t('all'), filter.kind === 'all', () => setFilter({ kind: 'all' }), 'all')}
        {videos > 0
          ? chip(t('videos'), filter.kind === 'video', () => setFilter({ kind: 'video' }), 'video')
          : null}
        {categories.map((facet) =>
          chip(
            facet.name,
            isActive(filter, 'category', facet.slug),
            () => setFilter({ kind: 'category', slug: facet.slug }),
            'c-' + facet.slug,
          ),
        )}
        {tags.map((facet) =>
          chip(
            facet.name,
            isActive(filter, 'tag', facet.slug),
            () => setFilter({ kind: 'tag', slug: facet.slug }),
            't-' + facet.slug,
          ),
        )}
        <span
          aria-live="polite"
          className="ml-auto font-mono text-[11px] tracking-[0.07em] uppercase text-ink-3"
        >
          {t('count', { count: visible.length })}
        </span>
      </div>

      {visible.length === 0 ? (
        <div className="clip-node-lg border border-line bg-panel px-6 py-14 text-center">
          <p className="m-0 mb-4 text-ink-2">{t('empty')}</p>
          <button
            className="clip-node border border-line-strong bg-transparent px-[18px] py-2.5 text-[13.5px] font-semibold transition-colors hover:border-cyan hover:bg-panel-2"
            onClick={() => setFilter({ kind: 'all' })}
            type="button"
          >
            {t('reset')}
          </button>
        </div>
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-[18px] p-0 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((entry) =>
            entry.kind === 'video' && entry.videoUrl ? (
              <li key={entry.id} className="relative">
                <VideoFacade
                  className="relative aspect-video overflow-hidden rounded-[10px] border border-line bg-panel"
                  label={tool('playVideo')}
                  poster={entry.url}
                  posterAlt={entry.alt}
                  url={entry.videoUrl}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-3 left-3.5 z-3 border border-line bg-[rgba(8,10,14,0.72)] px-2.5 py-1 font-mono text-[10.5px] tracking-[0.09em] uppercase text-ink-2 backdrop-blur-[6px]"
                >
                  {entry.toolName} — {t('video')}
                </span>
              </li>
            ) : (
              <li key={entry.id}>
                <Link
                  className="group relative block overflow-hidden rounded-[10px] border border-line bg-panel transition-colors hover:border-[#3C5A6E]"
                  href={{ pathname: '/tools/[slug]', params: { slug: entry.toolSlug } }}
                >
                  <span className="relative block aspect-video">
                    <Image
                      alt={entry.alt}
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      src={entry.url}
                    />
                  </span>
                  <span
                    className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-[rgba(6,8,12,0.75)]"
                    aria-hidden="true"
                  />
                  <span className="absolute bottom-3 left-3.5 z-3 border border-line bg-[rgba(8,10,14,0.72)] px-2.5 py-1 font-mono text-[10.5px] tracking-[0.09em] uppercase text-ink-2 backdrop-blur-[6px]">
                    {entry.toolName}
                  </span>
                </Link>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  )
}
