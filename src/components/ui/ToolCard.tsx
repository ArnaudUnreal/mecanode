import { getTranslations } from 'next-intl/server'
import React from 'react'

import { ArrowRight } from '@/components/ui/Button'
import { Pin } from '@/components/ui/Pin'
import { NodeArt } from '@/components/ui/NodeArt'
import { pick, type DemoTool, type Locale } from '@/content/demo'

export async function ToolCard({ tool, locale }: { tool: DemoTool; locale: Locale }) {
  const t = await getTranslations('actions')

  return (
    <article className="clip-node-lg group flex flex-col border border-line bg-panel transition-[border-color,transform] duration-200 hover:-translate-y-[3px] hover:border-[#3C5A6E] focus-within:-translate-y-[3px] focus-within:border-[#3C5A6E]">
      <div className="relative h-[168px] overflow-hidden border-b border-line-soft">
        <NodeArt accent={tool.accent} />
      </div>
      <div className="flex flex-1 flex-col px-[22px] pt-5 pb-6">
        <h3 className="m-0 mb-2 text-[19px] font-semibold tracking-[-0.015em]">{tool.name}</h3>
        <p className="m-0 mb-[18px] flex-1 text-[14.5px] text-ink-2">{pick(tool.summary, locale)}</p>
        <div className="mb-[18px] flex flex-wrap gap-2">
          <Pin accent>{pick(tool.category, locale)}</Pin>
          <Pin>
            UE {tool.engineVersions[0]} → {tool.engineVersions[tool.engineVersions.length - 1]}
          </Pin>
        </div>
        <div className="flex items-center justify-between gap-3">
          <a
            className="flex items-center gap-[7px] text-[13.5px] font-semibold text-orange focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
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
