import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { ToolGallery, type GalleryItem } from '@/components/tool/ToolGallery'
import { VideoFacade } from '@/components/tool/VideoFacade'
import { ArrowUpRight, ButtonLink } from '@/components/ui/Button'
import { Pin } from '@/components/ui/Pin'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { asMedia, asTag, engineRange, getTool, getToolSlugs, type Locale } from '@/lib/content'
import { pageMetadata, SITE_URL } from '@/lib/metadata'

type Params = { locale: string; slug: string }

export async function generateStaticParams() {
  const slugs = await getToolSlugs()

  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const tool = await getTool(slug, locale as Locale)

  if (!tool) return {}

  const cover = asMedia(tool.mainImage)

  return pageMetadata({
    href: { pathname: '/tools/[slug]', params: { slug } },
    locale: locale as Locale,
    title: `${tool.name} — MECANODE`,
    description: tool.tagline,
    image: cover?.url ? { url: SITE_URL + cover.url, alt: cover.alt ?? tool.name } : null,
  })
}

export default async function ToolPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const tool = await getTool(slug, locale as Locale)
  if (!tool) notFound()

  const t = await getTranslations('tool')
  const nav = await getTranslations('nav')
  const actions = await getTranslations('actions')
  const format = await getFormatter()

  const cover = asMedia(tool.mainImage)
  const category = asTag(tool.category)
  const range = engineRange(tool.engineVersions)
  const tags = (tool.tags ?? []).map(asTag).filter(Boolean)

  const gallery: GalleryItem[] = [tool.mainImage, ...(tool.gallery ?? [])]
    .map(asMedia)
    .filter((media): media is NonNullable<typeof media> => Boolean(media?.url))
    .map((media) => ({
      id: media.id,
      url: media.url as string,
      alt: media.alt ?? '',
      width: media.width,
      height: media.height,
    }))

  const latestNote = (tool.releaseNotes ?? [])[0]
  const day = (value: string) =>
    format.dateTime(new Date(value), { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <>
      <nav aria-label={t('breadcrumb')} className="mx-auto max-w-node px-5 pt-7 pb-4 sm:px-8">
        <ol className="m-0 flex list-none gap-2.5 p-0 font-mono text-[11px] tracking-[0.08em] uppercase text-ink-3">
          <li>
            <Link className="transition-colors hover:text-cyan" href="/">
              {nav('tools')}
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#2A3242]">
            /
          </li>
          <li className="text-ink-2">{tool.name}</li>
        </ol>
      </nav>

      <section className="mx-auto grid max-w-node items-start gap-9 px-5 pb-16 sm:px-8 lg:grid-cols-[1.6fr_0.95fr]">
        <div>
          {tool.videoUrl ? (
            <div className="mb-3">
              <VideoFacade
                label={t('playVideo')}
                poster={cover?.url ?? null}
                posterAlt={cover?.alt ?? ''}
                url={tool.videoUrl}
              />
            </div>
          ) : null}
          <ToolGallery items={gallery} label={t('gallery')} />
        </div>

        <aside className="clip-node-lg border border-line bg-panel p-6 lg:sticky lg:top-[92px]">
          {category ? (
            <span className="mb-3 block font-mono text-[11px] tracking-[0.08em] uppercase text-cyan-dim">
              {category.name}
            </span>
          ) : null}
          <h1 className="m-0 mb-2.5 text-3xl leading-[1.1] font-bold tracking-[-0.025em]">
            {tool.name}
          </h1>
          <p className="m-0 mb-5 text-[15px] text-ink-2">{tool.tagline}</p>

          <ButtonLink
            className="mb-2.5 w-full justify-center"
            href={tool.fabUrl}
            rel="noopener noreferrer"
            target="_blank"
            variant="fab"
          >
            {actions('getItOnFab')}
            <ArrowUpRight />
          </ButtonLink>

          <table className="mt-4 w-full border-collapse border-t border-line-soft text-[13.5px]">
            <tbody>
              <tr>
                <td className="w-[44%] border-b border-line-soft pt-3 pb-2.5 align-top font-mono text-[11px] tracking-[0.07em] uppercase text-ink-3">
                  {t('engine')}
                </td>
                <td className="border-b border-line-soft py-2.5 align-top">{range ?? '—'}</td>
              </tr>
              {tool.releaseDate ? (
                <tr>
                  <td className="border-b border-line-soft pt-3 pb-2.5 align-top font-mono text-[11px] tracking-[0.07em] uppercase text-ink-3">
                    {t('released')}
                  </td>
                  <td className="border-b border-line-soft py-2.5 align-top">
                    {day(tool.releaseDate)}
                  </td>
                </tr>
              ) : null}
              {latestNote ? (
                <tr>
                  <td className="border-b border-line-soft pt-3 pb-2.5 align-top font-mono text-[11px] tracking-[0.07em] uppercase text-ink-3">
                    {t('latestVersion')}
                  </td>
                  <td className="border-b border-line-soft py-2.5 align-top">
                    {latestNote.version} — {day(latestNote.date)}
                  </td>
                </tr>
              ) : null}
              <tr>
                <td className="border-b border-line-soft pt-3 pb-2.5 align-top font-mono text-[11px] tracking-[0.07em] uppercase text-ink-3">
                  {t('support')}
                </td>
                <td className="border-b border-line-soft py-2.5 align-top">{t('supportValue')}</td>
              </tr>
            </tbody>
          </table>

          {tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Pin key={tag!.id}>{tag!.name}</Pin>
              ))}
            </div>
          ) : null}
        </aside>
      </section>

      {tool.description ? (
        <section className="mx-auto max-w-node px-5 pb-16 sm:px-8">
          <h2 className="m-0 mb-3.5 text-2xl font-bold tracking-[-0.02em]">{t('whatItDoes')}</h2>
          <div className="max-w-[66ch] text-ink-2 [&_p]:mb-4">
            <RichText data={tool.description} />
          </div>
        </section>
      ) : null}

      {(tool.releaseNotes ?? []).length > 0 ? (
        <section className="mx-auto max-w-node px-5 pb-24 sm:px-8">
          <h2 className="m-0 mb-3.5 text-2xl font-bold tracking-[-0.02em]">{t('releaseNotes')}</h2>
          <div className="border-t border-line-soft">
            {(tool.releaseNotes ?? []).map((note) => (
              <div
                key={note.id ?? note.version}
                className="grid gap-3 border-b border-line-soft py-4 sm:grid-cols-[150px_1fr] sm:gap-5"
              >
                <div>
                  <span className="block font-mono text-xs tracking-[0.07em] text-cyan">
                    {note.version}
                  </span>
                  <span className="mt-1 block font-mono text-[11px] tracking-[0.06em] text-ink-3">
                    {day(note.date)}
                  </span>
                </div>
                <p className="m-0 text-[14.5px] text-ink-2">{note.changes}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
