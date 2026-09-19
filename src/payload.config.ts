import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Tags } from './collections/Tags'
import { Tools } from './collections/Tools'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — MECANODE',
    },
  },
  collections: [Tools, Tags, Pages, Media, Users],
  globals: [SiteSettings],
  // Bilinguisme champ par champ sur un document unique : un texte français absent
  // retombe sur l'anglais, jamais l'inverse.
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'fr', label: 'Français' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  // Sans SMTP configuré, Payload écrit les courriels dans la console : le formulaire
  // reste testable en développement sans compte d'envoi.
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM || 'contact@mecanode.com',
        defaultFromName: 'Mecanode',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT || 587) === 465,
          auth:
            process.env.SMTP_USER && process.env.SMTP_PASSWORD
              ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
              : undefined,
        },
      })
    : undefined,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
    // Pas de poussée automatique du schéma : toute évolution passe par une migration,
    // en développement comme en production.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [],
})
