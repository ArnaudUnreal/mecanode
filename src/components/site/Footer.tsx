import { getLocale, getTranslations } from 'next-intl/server'
import React from 'react'

import { Logo } from '@/components/ui/Logo'
import { demoSite, demoTools, pick, type Locale } from '@/content/demo'
import { Link } from '@/i18n/navigation'

export async function Footer() {
  const locale = (await getLocale()) as Locale
  const nav = await getTranslations('nav')
  const footer = await getTranslations('footer')

  const linkClass =
    'block py-[5px] text-sm text-ink-2 transition-colors hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan'

  return (
    <footer className="relative mt-8 border-t border-line-soft pt-14 pb-10">
      <div className="mx-auto max-w-node px-5 sm:px-8">
        <div className="mb-11 grid grid-cols-2 gap-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3.5 flex items-center gap-2.5 text-[13px] font-extrabold tracking-[0.2em]">
              <Logo size={18} />
              MECANODE
            </div>
            <p className="max-w-[34ch] text-sm text-ink-3">{pick(demoSite.note, locale)}</p>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-ink-3">
              {footer('tools')}
            </h2>
            {demoTools.map((tool) => (
              <a
                key={tool.slug}
                className={linkClass}
                href={tool.fabUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {tool.name}
              </a>
            ))}
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-ink-3">
              {footer('work')}
            </h2>
            <Link className={linkClass} href="/gallery">
              {nav('gallery')}
            </Link>
            <Link className={linkClass} href="/about">
              {nav('about')}
            </Link>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-ink-3">
              {footer('elsewhere')}
            </h2>
            {demoSite.elsewhere.map((item) => (
              <a key={item.label} className={linkClass} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-line-soft pt-[22px] text-[13px] text-ink-3">
          <span className="text-ink-2">
            {footer('builtBy')} <b className="font-semibold text-ink">{demoSite.author}</b>
          </span>
          <span>© {new Date().getFullYear()} Mecanode</span>
        </div>
      </div>
    </footer>
  )
}
