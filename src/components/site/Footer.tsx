import { getLocale, getTranslations } from 'next-intl/server'
import React from 'react'

import { Logo } from '@/components/ui/Logo'
import { Link } from '@/i18n/navigation'
import { getSiteSettings, getTools, type Locale } from '@/lib/content'

export async function Footer() {
  const locale = (await getLocale()) as Locale
  const nav = await getTranslations('nav')
  const footer = await getTranslations('footer')

  const [settings, tools] = await Promise.all([getSiteSettings(locale), getTools(locale)])

  const linkClass = 'block py-[5px] text-sm text-ink-2 transition-colors hover:text-cyan'

  return (
    <footer className="relative mt-8 border-t border-line-soft pt-14 pb-10">
      <div className="mx-auto max-w-node px-5 sm:px-8">
        <div className="mb-11 grid grid-cols-2 gap-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3.5 flex items-center gap-2.5 text-[13px] font-extrabold tracking-[0.2em]">
              <Logo size={18} />
              {settings.siteName}
            </div>
            {settings.footerNote ? (
              <p className="max-w-[34ch] text-sm text-ink-3">{settings.footerNote}</p>
            ) : null}
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-ink-3">
              {footer('tools')}
            </h2>
            {tools.map((tool) => (
              <a
                key={tool.id}
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
            <Link className={linkClass} href="/contact">
              {nav('contact')}
            </Link>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-ink-3">
              {footer('elsewhere')}
            </h2>
            {(settings.elsewhere ?? []).map((item) => (
              <a
                key={item.id ?? item.url}
                className={linkClass}
                href={item.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-line-soft pt-[22px] text-[13px] text-ink-3">
          <span className="text-ink-2">
            {footer('builtBy')} <b className="font-semibold text-ink">Arnaud Szobad</b>
          </span>
          <span>© {new Date().getFullYear()} Mecanode</span>
        </div>
      </div>
    </footer>
  )
}
