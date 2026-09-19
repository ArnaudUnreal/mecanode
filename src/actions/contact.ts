'use server'

import config from '@payload-config'
import { getLocale } from 'next-intl/server'
import { getPayload } from 'payload'

import { checkChallenge, validate, type ValidationError } from '@/lib/contact'

export type ContactState =
  | { status: 'idle' }
  | { status: 'sent' }
  | { status: 'error'; errors: ValidationError[] }

const RECIPIENT = process.env.CONTACT_TO || 'contact@mecanode.com'

const subjectLabels: Record<string, string> = {
  products: 'Produits',
  job: 'Emploi',
  other: 'Autre',
}

/**
 * Envoi du formulaire de contact. Rien n'est stocké : le message part par courriel
 * vers l'adresse du domaine, qui le route ensuite où il faut.
 */
export async function sendContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const read = (key: string) => String(formData.get(key) ?? '')

  // Piège à robots : un champ que personne ne voit et que personne ne remplit.
  if (read('website').length > 0) return { status: 'sent' }

  const payloadInput = {
    name: read('name'),
    email: read('email'),
    subject: read('subject'),
    message: read('message'),
  }

  const errors = validate(payloadInput)

  const verdict = checkChallenge({
    a: Number(read('a')),
    b: Number(read('b')),
    issued: Number(read('issued')),
    token: read('token'),
    answer: Number(read('answer')),
  })

  if (verdict !== 'ok') errors.push({ field: 'challenge', code: verdict })
  if (errors.length > 0) return { status: 'error', errors }

  const locale = await getLocale()
  const label = subjectLabels[payloadInput.subject] ?? payloadInput.subject

  try {
    const payload = await getPayload({ config })

    await payload.sendEmail({
      to: RECIPIENT,
      replyTo: payloadInput.email,
      subject: `[Mecanode] ${label} — ${payloadInput.name.trim()}`,
      text: [
        `Nom : ${payloadInput.name.trim()}`,
        `Courriel : ${payloadInput.email.trim()}`,
        `Objet : ${label}`,
        `Langue du visiteur : ${locale}`,
        '',
        payloadInput.message.trim(),
      ].join('\n'),
    })

    return { status: 'sent' }
  } catch (error) {
    const payload = await getPayload({ config })
    payload.logger.error({ err: error }, 'Envoi du formulaire de contact impossible')

    return { status: 'error', errors: [{ field: 'form', code: 'send' }] }
  }
}
