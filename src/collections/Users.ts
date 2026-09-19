import type { CollectionConfig } from 'payload'

/** Un compte est soit administrateur, soit éditeur. Rien d'autre n'existe. */
export const isAdmin = (user: { role?: string | null } | null | undefined): boolean =>
  user?.role === 'admin'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { en: 'User', fr: 'Utilisateur' },
    plural: { en: 'Users', fr: 'Utilisateurs' },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'updatedAt'],
    listSearchableFields: ['email', 'name'],
    group: { en: 'Configuration', fr: 'Configuration' },
  },
  auth: true,
  access: {
    // Seul un administrateur gère les comptes ; un éditeur ne voit que le sien.
    create: ({ req }) => isAdmin(req.user),
    delete: ({ req }) => isAdmin(req.user),
    update: ({ req }) => (isAdmin(req.user) ? true : { id: { equals: req.user?.id } }),
    read: ({ req }) => (isAdmin(req.user) ? true : { id: { equals: req.user?.id } }),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { en: 'Name', fr: 'Nom' },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      label: { en: 'Role', fr: 'Rôle' },
      options: [
        { label: { en: 'Administrator', fr: 'Administrateur' }, value: 'admin' },
        { label: { en: 'Editor', fr: 'Éditeur' }, value: 'editor' },
      ],
      access: {
        // Un éditeur ne se promeut pas tout seul.
        update: ({ req }) => isAdmin(req.user),
      },
      admin: {
        description: {
          en: 'An editor writes and publishes content. An administrator also manages accounts and settings.',
          fr: "Un éditeur écrit et publie le contenu. Un administrateur gère en plus les comptes et les réglages.",
        },
      },
    },
  ],
}
