import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '../styles.css'

import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { routing } from '@/i18n/routing'

export const metadata: Metadata = {
  title: 'MECANODE',
  description: 'Outils Unreal Engine, galerie de travaux et enseignement — Arnaud Szobad.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const a11y = await getTranslations('a11y')

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <a
            className="clip-node sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:border focus:border-line focus:bg-panel focus:px-4 focus:py-2 focus:text-sm"
            href="#contenu"
          >
            {a11y('skipToContent')}
          </a>
          <Header />
          <main className="flex-1" id="contenu">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
