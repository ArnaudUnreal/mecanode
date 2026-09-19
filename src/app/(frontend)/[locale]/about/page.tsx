import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { asMedia, getPage, getSiteSettings, type Locale } from '@/lib/content'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const page = await getPage('about', locale as Locale)

  return pageMetadata({
    href: '/about',
    locale: locale as Locale,
    title: (page?.title ?? 'Arnaud Szobad') + ' — MECANODE',
    description: page?.lede ?? '',
  })
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('about')
  const [page, settings] = await Promise.all([
    getPage('about', locale as Locale),
    getSiteSettings(locale as Locale),
  ])

  if (!page) notFound()

  const portrait = asMedia(page.heroImage)
  const timeline = page.timeline ?? []
  const stats = settings.stats ?? []

  return (
    <>
      <section className="mx-auto grid max-w-node items-center gap-12 px-5 pt-14 pb-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative aspect-square overflow-hidden rounded-[14px] border border-line bg-[#0C0914]">
          {portrait?.url ? (
            <Image
              alt={portrait.alt ?? ''}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 420px"
              src={portrait.url}
            />
          ) : (
            <div className="graph-dots flex h-full w-full items-center justify-center">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-3">
                {t('portraitMissing')}
              </span>
            </div>
          )}
        </div>

        <div>
          {page.role ? (
            <span className="mb-5 block font-mono text-xs tracking-[0.08em] uppercase text-cyan">
              {page.role}
            </span>
          ) : null}
          <h1 className="m-0 mb-2 text-[38px] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-[46px]">
            {page.title}
          </h1>
          {page.lede ? (
            <p className="m-0 mb-4 max-w-[52ch] text-[17px] text-ink-2">{page.lede}</p>
          ) : null}
          {page.content ? (
            <div className="max-w-[52ch] text-[17px] text-ink-2 [&_p]:mb-4">
              <RichText data={page.content} />
            </div>
          ) : null}

          {page.badgeTitle ? (
            <div className="mt-6 flex max-w-[520px] items-center gap-4 rounded-[10px] border border-[rgba(43,229,255,0.22)] bg-[rgba(43,229,255,0.05)] px-[18px] py-4">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M11 2 L19 6.5 V15.5 L11 20 L3 15.5 V6.5 Z" stroke="var(--cyan)" strokeWidth="1.3" />
                <path d="M7.5 11 L10 13.5 L14.5 8.5" stroke="var(--cyan)" strokeWidth="1.5" />
              </svg>
              <span>
                <b className="mb-0.5 block text-[15px] font-semibold text-ink">{page.badgeTitle}</b>
                {page.badgeText ? (
                  <span className="text-[13.5px] text-ink-2">{page.badgeText}</span>
                ) : null}
              </span>
            </div>
          ) : null}
        </div>
      </section>

      {stats.length > 0 ? (
        <section className="mt-12 border-y border-line-soft bg-bg-2">
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

      {timeline.length > 0 ? (
        <section className="mx-auto max-w-node px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="m-0 mb-9 text-[26px] font-bold tracking-[-0.02em]">{t('timeline')}</h2>
          <ol className="m-0 ml-1.5 list-none border-l border-line p-0 pl-7">
            {timeline.map((item, index) => (
              <li key={item.id ?? item.period} className="relative pb-7 last:pb-0">
                <span
                  aria-hidden="true"
                  className={`absolute top-1.5 -left-[34px] block h-[11px] w-[11px] rounded-full border-[1.5px] bg-[#0C0914] ${
                    index === 0
                      ? 'border-cyan shadow-[0_0_12px_rgba(43,229,255,0.5)]'
                      : 'border-cyan-dim'
                  }`}
                />
                <span className="mb-1.5 block font-mono text-[11px] tracking-[0.08em] uppercase text-ink-3">
                  {item.period}
                </span>
                <h3 className="m-0 mb-1 text-base font-semibold">{item.title}</h3>
                {item.text ? <p className="m-0 text-sm text-ink-2">{item.text}</p> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </>
  )
}
