import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { ArrowRight, ArrowUpRight, ButtonLink } from '@/components/ui/Button'
import { HeroGraph } from '@/components/ui/HeroGraph'
import { HeroTitle } from '@/components/ui/HeroTitle'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHead } from '@/components/ui/SectionHead'
import { ToolCard } from '@/components/ui/ToolCard'
import { ToolWires } from '@/components/ui/ToolWires'
import { Link } from '@/i18n/navigation'
import { asMedia, getSiteSettings, getTools, type Locale } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const settings = await getSiteSettings(locale as Locale)

  return pageMetadata({
    href: '/',
    locale: locale as Locale,
    title: 'MECANODE — ' + (settings.tagline ?? t('toolsTitle')),
    description: settings.lede ?? t('toolsLede', { count: 5 }),
  })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')
  const actions = await getTranslations('actions')
  const galleryLabels = await getTranslations('gallery')

  const [settings, tools] = await Promise.all([
    getSiteSettings(locale as Locale),
    getTools(locale as Locale),
  ])

  const stats = settings.stats ?? []
  const heroMeta = settings.heroMeta ?? []
  const tiles = tools
    .map((tool) => ({ tool, media: asMedia(tool.mainImage) }))
    .filter((tile) => tile.media?.url)
    .slice(0, 4)

  return (
    <>
      <section className="relative overflow-hidden px-5 pt-16 pb-11 sm:px-8 sm:pt-20">
        <div className="grid-bg" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-node items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <div>
            {settings.engineRange ? (
              <span className="mb-5 inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.08em] uppercase text-cyan">
                <span
                  className="block h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]"
                  aria-hidden="true"
                />
                {t('eyebrow', { range: settings.engineRange })}
              </span>
            ) : null}

            <HeroTitle value={settings.heroTitle ?? settings.siteName} />

            {settings.lede ? (
              <p className="m-0 mb-8 max-w-[31em] text-lg text-ink-2">{settings.lede}</p>
            ) : null}

            <div className="mb-8 flex flex-wrap gap-3.5">
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
                {actions('seeTools')}
              </ButtonLink>
            </div>

            {heroMeta.length > 0 ? (
              <ul className="m-0 flex list-none flex-wrap gap-x-7 gap-y-2 p-0 font-mono text-xs tracking-[0.08em] uppercase text-ink-3">
                {heroMeta.map((item) => (
                  <li key={item.id ?? item.label} className="flex items-center gap-2">
                    <i
                      className="block h-[5px] w-[5px] rotate-45 bg-cyan-dim"
                      aria-hidden="true"
                    />
                    {item.label}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <HeroGraph title="BP_MecanodeSpawner — Event Graph" />
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20" id="outils">
        <div className="mx-auto max-w-node">
          <SectionHead
            label={t('toolsLabel')}
            title={t('toolsTitle')}
            lede={t('toolsLede', { count: tools.length })}
            action={
              <ButtonLink
                href={settings.fabUrl}
                rel="noopener noreferrer"
                target="_blank"
                variant="ghost"
              >
                {actions('allTools')}
                <ArrowUpRight />
              </ButtonLink>
            }
          />
          <div className="relative">
            <ToolWires />
            <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool, index) => (
                <Reveal key={tool.id} delay={index * 0.08} className="h-full">
                  <ToolCard tool={tool} />
                </Reveal>
              ))}
            </div>
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

      {tiles.length > 0 ? (
        <section className="px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-node">
            <SectionHead
              label={t('galleryLabel')}
              title={t('galleryTitle')}
              lede={galleryLabels('lede')}
              action={
                <Link
                  className="clip-node inline-flex items-center gap-2.5 border border-line bg-transparent px-[18px] py-2.5 text-[13.5px] font-semibold transition-colors hover:border-[#3A2F55] hover:bg-panel-2"
                  href="/gallery"
                >
                  {actions('openGallery')}
                  <ArrowRight />
                </Link>
              }
            />
            <div className="grid auto-rows-[186px] grid-cols-2 gap-4 md:grid-cols-4">
              {tiles.map((tile, index) => (
                <Reveal
                  key={tile.tool.id}
                  delay={index * 0.06}
                  className={index === 0 ? 'col-span-2 row-span-2 h-full' : 'h-full'}
                >
                  <div className="relative h-full min-h-[186px] overflow-hidden rounded-[10px] border border-line bg-panel">
                    <Image
                      alt={tile.media?.alt ?? ''}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 50vw, 400px"
                      src={tile.media!.url!}
                    />
                    <div
                      className="absolute inset-0 bg-linear-to-b from-transparent to-[rgba(6,8,12,0.75)]"
                      aria-hidden="true"
                    />
                    <span className="absolute bottom-3 left-3.5 z-3 border border-line bg-[rgba(8,10,14,0.72)] px-2.5 py-1 font-mono text-[10.5px] tracking-[0.09em] uppercase text-ink-2 backdrop-blur-[6px]">
                      {tile.tool.name}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {settings.ctaTitle ? (
        <section className="px-5 pb-20 sm:px-8">
          <div className="mx-auto max-w-node">
            <div className="clip-node-lg relative overflow-hidden border border-line bg-linear-to-br from-[#17122A] to-[#0A0812] px-6 py-12 text-center sm:px-12 sm:py-14">
              <div
                className="grid-bg [mask-image:radial-gradient(ellipse_70%_100%_at_50%_50%,#000_20%,transparent_100%)]"
                aria-hidden="true"
              />
              <div className="relative">
                <span className="mb-4 block font-mono text-xs tracking-[0.08em] uppercase text-cyan-dim">
                  {t('ctaLabel')}
                </span>
                <h2 className="m-0 mb-3 text-[28px] tracking-[-0.025em] sm:text-[34px]">
                  {settings.ctaTitle}
                </h2>
                {settings.ctaLede ? (
                  <p className="mx-auto mb-7 max-w-[48ch] text-ink-2">{settings.ctaLede}</p>
                ) : null}
                <ButtonLink
                  href={settings.fabUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  variant="fab"
                >
                  {actions('openStore')}
                  <ArrowUpRight />
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
