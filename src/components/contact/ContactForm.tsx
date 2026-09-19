'use client'

import { useTranslations } from 'next-intl'
import React from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { sendContact, type ContactState } from '@/actions/contact'
import { LogoStatus } from '@/components/ui/LogoStatus'
import type { Challenge } from '@/lib/contact'

const field =
  'w-full border border-line-strong bg-[#0C0914] px-3.5 py-2.5 text-[15px] text-ink transition-colors placeholder:text-ink-3 focus:border-cyan'

function Submit({ label, sending }: { label: string; sending: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      className="clip-node inline-flex items-center gap-2.5 border border-[#FF9A5E] bg-linear-to-b from-[#FF8B45] to-[#F4661A] px-[18px] py-2.5 text-[13.5px] font-semibold text-[#1A0D04] transition-opacity disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? sending : label}
    </button>
  )
}

/**
 * Formulaire de contact. En cas de succès, il cède la place au message de confirmation ;
 * en cas d'échec, il reste en place avec ses erreurs sous le bouton d'envoi.
 */
export function ContactForm({ challenge }: { challenge: Challenge }) {
  const t = useTranslations('contact')
  const [state, action] = useActionState<ContactState, FormData>(sendContact, { status: 'idle' })

  const errorOf = (name: string) =>
    state.status === 'error' ? state.errors.find((e) => e.field === name) : undefined

  if (state.status === 'sent') {
    return (
      <div
        aria-live="polite"
        className="clip-node-lg flex max-w-[620px] items-center gap-5 border border-[rgba(63,217,139,0.28)] bg-[rgba(63,217,139,0.06)] px-6 py-8"
      >
        <LogoStatus variant="success" />
        <div>
          <b className="mb-1 block text-[17px] font-semibold text-ink">{t('sentTitle')}</b>
          <span className="text-[14.5px] text-ink-2">{t('sentText')}</span>
        </div>
      </div>
    )
  }

  const message = (name: string) => {
    const error = errorOf(name)
    if (!error) return null

    return (
      <span className="mt-1.5 block text-[13px] text-[#FF8A93]">
        {t(`errors.${error.field}.${error.code}`)}
      </span>
    )
  }

  return (
    <form action={action} className="max-w-[620px]" noValidate>
      <div className="mb-4">
        <label className="mb-1.5 block font-mono text-[11px] tracking-[0.08em] uppercase text-ink-3" htmlFor="name">
          {t('name')}
        </label>
        <input autoComplete="name" className={field} id="name" name="name" required type="text" />
        {message('name')}
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block font-mono text-[11px] tracking-[0.08em] uppercase text-ink-3" htmlFor="email">
          {t('email')}
        </label>
        <input autoComplete="email" className={field} id="email" name="email" required type="email" />
        {message('email')}
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block font-mono text-[11px] tracking-[0.08em] uppercase text-ink-3" htmlFor="subject">
          {t('subject')}
        </label>
        <select className={field} defaultValue="products" id="subject" name="subject">
          <option value="products">{t('subjects.products')}</option>
          <option value="job">{t('subjects.job')}</option>
          <option value="other">{t('subjects.other')}</option>
        </select>
        {message('subject')}
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block font-mono text-[11px] tracking-[0.08em] uppercase text-ink-3" htmlFor="message">
          {t('message')}
        </label>
        <textarea className={`${field} min-h-[220px] resize-y`} id="message" name="message" required rows={9} />
        {message('message')}
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block font-mono text-[11px] tracking-[0.08em] uppercase text-ink-3" htmlFor="answer">
          {t('challenge', { a: challenge.a, b: challenge.b })}
        </label>
        <input
          autoComplete="off"
          className={`${field} max-w-[140px]`}
          id="answer"
          inputMode="numeric"
          name="answer"
          required
          type="text"
        />
        {message('challenge')}
      </div>

      {/* Piège à robots : masqué aux humains, ignoré des lecteurs d'écran. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">{t('website')}</label>
        <input autoComplete="off" id="website" name="website" tabIndex={-1} type="text" />
      </div>

      <input name="a" type="hidden" value={challenge.a} />
      <input name="b" type="hidden" value={challenge.b} />
      <input name="issued" type="hidden" value={challenge.issued} />
      <input name="token" type="hidden" value={challenge.token} />

      <div className="flex flex-wrap items-center gap-4">
        <Submit label={t('send')} sending={t('sending')} />
        {state.status === 'error' ? (
          <span aria-live="assertive" className="flex items-center gap-2.5 text-[13.5px] text-[#FF8A93]">
            <LogoStatus size={26} variant="error" />
            {errorOf('form') ? t('errors.form.send') : t('errors.summary')}
          </span>
        ) : null}
      </div>
    </form>
  )
}
