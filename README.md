# Mecanode — site

Vitrine des outils Unreal Engine de la marque MECANODE, de la galerie de travaux et de
l'activité d'enseignement d'Arnaud Szobad.

Application Next.js 16 (App Router, React 19) avec Payload 3 monté dans la même
application : le front est servi sur `/`, le back-office sur `/admin`.

## Prérequis

- Node 20.9 ou plus.
- pnpm, activé par `corepack enable pnpm`.

## Démarrer

```bash
pnpm install
cp .env.example .env   # puis renseigner PAYLOAD_SECRET et DATABASE_URI
pnpm dev
```

- Front : http://localhost:3000 — redirige vers `/en` ou `/fr`.
- Back-office : http://localhost:3000/admin — le premier lancement demande la création
  du compte administrateur.

## Variables d'environnement

| Clé | Rôle |
| --- | --- |
| `PAYLOAD_SECRET` | Chaîne aléatoire de 32 caractères, signe les jetons de session. |
| `DATABASE_URI` | Emplacement de la base SQLite, `file:./data/mecanode.db`. |

`.env` n'est pas versionné. `.env.example` sert de modèle.

## Données

| Quoi | Où | Versionné |
| --- | --- | --- |
| Base SQLite | `data/mecanode.db` | non |
| Médias téléversés | `media/` | non |
| Types générés par Payload | `src/payload-types.ts` | oui |
| Migrations | `src/migrations/` | oui |

Les deux dossiers `data/` et `media/` sont à sauvegarder ensemble : une base sans ses
fichiers ne se relit pas.

## Commandes

| Commande | Effet |
| --- | --- |
| `pnpm dev` | Serveur de développement sur le port 3000. |
| `pnpm build` | Construction de production. |
| `pnpm start` | Sert la construction de production. |
| `pnpm lint` | ESLint sur tout le projet. |
| `npx tsc --noEmit` | Vérification des types, sans émission. |
| `pnpm payload generate:types` | Régénère `src/payload-types.ts` depuis les collections. |
| `pnpm payload migrate:create` | Crée une migration après modification d'une collection. |
| `pnpm payload migrate` | Applique les migrations en attente. |
| `pnpm seed` | Remplit la base avec le jeu de données d'exemple, en anglais et en français. |

## Conventions

- Le front lit la base par l'API locale de Payload, jamais par HTTP au build.
- Les types du contenu sont générés, jamais écrits à la main.
- Les polices sont servies par le site.
- Bilinguisme champ par champ, `en` par défaut, un champ `fr` vide retombe sur `en`.
- La poussée automatique du schéma est désactivée : toute évolution d'une collection passe par une migration, en développement comme en production.

## Déploiement

Poussée sur `main`, construction et mise en ligne par intégration continue.
Base et dossier des médias sauvegardés chaque nuit.
