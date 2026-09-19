'use client'

import React from 'react'

import { LocaleSwitch } from '@/components/site/LocaleSwitch'
import { SocialLinks, type SocialItem } from '@/components/site/SocialLinks'
import { Link } from '@/i18n/navigation'
import type { Pathnames } from '@/i18n/routing'

// Le menu ne pointe que vers des pages fixes, jamais vers une fiche outil.
type Item = { href: Exclude<Pathnames, '/tools/[slug]'>; label: string }

/** Navigation repliée sous 768 px : bouton, panneau, fermeture à la touche d'échappement. */
export function MobileMenu({
  items,
  menuLabel,
  languageLabel,
  social,
}: {
  items: Item[]
  menuLabel: string
  languageLabel: string
  social: SocialItem[]
}) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className="md:hidden">
      <button
        aria-controls="menu-mobile"
        aria-expanded={open}
        aria-label={menuLabel}
        className="clip-node flex h-10 w-10 items-center justify-center border border-line-strong bg-panel text-ink"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          {open ? (
            <path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" strokeWidth="1.5" />
          ) : (
            <path d="M2 4 H14 M2 8 H14 M2 12 H14" stroke="currentColor" strokeWidth="1.5" />
          )}
        </svg>
      </button>

      {open ? (
        <div
          className="absolute top-[68px] right-0 left-0 border-b border-line-soft bg-bg px-5 py-4 backdrop-blur-[14px]"
          id="menu-mobile"
        >
          <nav aria-label={menuLabel} className="flex flex-col">
            {items.map((item) => (
              <Link
                key={item.href}
                className="border-b border-line-soft py-3 text-[15px] text-ink-2 last:border-b-0 hover:text-ink"
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-between gap-4 pt-4">
            <LocaleSwitch label={languageLabel} />
            <SocialLinks items={social} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
