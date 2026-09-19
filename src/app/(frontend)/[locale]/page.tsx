import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Pin } from '@/components/ui/Pin'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHead } from '@/components/ui/SectionHead'
import { ToolCard } from '@/components/ui/ToolCard'
import { demoSite, demoStats, demoTools, pick, type Locale } from '@/content/demo'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')
  const actions = await getTranslations('actions')
  const typedLocale = locale as Locale

  return (
    <>
      <section className="relative overflow-hidden px-5 pt-20 pb-11 sm:px-8">
        <div className="grid-bg" aria-hidden="true" />
        <div className="relative mx-auto max-w-node">
          <span className="mb-5 inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.08em] uppercase text-cyan">
            <span
              className="block h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]"
              aria-hidden="true"
            />
            {t('eyebrow', { range: demoSite.engineRange })}
          </span>
          <h1 className="m-0 mb-5 text-[34px] font-extrabold tracking-[-0.033em] sm:text-[42px] lg:text-6xl">
            MECA
            <em className="text-cyan not-italic drop-shadow-[0_0_34px_rgba(43,229,255,0.35)]">
              NODE
            </em>
          </h1>
          <p className="m-0 mb-8 max-w-[31em] text-lg text-ink-2">{t('lede')}</p>
          <div className="flex flex-wrap gap-3.5">
            <ButtonLink
              href={demoSite.fabUrl}
              rel="noopener noreferrer"
              target="_blank"
              variant="fab"
            >
              {actions('browseToolset')}
              <ArrowRight />
            </ButtonLink>
            <ButtonLink href="#outils" variant="ghost">
              {actions('watchReel')}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-y border-line-soft bg-bg-2">
        <div className="mx-auto grid max-w-node grid-cols-2 px-5 sm:px-8 md:grid-cols-4">
          {demoStats.map((stat) => (
            <div
              key={stat.value}
              className="border-t border-line-soft px-0 py-8 [&:nth-child(-n+2)]:border-t-0 md:border-t-0 md:border-l md:px-7 md:first:border-l-0 md:first:pl-0"
            >
              <b
                className={`mb-1 block text-3xl font-bold tracking-[-0.02em] ${stat.highlight ? 'text-cyan' : ''}`}
              >
                {stat.value}
              </b>
              <span className="text-[13px] text-ink-3">{pick(stat.label, typedLocale)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24" id="outils">
        <div className="mx-auto max-w-node">
          <SectionHead
            label={t('toolsLabel')}
            title={t('toolsTitle')}
            lede={t('toolsLede')}
            action={
              <Pin>
                {demoTools.length} {locale === 'fr' ? 'outils' : 'tools'}
              </Pin>
            }
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {demoTools.map((tool, index) => (
              <Reveal key={tool.slug} delay={index * 0.08}>
                <ToolCard tool={tool} locale={typedLocale} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
