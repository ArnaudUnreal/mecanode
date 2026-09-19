import type { DefaultServerCellComponentProps } from 'payload'
import React from 'react'

/** Champs qui font foi pour dire qu'une langue est complète, collection par collection. */
const REQUIRED: Record<string, string[]> = {
  tools: ['tagline', 'description'],
  pages: ['title', 'lede', 'content'],
  media: ['alt'],
  tags: ['name'],
}

const LOCALES = ['en', 'fr'] as const

function filled(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (typeof value === 'object') {
    // Texte riche vide : une racine sans le moindre caractère.
    return JSON.stringify(value).replace(/[^\p{L}\p{N}]/gu, '').length > 0
  }

  return true
}

/**
 * Colonne « Langues » de la liste : deux pastilles, une par langue.
 * Une langue est incomplète dès qu'un champ traduisible obligatoire est vide,
 * sans se laisser tromper par le repli automatique sur l'anglais.
 */
export async function LanguageFlags({
  rowData,
  collectionSlug,
  payload,
}: DefaultServerCellComponentProps) {
  const fields = REQUIRED[collectionSlug] ?? []
  if (fields.length === 0 || !rowData?.id) return null

  const states = await Promise.all(
    LOCALES.map(async (locale) => {
      try {
        const doc = await payload.findByID({
          collection: collectionSlug,
          id: rowData.id,
          locale,
          // JS null ne coupe pas le repli, seule la valeur false le fait.
          fallbackLocale: false,
          depth: 0,
          overrideAccess: true,
        })

        const data = doc as unknown as Record<string, unknown>

        return { locale, complete: fields.every((field) => filled(data?.[field])) }
      } catch {
        return { locale, complete: false }
      }
    }),
  )

  return (
    <span style={{ display: 'inline-flex', gap: 6 }}>
      {states.map(({ locale, complete }) => (
        <span
          key={locale}
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 10,
            letterSpacing: '0.08em',
            padding: '3px 7px',
            borderRadius: 4,
            border: `1px solid ${complete ? 'rgba(63,217,139,0.4)' : 'rgba(255,89,100,0.45)'}`,
            background: complete ? 'rgba(63,217,139,0.12)' : 'rgba(255,89,100,0.12)',
            color: complete ? '#3FD98B' : '#FF5964',
          }}
          title={complete ? `${locale.toUpperCase()} complet` : `${locale.toUpperCase()} incomplet`}
        >
          {locale.toUpperCase()}
        </span>
      ))}
    </span>
  )
}
