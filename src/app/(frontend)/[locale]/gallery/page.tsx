import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { SectionHead } from '@/components/ui/SectionHead'
import { getGalleryEntries, getGalleryFacets, type Locale } from '@/lib/content'

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('gallery')

  const [entries, facets] = await Promise.all([
    getGalleryEntries(locale as Locale),
    getGalleryFacets(locale as Locale),
  ])

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-node">
        <SectionHead label={t('label')} title={t('title')} lede={t('lede')} />
        <GalleryGrid categories={facets.categories} entries={entries} tags={facets.tags} />
      </div>
    </section>
  )
}
