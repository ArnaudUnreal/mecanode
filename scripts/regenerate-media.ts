/**
 * Régénère les tailles dérivées de chaque média à partir du fichier d'origine,
 * sans toucher au contenu saisi : `pnpm media:regenerate`.
 *
 * À lancer après toute modification de `imageSizes` dans la collection Media :
 * Payload ne fabrique les tailles qu'au téléversement, jamais rétroactivement.
 *
 * `pnpm media:clean` supprime en plus les fichiers dérivés devenus
 * orphelins. Sans cette option, rien n'est supprimé.
 */
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

const MEDIA_DIR = path.resolve(process.cwd(), 'media')
// Payload n'a pas transmis les arguments au script : le drapeau passe par l'environnement.
const clean = process.argv.includes('--clean') || process.env.MEDIA_CLEAN === '1'

async function main() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1000,
    pagination: false,
    locale: 'en',
  })

  let regenerated = 0
  let skipped = 0

  for (const media of docs) {
    const filename = media.filename
    if (!filename) {
      skipped += 1
      continue
    }

    const source = path.join(MEDIA_DIR, filename)
    if (!fs.existsSync(source)) {
      payload.logger.warn(`Fichier introuvable, média ${media.id} ignoré : ${filename}`)
      skipped += 1
      continue
    }

    const data = fs.readFileSync(source)

    // Fournir le fichier à l'update relance la fabrication des tailles dérivées.
    await payload.update({
      collection: 'media',
      id: media.id,
      locale: 'en',
      data: {},
      file: {
        data,
        mimetype: media.mimeType || 'image/jpeg',
        name: filename,
        size: data.length,
      },
    })

    regenerated += 1
  }

  payload.logger.info(`Médias régénérés : ${regenerated}, ignorés : ${skipped}.`)

  if (clean) {
    const { docs: fresh } = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1000,
      pagination: false,
      locale: 'en',
    })

    const known = new Set<string>()
    for (const media of fresh) {
      if (media.filename) known.add(media.filename)
      for (const size of Object.values(media.sizes ?? {})) {
        if (size && typeof size === 'object' && 'filename' in size && size.filename) {
          known.add(size.filename as string)
        }
      }
    }

    let removed = 0
    for (const file of fs.readdirSync(MEDIA_DIR)) {
      if (known.has(file)) continue
      fs.unlinkSync(path.join(MEDIA_DIR, file))
      payload.logger.info(`Orphelin supprimé : ${file}`)
      removed += 1
    }

    payload.logger.info(`Fichiers orphelins supprimés : ${removed}.`)
  } else {
    payload.logger.info('Aucun fichier supprimé. Lancer pnpm media:clean pour retirer les orphelins.')
  }

  process.exit(0)
}

await main()
