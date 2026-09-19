# Mecanode — site

Vitrine des outils Unreal Engine vendus sur Fab sous la marque MECANODE, de la galerie
de travaux et de l'activité d'enseignement d'Arnaud Szobad.

## Interlocuteur

Développeur Unreal Engine, dix ans de Blueprint, deux ans de C++, enseignant.
Dix ans d'expérience web fullstack, mais qui date de dix ans : les concepts sont acquis,
l'écosystème JavaScript moderne ne l'est pas. Expliquer ce qui a changé, pas ce qu'est une
fonction. IDE : JetBrains Rider, exclusivement.

Style de réponse attendu :

- Une consigne par ligne, verbe d'action en tête.
- Les conditions et avertissements avant la liste d'actions, jamais après.
- Pas de paragraphe expliquant pourquoi, sauf s'il le demande.
- Notation `[]` pour les types tableau.

## Stack

| Brique | Choix |
| --- | --- |
| Framework | Next.js 16, App Router, React 19 |
| Langage | TypeScript strict |
| CMS et back-office | Payload 3, monté dans la même application Next.js, admin sur `/admin` |
| Base | SQLite via `@payloadcms/db-sqlite` |
| Styles | Tailwind CSS v4, thème piloté par variables CSS |
| Composants | shadcn/ui, copiés dans le projet |
| Animation | Motion, avec respect de `prefers-reduced-motion` |
| Internationalisation | next-intl, routes `/en` et `/fr` |
| Rendu | statique, régénéré à la publication |
| Gestionnaire de paquets | pnpm |
| Node | 20.9 minimum |

Contraintes fermes :

- Le front lit la base par l'API locale de Payload, jamais par HTTP au build.
- Les types du contenu sont générés par Payload, jamais écrits à la main.
- Les polices sont servies par le site, jamais appelées chez un tiers.
- Le lecteur vidéo YouTube ou Vimeo se charge au clic, pas au chargement de la page.
- Aucune donnée personnelle collectée : pas de formulaire, pas de compte visiteur, pas de cookie de mesure.

## Modèle de contenu

`Tool`, `Media`, `Tag`, `Page`, `SiteSettings`.

`Tool` porte : nom, identifiant d'URL, accroche, description, visuel principal, galerie `Media[]`,
URL de vidéo, versions d'Unreal compatibles `string[]`, catégorie, lien Fab, notes de version,
date de sortie, mise en avant, statut.

Aucun prix n'est stocké : il vit sur Fab.

Le bilinguisme est champ par champ, sur un document unique. Un texte français absent retombe
sur l'anglais. Le back-office signale les traductions manquantes dans la liste.

## Direction visuelle

Direction « Node Graph » : sombre, grille de points en filigrane, cartes aux angles coupés,
fils de Bézier entre les nœuds, mono pour les données techniques.

Les maquettes de référence sont dans `../02-Maquettes/node-graph/` : `index.html`, `outil.html`,
`galerie.html`, `profil.html`, `admin.html`, `logo.html`, et le thème complet dans `theme.css`.
Les jetons de couleur et de mesure sont repris dans `tokens.css`, à porter dans Tailwind.

Usage des couleurs :

- Cyan `#2BE5FF` : identité, liens actifs, accents de graphe.
- Orange `#FF7A2F` : uniquement les actions qui mènent à Fab.
- Violet `#6D4AEF` : teinte des fonds, panneaux et bordures, et contenus Blueprint.
- Violet clair `#A594FF` : petites étiquettes sur fond sombre.

Typographie : Inter pour le texte, JetBrains Mono pour versions, dates, identifiants et étiquettes.

## Structure des dossiers

```
D:\Mecanode\
  01-Cahier-des-charges\   specifications, brief des lots
  02-Maquettes\            maquettes HTML par direction
  03-Site\                 ce depot
  04-Assets\               visuels sources, showreel, logos
  05-Contenu\              textes EN et FR, fiches outils
```

## Budget de qualité

- Affichage du plus grand élément sous 2 s en 4G mobile.
- Lighthouse au-dessus de 95 sur les quatre axes.
- Contraste conforme AA.
- Parcours complet au clavier, focus visible.
- Texte alternatif obligatoire et bilingue sur chaque média.

## Hébergement visé

Offre Node.js managée chez un hébergeur francophone, déploiement par intégration continue
depuis la branche `main`. Base SQLite et dossier des médias sauvegardés chaque nuit.
