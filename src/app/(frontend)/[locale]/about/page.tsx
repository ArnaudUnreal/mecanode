import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { Pin } from '@/components/ui/Pin'
import { SectionHead } from '@/components/ui/SectionHead'
import { demoStats, pick, type Locale } from '@/content/demo'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('about')
  const common = await getTranslations('common')
  const typedLocale = locale as Locale

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-node">
        <SectionHead
          label={t('label')}
          title={t('title')}
          lede={t('lede')}
          action={<Pin accent>{common('comingSoon')}</Pin>}
        />
        <ul className="m-0 list-none p-0">
          {demoStats.map((stat) => (
            <li
              key={stat.value}
              className="relative border-b border-line-soft py-4 pl-7 text-ink-2 last:border-b-0"
            >
              <span
                className="absolute top-[22px] left-0 block h-2 w-2 rounded-full border-[1.5px] border-cyan bg-bg"
                aria-hidden="true"
              />
              <b className="font-semibold text-ink">{stat.value}</b> —{' '}
              {pick(stat.label, typedLocale)}
            </li>
          ))}
        </ul>
        <p className="mt-8 font-mono text-[11px] tracking-[0.06em] uppercase text-ink-3">
          {common('demoContent')}
        </p>
      </div>
    </section>
  )
}
