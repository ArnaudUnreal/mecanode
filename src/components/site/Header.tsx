import { getLocale, getTranslations } from 'next-intl/server'
import React from 'react'

import { LocaleSwitch } from '@/components/site/LocaleSwitch'
import { MobileMenu } from '@/components/site/MobileMenu'
import { ArrowUpRight, ButtonLink } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { getSiteSettings, type Locale } from '@/lib/content'
import { Link } from '@/i18n/navigation'

const links = [
  { href: '/', key: 'tools' },
  { href: '/gallery', key: 'gallery' },
  { href: '/about', key: 'about' },
] as const

export async function Header() {
  const nav = await getTranslations('nav')
  const actions = await getTranslations('actions')
  const a11y = await getTranslations('a11y')
  const settings = await getSiteSettings((await getLocale()) as Locale)

  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-[rgba(11,7,22,0.78)] backdrop-blur-[14px]">
      <div className="mx-auto flex h-[68px] max-w-node items-center gap-5 px-5 sm:gap-9 sm:px-8">
        <Link
          className="flex items-center gap-[11px] text-[15px] font-extrabold tracking-[0.14em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
          href="/"
        >
          <Logo />
          MECANODE
        </Link>

        <nav aria-label={a11y('mainNav')} className="ml-2 hidden gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.key}
              className="relative py-1 text-sm text-ink-2 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              href={link.href}
            >
              {nav(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="hidden sm:block">
          <LocaleSwitch label={a11y('languageSwitch')} />
        </div>

        <MobileMenu
          items={links.map((link) => ({ href: link.href, label: nav(link.key) }))}
          menuLabel={a11y('menu')}
          languageLabel={a11y('languageSwitch')}
        />

        <ButtonLink href={settings.fabUrl} rel="noopener noreferrer" target="_blank" variant="fab">
          <span className="hidden sm:inline">{actions('browseOn')} </span>Fab
          <ArrowUpRight />
        </ButtonLink>
      </div>
    </header>
  )
}
