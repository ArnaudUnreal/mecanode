'use client'

import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import React from 'react'

import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

/** Bascule de langue : la langue active est annoncée, l'autre est un lien vers la même page. */
export function LocaleSwitch({ label }: { label: string }) {
  const active = useLocale()
  const pathname = usePathname()
  const params = useParams()

  return (
    <div
      className="flex items-center gap-1.5 font-mono text-xs tracking-[0.06em] text-ink-3"
      role="group"
      aria-label={label}
    >
      {routing.locales.map((locale, index) => (
        <React.Fragment key={locale}>
          {index > 0 ? (
            <span aria-hidden="true" className="text-[#2A3242]">
              /
            </span>
          ) : null}
          {locale === active ? (
            <b className="font-semibold text-cyan" aria-current="true">
              {locale.toUpperCase()}
            </b>
          ) : (
            <Link
              className="transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              // Le chemin courant peut être une route dynamique : ses paramètres suivent.
              href={{ pathname, params } as Parameters<typeof Link>[0]["href"]}
              locale={locale}
            >
              {locale.toUpperCase()}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
