/**
 * Redéfinit le mot de passe d'un compte du back-office, sans passer par le courriel :
 * `pnpm admin:password`.
 *
 * Le mot de passe est demandé à la frappe, jamais affiché, jamais écrit dans un fichier.
 * Hors terminal interactif, il est lu dans `ADMIN_PASSWORD` ; à défaut, le script en
 * tire un au hasard et l'affiche une seule fois.
 *
 * `ADMIN_EMAIL` choisit le compte quand la base en contient plusieurs.
 * Le compte est aussi déverrouillé : les tentatives ratées sont remises à zéro.
 */
import config from '@payload-config'
import { randomBytes } from 'crypto'
import { createInterface } from 'readline'
import { getPayload } from 'payload'

const LONGUEUR_MINIMALE = 12
const ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789-_'

/** Demande une saisie sans jamais l'afficher. */
function demander(invite: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    // Payload n'expose pas de saisie masquée : on coupe l'écho interne de readline.
    const interne = rl as unknown as { _writeToOutput: (texte: string) => void }
    let muet = false
    interne._writeToOutput = (texte: string) => {
      if (!muet) process.stdout.write(texte)
    }
    rl.question(invite, (reponse) => {
      process.stdout.write('\n')
      rl.close()
      resolve(reponse)
    })
    muet = true
  })
}

/** Mot de passe tiré au hasard, réservé au cas où rien n'est saisi. */
function tirerAuHasard(longueur = 20): string {
  const octets = randomBytes(longueur)
  return Array.from(octets, (octet) => ALPHABET[octet % ALPHABET.length]).join('')
}

async function obtenirMotDePasse(): Promise<{ motDePasse: string; tire: boolean }> {
  if (process.stdin.isTTY) {
    const saisi = await demander('Nouveau mot de passe : ')
    if (saisi.length > 0) {
      if (saisi.length < LONGUEUR_MINIMALE) {
        throw new Error(`Mot de passe trop court : ${LONGUEUR_MINIMALE} caractères au minimum.`)
      }
      const confirme = await demander('Confirmer : ')
      if (confirme !== saisi) {
        throw new Error('Les deux saisies diffèrent.')
      }
      return { motDePasse: saisi, tire: false }
    }
  }

  const fourni = process.env.ADMIN_PASSWORD
  if (fourni) {
    if (fourni.length < LONGUEUR_MINIMALE) {
      throw new Error(`ADMIN_PASSWORD trop court : ${LONGUEUR_MINIMALE} caractères au minimum.`)
    }
    return { motDePasse: fourni, tire: false }
  }

  return { motDePasse: tirerAuHasard(), tire: true }
}

async function main() {
  const payload = await getPayload({ config })

  const voulu = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const { docs } = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 100,
    pagination: false,
    overrideAccess: true,
    where: voulu ? { email: { equals: voulu } } : {},
  })

  if (docs.length === 0) {
    payload.logger.error(
      voulu ? `Aucun compte pour ${voulu}.` : 'Aucun compte dans la base.',
    )
    process.exit(1)
  }

  if (docs.length > 1) {
    payload.logger.error('Plusieurs comptes : relancer avec ADMIN_EMAIL.')
    for (const compte of docs) {
      payload.logger.error(`  ${compte.email} — ${compte.role}`)
    }
    process.exit(1)
  }

  const compte = docs[0]!
  const { motDePasse, tire } = await obtenirMotDePasse()

  await payload.update({
    collection: 'users',
    id: compte.id,
    data: { password: motDePasse },
    overrideAccess: true,
  })

  await payload.unlock({
    collection: 'users',
    // Le type engendré réclame un mot de passe ; le déverrouillage ne lit que l'adresse.
    data: { email: compte.email, password: motDePasse },
    overrideAccess: true,
  })

  payload.logger.info(`Mot de passe redéfini pour ${compte.email}.`)
  if (tire) {
    payload.logger.info(`Mot de passe tiré au hasard : ${motDePasse}`)
    payload.logger.info('À enregistrer maintenant : il ne sera plus affiché.')
  }

  process.exit(0)
}

await main()
