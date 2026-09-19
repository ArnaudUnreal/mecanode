import type { Field } from 'payload'

/**
 * Colonne d'état des traductions. Champ d'interface seulement : il ne stocke rien,
 * la vérification se fait à l'affichage de la liste.
 */
export const languagesColumn: Field = {
  name: 'languages',
  type: 'ui',
  label: { en: 'Languages', fr: 'Langues' },
  admin: {
    components: {
      Cell: '/components/admin/LanguageFlags#LanguageFlags',
    },
  },
}
