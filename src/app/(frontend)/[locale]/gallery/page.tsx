import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { SectionHead } from '@/components/ui/SectionHead'
import { getGalleryEntries, getGalleryFacets, type Locale } from '@/lib/content'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gallery' })

  return pageMetadata({
    href: '/gallery',
    locale: locale as Locale,
    title: t('title') + ' — MECANODE',
    description: t('lede'),
  })
}

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
