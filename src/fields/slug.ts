import type { Field } from 'payload'

/** Translittère un titre en identifiant d'URL : minuscules, tirets, sans accent. */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Identifiant d'URL, jamais localisé : une fiche garde la même adresse dans les deux langues.
 * Rempli depuis `sourceField` quand il est laissé vide.
 */
export function slugField(sourceField: string): Field[] {
  return [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: { en: 'URL identifier', fr: "Identifiant d'URL" },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Lowercase, dashes, no accents. Left empty, it is derived from the name.',
          fr: 'Minuscules, tirets, sans accent. Laissé vide, il est déduit du nom.',
        },
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            if (typeof value === 'string' && value.length > 0) return slugify(value)

            const source = data?.[sourceField]
            if (typeof source === 'string' && source.length > 0) return slugify(source)

            return value
          },
        ],
      },
    },
  ]
}
