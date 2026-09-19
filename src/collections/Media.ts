import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/collections/Users'

import { languagesColumn } from '@/fields/languages'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { en: 'Media', fr: 'Média' },
    plural: { en: 'Media', fr: 'Médias' },
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'languages', 'credit', 'updatedAt'],
    listSearchableFields: ['filename', 'alt', 'credit'],
    group: { en: 'Content', fr: 'Contenu' },
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => isAdmin(req.user),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Alternative text', fr: 'Texte alternatif' },
      admin: {
        description: {
          en: 'Describes the image for screen readers. Required in both languages.',
          fr: "Décrit l'image pour les lecteurs d'écran. Obligatoire dans les deux langues.",
        },
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      label: { en: 'Caption', fr: 'Légende' },
    },
    {
      name: 'credit',
      type: 'text',
      label: { en: 'Credit', fr: 'Crédit' },
    },
    languagesColumn,
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*', 'video/*'],
    // Trois tailles servies au front, toutes en WebP : le poids compte plus que le format d'origine.
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
      {
        name: 'card',
        width: 768,
        height: 432,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'wide',
        width: 1600,
        height: 900,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
    ],
    focalPoint: true,
  },
}
