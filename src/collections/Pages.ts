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
      name: 'role',
      type: 'text',
      localized: true,
      label: { en: 'Role line', fr: 'Ligne de rôle' },
      admin: {
        description: {
          en: 'Short line above the title, e.g. Unreal Engine developer · Instructor.',
          fr: 'Ligne courte au-dessus du titre, par exemple Développeur Unreal Engine · Enseignant.',
        },
      },
    },
    {
      name: 'timeline',
      type: 'array',
      label: { en: 'Timeline', fr: 'Parcours' },
      labels: {
        singular: { en: 'Entry', fr: 'Étape' },
        plural: { en: 'Entries', fr: 'Étapes' },
      },
      admin: {
        description: {
          en: 'Left empty, the section does not appear on the page.',
          fr: "Laissé vide, la section n'apparaît pas sur la page.",
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'period',
              type: 'text',
              required: true,
              label: { en: 'Period', fr: 'Période' },
              admin: { width: '30%' },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Title', fr: 'Titre' },
              admin: { width: '70%' },
            },
          ],
        },
        {
          name: 'text',
          type: 'textarea',
          localized: true,
          label: { en: 'Text', fr: 'Texte' },
        },
      ],
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
