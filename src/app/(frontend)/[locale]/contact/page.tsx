import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { ContactForm } from '@/components/contact/ContactForm'
import { SectionHead } from '@/components/ui/SectionHead'
import { makeChallenge } from '@/lib/contact'

// La question anti-robot est tirée à chaque affichage : la page n'est pas mise en cache.
export const dynamic = 'force-dynamic'

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
