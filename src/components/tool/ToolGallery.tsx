'use client'

import Image from 'next/image'
import React from 'react'

export type GalleryItem = {
  id: number
  url: string
  alt: string
  width?: number | null
  height?: number | null
}

/**
 * Visuel principal et vignettes. Chaque vignette est un bouton : la fiche se parcourt
 * entièrement au clavier, la sélection courante est annoncée par `aria-current`.
 */
export function ToolGallery({ items, label }: { items: GalleryItem[]; label: string }) {
  const [active, setActive] = React.useState(0)
  const current = items[active]

  if (!current) return null

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-line bg-[#0C0914]">
        <div className="flex items-center gap-2.5 border-b border-line-soft px-3.5 py-2.5 text-ink-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="block h-2 w-2 rounded-full bg-[#232A38]" />
            <i className="block h-2 w-2 rounded-full bg-[#232A38]" />
            <i className="block h-2 w-2 rounded-full bg-[#232A38]" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.08em] uppercase">
            {active + 1} / {items.length}
          </span>
        </div>
        <div className="relative aspect-video">
          <Image
            alt={current.alt}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 760px"
            src={current.url}
          />
        </div>
      </div>

      {items.length > 1 ? (
        <ul
          aria-label={label}
          className="mt-3 grid list-none grid-cols-4 gap-2.5 p-0 sm:grid-cols-5"
        >
          {items.map((item, index) => (
            <li key={item.id}>
              <button
                aria-current={index === active}
                aria-label={item.alt}
                className={`relative block h-[66px] w-full overflow-hidden rounded-lg border bg-[#0C0914] transition-colors ${
                  index === active
                    ? 'border-cyan shadow-[0_0_0_1px_rgba(43,229,255,0.25)]'
                    : 'border-line hover:border-[#3C5A6E]'
                }`}
                onClick={() => setActive(index)}
                type="button"
              >
                <Image alt="" className="object-cover" fill sizes="160px" src={item.url} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
