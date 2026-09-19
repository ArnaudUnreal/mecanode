import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8">
      <div className="grid-bg" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-node text-center">
        <h1 className="m-0 text-5xl font-extrabold tracking-[-0.033em] sm:text-6xl">
          MECA<em className="text-cyan not-italic drop-shadow-[0_0_34px_rgba(43,229,255,0.35)]">NODE</em>
        </h1>
        <p className="mx-auto mt-6 max-w-[31em] text-lg text-ink-2">{t('tagline')}</p>
      </div>
    </main>
  )
}
