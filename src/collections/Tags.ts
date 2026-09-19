import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

/**
 * Deux usages dans une seule collection : la catégorie d'un outil et les étiquettes libres
 * de la galerie. `kind` sépare les deux, la liste du back-office filtre dessus.
 */
export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: {
    singular: { en: 'Tag', fr: 'Étiquette' },
    plural: { en: 'Tags', fr: 'Étiquettes' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'slug', 'updatedAt'],
    group: { en: 'Content', fr: 'Contenu' },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Name', fr: 'Nom' },
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'tag',
      label: { en: 'Kind', fr: 'Nature' },
      options: [
        { label: { en: 'Category', fr: 'Catégorie' }, value: 'category' },
        { label: { en: 'Tag', fr: 'Étiquette' }, value: 'tag' },
      ],
    },
    ...slugField('name'),
  ],
}
