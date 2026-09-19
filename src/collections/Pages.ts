import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

/** Pages éditoriales : profil, enseignement, mentions. Le contenu est localisé. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: { en: 'Page', fr: 'Page' },
    plural: { en: 'Pages', fr: 'Pages' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt', '_status'],
    group: { en: 'Content', fr: 'Contenu' },
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Title', fr: 'Titre' },
    },
    {
      name: 'lede',
      type: 'textarea',
      localized: true,
      label: { en: 'Lede', fr: 'Chapeau' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Hero image', fr: 'Visuel de tête' },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      label: { en: 'Content', fr: 'Contenu' },
    },
    ...slugField('title'),
  ],
}
