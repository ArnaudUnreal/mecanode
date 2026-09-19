import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Pin } from '@/components/ui/Pin'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHead } from '@/components/ui/SectionHead'
import { ToolCard } from '@/components/ui/ToolCard'
import { getSiteSettings, getTools, type Locale } from '@/lib/content'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')
  const actions = await getTranslations('actions')

  const [settings, tools] = await Promise.all([
    getSiteSettings(locale as Locale),
    getTools(locale as Locale),
  ])

  const stats = settings.stats ?? []

  return (
    <>
      <section className="relative overflow-hidden px-5 pt-20 pb-11 sm:px-8">
        <div className="grid-bg" aria-hidden="true" />
        <div className="relative mx-auto max-w-node">
          {settings.engineRange ? (
            <span className="mb-5 inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.08em] uppercase text-cyan">
              <span
                className="block h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]"
                aria-hidden="true"
              />
              {t('eyebrow', { range: settings.engineRange })}
            </span>
          ) : null}
          <h1 className="m-0 mb-5 text-[34px] font-extrabold tracking-[-0.033em] sm:text-[42px] lg:text-6xl">
            MECA
            <em className="text-cyan not-italic drop-shadow-[0_0_34px_rgba(43,229,255,0.35)]">
              NODE
            </em>
          </h1>
          {settings.lede ? (
            <p className="m-0 mb-8 max-w-[31em] text-lg text-ink-2">{settings.lede}</p>
          ) : null}
          <div className="flex flex-wrap gap-3.5">
            <ButtonLink
              href={settings.fabUrl}
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

      {stats.length > 0 ? (
        <section className="border-y border-line-soft bg-bg-2">
          <div className="mx-auto grid max-w-node grid-cols-2 px-5 sm:px-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.id ?? stat.value}
                className="border-t border-line-soft px-0 py-8 [&:nth-child(-n+2)]:border-t-0 md:border-t-0 md:border-l md:px-7 md:first:border-l-0 md:first:pl-0"
              >
                <b
                  className={`mb-1 block text-3xl font-bold tracking-[-0.02em] ${stat.highlight ? 'text-cyan' : ''}`}
                >
                  {stat.value}
                </b>
                <span className="text-[13px] text-ink-3">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="px-5 py-16 sm:px-8 sm:py-24" id="outils">
        <div className="mx-auto max-w-node">
          <SectionHead
            label={t('toolsLabel')}
            title={t('toolsTitle')}
            lede={t('toolsLede')}
            action={
              <Pin>
                {tools.length} {locale === 'fr' ? 'outils' : 'tools'}
              </Pin>
            }
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, index) => (
              <Reveal key={tool.id} delay={index * 0.08} className="h-full">
                <ToolCard tool={tool} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
