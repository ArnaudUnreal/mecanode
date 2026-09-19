import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { NodeArt } from '@/components/ui/NodeArt'
import { Pin } from '@/components/ui/Pin'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHead } from '@/components/ui/SectionHead'
import { demoTools } from '@/content/demo'

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('gallery')
  const common = await getTranslations('common')

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-node">
        <SectionHead
          label={t('label')}
          title={t('title')}
          lede={t('lede')}
          action={<Pin accent>{common('comingSoon')}</Pin>}
        />
        <div className="grid auto-rows-[186px] grid-cols-2 gap-4 md:grid-cols-4">
          {demoTools.map((tool, index) => (
            <Reveal
              key={tool.slug}
              delay={index * 0.06}
              className={index === 0 ? 'col-span-2 row-span-2 h-full' : 'h-full'}
            >
              <div className="relative h-full min-h-[186px] overflow-hidden rounded-[10px] border border-line bg-panel">
                <NodeArt accent={tool.accent} />
                <div
                  className="absolute inset-0 bg-linear-to-b from-transparent to-[rgba(6,8,12,0.75)]"
                  aria-hidden="true"
                />
                <span className="absolute bottom-3 left-3.5 z-3 border border-line bg-[rgba(8,10,14,0.72)] px-2.5 py-1 font-mono text-[10.5px] tracking-[0.09em] uppercase text-ink-2 backdrop-blur-[6px]">
                  {tool.name}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 font-mono text-[11px] tracking-[0.06em] uppercase text-ink-3">
          {common('demoContent')}
        </p>
      </div>
    </section>
  )
}
