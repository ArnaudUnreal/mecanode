import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/collections/Users'

import { languagesColumn } from '@/fields/languages'
import { slugField } from '@/fields/slug'

const engineVersionOptions = [
  '4.25',
  '4.26',
  '4.27',
  '5.0',
  '5.1',
  '5.2',
  '5.3',
  '5.4',
  '5.5',
  '5.6',
  '5.7',
].map(
  (version) => ({ label: version, value: version }),
)

/**
 * Fiche d'un outil vendu sur Fab. Aucun prix n'est stocké : il vit sur Fab.
 * Le statut est porté par le brouillon Payload, `_status`, pas par un champ séparé.
 */
export const Tools: CollectionConfig = {
  slug: 'tools',
  labels: {
    singular: { en: 'Tool', fr: 'Outil' },
    plural: { en: 'Tools', fr: 'Outils' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', '_status', 'languages', 'engineVersions', 'featured', 'updatedAt'],
    listSearchableFields: ['name', 'slug', 'tagline'],
    pagination: { defaultLimit: 25 },
    group: { en: 'Catalogue', fr: 'Catalogue' },
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
      name: 'name',
      type: 'text',
      required: true,
      label: { en: 'Name', fr: 'Nom' },
      admin: {
        description: {
          en: 'Product name as sold on Fab. Not translated.',
          fr: 'Nom du produit tel que vendu sur Fab. Non traduit.',
        },
      },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Tagline', fr: 'Accroche' },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: { en: 'Description', fr: 'Description' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Media', fr: 'Visuels' },
          fields: [
            {
              name: 'mainImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: { en: 'Main image', fr: 'Visuel principal' },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: { en: 'Gallery', fr: 'Galerie' },
            },
            {
              name: 'videoUrl',
              type: 'text',
              label: { en: 'Video URL', fr: 'URL de vidéo' },
              admin: {
                description: {
                  en: 'YouTube or Vimeo. The player loads on click, never on page load.',
                  fr: 'YouTube ou Vimeo. Le lecteur se charge au clic, jamais au chargement.',
                },
              },
              validate: (value: string | null | undefined) => {
                if (!value) return true
                return /^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//.test(value)
                  ? true
                  : 'URL YouTube ou Vimeo attendue.'
              },
            },
          ],
        },
        {
          label: { en: 'Compatibility', fr: 'Compatibilité' },
          fields: [
            {
              name: 'engineVersions',
              type: 'select',
              hasMany: true,
              required: true,
              options: engineVersionOptions,
              label: { en: 'Unreal versions', fr: "Versions d'Unreal" },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'tags',
              required: true,
              label: { en: 'Category', fr: 'Catégorie' },
              filterOptions: () => ({ kind: { equals: 'category' } }),
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
              label: { en: 'Tags', fr: 'Étiquettes' },
              filterOptions: () => ({ kind: { equals: 'tag' } }),
            },
            {
              name: 'fabUrl',
              type: 'text',
              required: true,
              label: { en: 'Fab link', fr: 'Lien Fab' },
              admin: {
                description: {
                  en: 'The price lives on Fab, never here.',
                  fr: 'Le prix vit sur Fab, jamais ici.',
                },
              },
            },
          ],
        },
        {
          label: { en: 'Release notes', fr: 'Notes de version' },
          fields: [
            {
              name: 'releaseNotes',
              type: 'array',
              label: { en: 'Release notes', fr: 'Notes de version' },
              labels: {
                singular: { en: 'Entry', fr: 'Entrée' },
                plural: { en: 'Entries', fr: 'Entrées' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'version',
                      type: 'text',
                      required: true,
                      label: { en: 'Version', fr: 'Version' },
                      admin: { width: '40%' },
                    },
                    {
                      name: 'date',
                      type: 'date',
                      required: true,
                      label: { en: 'Date', fr: 'Date' },
                      admin: { width: '60%', date: { pickerAppearance: 'dayOnly' } },
                    },
                  ],
                },
                {
                  name: 'changes',
                  type: 'textarea',
                  required: true,
                  localized: true,
                  label: { en: 'Changes', fr: 'Changements' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'releaseDate',
      type: 'date',
      label: { en: 'Release date', fr: 'Date de sortie' },
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Featured', fr: 'Mise en avant' },
      admin: { position: 'sidebar' },
    },
    ...slugField('name'),
    languagesColumn,
  ],
}
