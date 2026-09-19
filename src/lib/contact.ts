import crypto from 'crypto'

/**
 * Défi arithmétique signé : la question est posée en toutes lettres, jamais en images.
 * La réponse attendue n'est pas envoyée au navigateur, seule une signature l'accompagne.
 */
export type Challenge = { a: number; b: number; issued: number; token: string }

const secret = () => process.env.PAYLOAD_SECRET || 'mecanode'

function sign(a: number, b: number, issued: number): string {
  return crypto.createHmac('sha256', secret()).update(`${a}:${b}:${issued}`).digest('hex')
}

export function makeChallenge(): Challenge {
  const a = 2 + Math.floor(Math.random() * 7)
  const b = 2 + Math.floor(Math.random() * 7)
  const issued = Date.now()

  return { a, b, issued, token: sign(a, b, issued) }
}

/** Vingt minutes de validité, trois secondes minimum avant l'envoi. */
export function checkChallenge(input: {
  a: number
  b: number
  issued: number
  token: string
  answer: number
}): 'ok' | 'expired' | 'tampered' | 'tooFast' | 'wrong' {
  if (!Number.isFinite(input.a) || !Number.isFinite(input.b) || !Number.isFinite(input.issued)) {
    return 'tampered'
  }

  const expected = sign(input.a, input.b, input.issued)
  const given = Buffer.from(input.token || '', 'utf8')
  const wanted = Buffer.from(expected, 'utf8')

  if (given.length !== wanted.length || !crypto.timingSafeEqual(given, wanted)) return 'tampered'

  const age = Date.now() - input.issued
  if (age > 20 * 60 * 1000) return 'expired'
  if (age < 3000) return 'tooFast'
  if (input.answer !== input.a + input.b) return 'wrong'

  return 'ok'
}

const HTML_OR_CODE =
  /<\s*\/?\s*[a-z][\s\S]*?>|<\s*script|javascript\s*:|data\s*:text\/html|on\w+\s*=|\$\{|\{\{|\[url=|\bexec\s*\(|\bselect\b.+\bfrom\b/i

const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/

export type FieldName = 'name' | 'email' | 'subject' | 'message'

export type ValidationError = { field: FieldName | 'challenge' | 'form'; code: string }

const SUBJECTS = ['products', 'job', 'other'] as const
export type SubjectValue = (typeof SUBJECTS)[number]

/**
 * Validation du message. Le texte n'a pas de limite affichée : la seule borne est
 * un garde-fou serveur à vingt mille caractères, jamais un compteur qui bloque la saisie.
 */
export function validate(input: {
  name: string
  email: string
  subject: string
  message: string
}): ValidationError[] {
  const errors: ValidationError[] = []
  const name = input.name.trim()
  const email = input.email.trim()
  const message = input.message.trim()

  if (name.length < 2 || name.length > 80) errors.push({ field: 'name', code: 'length' })
  else if (HTML_OR_CODE.test(name) || CONTROL_CHARS.test(name)) {
    errors.push({ field: 'name', code: 'code' })
  }

  if (!/^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/.test(email) || email.length > 120) {
    errors.push({ field: 'email', code: 'invalid' })
  }

  if (!SUBJECTS.includes(input.subject as SubjectValue)) {
    errors.push({ field: 'subject', code: 'invalid' })
  }

  if (message.length < 10) errors.push({ field: 'message', code: 'short' })
  else if (message.length > 20000) errors.push({ field: 'message', code: 'long' })
  else if (HTML_OR_CODE.test(message) || CONTROL_CHARS.test(message)) {
    errors.push({ field: 'message', code: 'code' })
  } else if ((message.match(/https?:\/\//gi) || []).length > 3) {
    errors.push({ field: 'message', code: 'links' })
  }

  return errors
}
