import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { ContactForm } from '@/components/contact/ContactForm'
import { SectionHead } from '@/components/ui/SectionHead'
import { makeChallenge } from '@/lib/contact'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import type { Locale } from '@/lib/content'

// La question anti-robot est tirée à chaque affichage : la page n'est pas mise en cache.
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return pageMetadata({
    href: '/contact',
    locale: locale as Locale,
    title: t('title') + ' — MECANODE',
    description: t('lede'),
  })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('contact')
  const challenge = makeChallenge()

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-node">
        <SectionHead label={t('label')} title={t('title')} lede={t('lede')} />
        <ContactForm challenge={challenge} />
      </div>
    </section>
  )
}
