import { RichText } from '@payloadcms/richtext-lexical/react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { SectionHead } from '@/components/ui/SectionHead'
import { getPage, type Locale } from '@/lib/content'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('about')
  const page = await getPage('about', locale as Locale)

  if (!page) notFound()

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-node">
        <SectionHead label={t('label')} title={page.title} lede={page.lede ?? undefined} />
        {page.content ? (
          <div className="max-w-[66ch] text-ink-2 [&_p]:mb-4">
            <RichText data={page.content} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
