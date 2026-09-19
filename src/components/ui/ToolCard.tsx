import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { ArrowRight } from '@/components/ui/Button'
import { Pin } from '@/components/ui/Pin'
import { Link } from '@/i18n/navigation'
import { asMedia, asTag, engineRange } from '@/lib/content'
import type { Tool } from '@/payload-types'

export async function ToolCard({ tool }: { tool: Tool }) {
  const t = await getTranslations('actions')

  const cover = asMedia(tool.mainImage)
  const category = asTag(tool.category)
  const range = engineRange(tool.engineVersions)

  return (
    <article className="clip-node-lg group flex h-full flex-col border border-line bg-panel transition-[border-color,transform] duration-200 focus-within:-translate-y-[3px] focus-within:border-[#3C5A6E] hover:-translate-y-[3px] hover:border-[#3C5A6E]">
      <div className="relative h-[168px] overflow-hidden border-b border-line-soft bg-bg">
        {cover?.url ? (
          <Image
            alt={cover.alt ?? ''}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            src={cover.url}
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col px-[22px] pt-5 pb-6">
        <h3 className="m-0 mb-2 text-[19px] font-semibold tracking-[-0.015em]">
          <Link className="transition-colors hover:text-cyan" href={{ pathname: '/tools/[slug]', params: { slug: tool.slug } }}>
            {tool.name}
          </Link>
        </h3>
        <p className="m-0 mb-[18px] flex-1 text-[14.5px] text-ink-2">{tool.tagline}</p>
        <div className="mb-[18px] flex flex-wrap gap-2">
          {category ? <Pin accent>{category.name}</Pin> : null}
          {range ? <Pin>UE {range}</Pin> : null}
        </div>
        <div className="flex items-center justify-between gap-3">
          <a
            className="flex items-center gap-[7px] text-[13.5px] font-semibold text-orange"
            href={tool.fabUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('viewOnFab')}
            <span className="transition-transform duration-200 group-hover:translate-x-[3px]">
              <ArrowRight />
            </span>
          </a>
          <span className="font-mono text-[11px] tracking-[0.06em] text-ink-3">{tool.slug}</span>
        </div>
      </div>
    </article>
  )
}
