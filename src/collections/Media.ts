import type { CollectionConfig } from 'payload'
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
    defaultColumns: ['filename', 'alt', 'credit', 'updatedAt'],
    group: { en: 'Content', fr: 'Contenu' },
  },
  access: {
    read: () => true,
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
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*', 'video/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 432, position: 'centre' },
      { name: 'wide', width: 1600, height: 900, position: 'centre' },
    ],
    focalPoint: true,
  },
}
