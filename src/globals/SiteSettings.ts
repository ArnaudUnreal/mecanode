import type { GlobalConfig } from 'payload'

/** Réglages du site : ce qui est vrai partout, en-tête, pied de page, liens sortants. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { en: 'Site settings', fr: 'Réglages du site' },
  admin: {
    group: { en: 'Configuration', fr: 'Configuration' },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'MECANODE',
      label: { en: 'Site name', fr: 'Nom du site' },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      label: { en: 'Tagline', fr: 'Accroche' },
    },
    {
      name: 'heroTitle',
      type: 'textarea',
      localized: true,
      label: { en: 'Hero title', fr: 'Titre du héros' },
      admin: {
        description: {
          en: 'Wrap the cyan part in asterisks, like *the tedious part*.',
          fr: 'Encadrer la partie cyan par des astérisques, comme *la part ingrate*.',
        },
      },
    },
    {
      name: 'heroMeta',
      type: 'array',
      maxRows: 4,
      label: { en: 'Hero credentials', fr: 'Mentions du héros' },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Label', fr: 'Libellé' },
        },
      ],
    },
    {
      name: 'ctaTitle',
      type: 'text',
      localized: true,
      label: { en: 'Closing call title', fr: 'Titre de l’appel final' },
    },
    {
      name: 'ctaLede',
      type: 'textarea',
      localized: true,
      label: { en: 'Closing call text', fr: 'Texte de l’appel final' },
    },
    {
      name: 'lede',
      type: 'textarea',
      localized: true,
      label: { en: 'Home lede', fr: "Chapeau d'accueil" },
    },
    {
      name: 'footerNote',
      type: 'textarea',
      localized: true,
      label: { en: 'Footer note', fr: 'Note de pied de page' },
    },
    {
      name: 'fabUrl',
      type: 'text',
      required: true,
      label: { en: 'Fab store URL', fr: 'URL de la boutique Fab' },
    },
    {
      name: 'engineRange',
      type: 'text',
      label: { en: 'Supported Unreal range', fr: "Plage d'Unreal supportée" },
      admin: { description: { en: 'Shown in the hero, e.g. 5.3 → 5.7', fr: 'Affichée dans le héros, par exemple 5.3 → 5.7' } },
    },
    {
      name: 'stats',
      type: 'array',
      label: { en: 'Key figures', fr: 'Chiffres clés' },
      maxRows: 4,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              label: { en: 'Value', fr: 'Valeur' },
              admin: { width: '40%' },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Label', fr: 'Libellé' },
              admin: { width: '60%' },
            },
          ],
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          label: { en: 'Highlight', fr: 'Mettre en valeur' },
        },
      ],
    },
    {
      name: 'elsewhere',
      type: 'array',
      label: { en: 'Elsewhere links', fr: 'Liens ailleurs' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: { en: 'Label', fr: 'Libellé' },
              admin: { width: '40%' },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: { en: 'URL', fr: 'URL' },
              admin: { width: '60%' },
            },
          ],
        },
      ],
    },
  ],
}
