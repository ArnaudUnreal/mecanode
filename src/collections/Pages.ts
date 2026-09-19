import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/collections/Users'

import { languagesColumn } from '@/fields/languages'
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
    defaultColumns: ['title', '_status', 'languages', 'slug', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'lede'],
    group: { en: 'Content', fr: 'Contenu' },
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => isAdmin(req.user),
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
      name: 'badgeTitle',
      type: 'text',
      localized: true,
      label: { en: 'Badge title', fr: 'Titre du badge' },
      admin: {
        description: {
          en: 'Certification highlighted next to the profile. Left empty, the card is hidden.',
          fr: 'Certification mise en avant sur le profil. Laissé vide, la carte est masquée.',
        },
      },
    },
    {
      name: 'badgeText',
      type: 'text',
      localized: true,
      label: { en: 'Badge text', fr: 'Texte du badge' },
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
    languagesColumn,
  ],
}
