import '../styles.css'

import localFont from 'next/font/local'

import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/metadata'

/**
 * Polices servies par le site, sous-ensemble latin seulement.
 * next/font les précharge et calcule les métriques de la police de repli :
 * le texte ne saute plus au moment où la vraie police arrive.
 */
const inter = localFont({
  src: '../fonts/inter-latin.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
})

const jetbrainsMono = localFont({
  src: '../fonts/jetbrains-mono-latin.woff2',
  weight: '100 800',
  display: 'swap',
  variable: '--font-jetbrains-mono',
  // Le mono ne sert qu'aux petites étiquettes : il ne doit pas disputer la bande
  // passante à Inter, qui porte le titre et donc le plus grand élément affiché.
  preload: false,
  fallback: ['ui-monospace', 'monospace'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MECANODE',
    template: '%s',
  },
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
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
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
