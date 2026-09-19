/**
 * Jeu de données réel, exécuté par `pnpm seed`.
 * Source : les cinq fiches Fab listées dans `04-Assets/FabListing.md`.
 * Les textes anglais viennent des fiches Fab, les textes français sont leur traduction.
 * Les visuels sont ceux des fiches, téléchargés dans `04-Assets/fab/<slug>/`.
 * Le script est idempotent : il vide les collections de contenu avant d'écrire.
 */
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

const ASSETS = 'D:/Mecanode/04-Assets/fab'

type EngineVersion = '5.0' | '5.1' | '5.2' | '5.3' | '5.4' | '5.5' | '5.6' | '5.7'

/**
 * Versions d'Unreal compatibles, à confirmer produit par produit :
 * l'API de Fab ne les expose pas.
 */
const ENGINE_VERSIONS: Record<string, EngineVersion[]> = {
  'chaos-batch-fracture': ['5.6', '5.7'],
  'dice-system': ['5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7'],
  'histogram-chart': ['5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7'],
  'pie-chart': ['5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7'],
  'curve-chart-blueprint': ['5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7'],
}

const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
      ],
    })),
  },
})

const toolSeeds = [
  {
    name: 'ChaosBatchFracture',
    slug: 'chaos-batch-fracture',
    assetDir: 'chaosbatchfracture',
    category: 'physics',
    tags: ['editor', 'code-plugin', 'automation'],
    fabUrl: 'https://www.fab.com/listings/85075872-2ac1-474f-89d3-cce82837ec83',
    releaseDate: '2026-05-27',
    featured: true,
    tagline: {
      en: 'Batch-fracture Static Meshes into runtime-ready Geometry Collections.',
      fr: 'Fracture par lots des Static Meshes en Geometry Collections prêtes pour le runtime.',
    },
    description: {
      en: [
        'ChaosBatchFracture converts several Static Meshes into fractured Chaos Geometry Collections in a single batch. Select your meshes, pick a preset, and the plugin generates organised GC_ assets on its own.',
        'It also prepares those collections for runtime: tiny fragments are fixed, the collection is validated, convex collision hulls and Chaos simulation data are generated, render data is rebuilt.',
        'The workflow is built for production: presets for fast preview or runtime-safe generation, safe handling of existing assets, progress and cancel support, automatic saving, and safety limits that keep a heavy fracture job from running away.',
      ],
      fr: [
        'ChaosBatchFracture convertit plusieurs Static Meshes en Geometry Collections Chaos fracturées, en un seul lot. Tu sélectionnes tes meshes, tu choisis un préréglage, le plugin génère seul des assets GC_ rangés.',
        'Il prépare aussi ces collections pour le runtime : les fragments minuscules sont corrigés, la collection est validée, les enveloppes de collision convexes et les données de simulation Chaos sont générées, les données de rendu reconstruites.',
        "Le flux est pensé pour la production : préréglages d'aperçu rapide ou de génération sûre en runtime, respect des assets existants, avancement et annulation, sauvegarde automatique, et des garde-fous qui empêchent un travail de fracture de partir en vrille.",
      ],
    },
    releaseNotes: [
      {
        version: '1.0',
        date: '2026-05-27',
        changes: { en: 'Initial release.', fr: 'Première version.' },
      },
    ],
  },
  {
    name: 'Dice System',
    slug: 'dice-system',
    assetDir: 'dice-system',
    category: 'gameplay-features',
    tags: ['blueprint', 'tabletop'],
    fabUrl: 'https://www.fab.com/listings/232b0035-8d2f-4b4b-abf1-156afb30dfa3',
    releaseDate: '2022-07-24',
    featured: true,
    tagline: {
      en: 'Physics-driven dice rolling, from D4 to D100, in pure Blueprint.',
      fr: 'Des lancers de dés physiques, du D4 au D100, en Blueprint pur.',
    },
    description: {
      en: [
        'A dice rolling system, fully physics-based and built entirely in nodes: not a line of C++ was harmed during development.',
        'Every die used in role-playing games is there, from D4 to D100, in any number, with the total computed automatically whatever sits on the table, and each die readable on its own. Display those values or keep them hidden, as you like.',
        'And since a die sometimes lands broken, you can remove it and roll it again.',
      ],
      fr: [
        "Un système de lancer de dés entièrement physique, construit en nœuds de bout en bout : pas une ligne de C++ n'a été maltraitée.",
        'Tous les dés du jeu de rôle sont là, du D4 au D100, en nombre illimité, avec le total calculé automatiquement quel que soit ce qui traîne sur la table, et la valeur de chaque dé lisible séparément. Ces valeurs sont affichées ou masquées, au choix.',
        'Et comme il arrive qu\u2019un dé tombe de travers, tu peux le retirer et le relancer.',
      ],
    },
    releaseNotes: [
      {
        version: '1.0',
        date: '2022-07-24',
        changes: { en: 'Initial release.', fr: 'Première version.' },
      },
    ],
  },
  {
    name: 'Histogram Chart',
    slug: 'histogram-chart',
    assetDir: 'histogram-chart',
    category: 'gameplay-features',
    tags: ['blueprint', 'chart'],
    fabUrl: 'https://www.fab.com/listings/8f25c203-c9cf-422b-8e89-65e8ad35e95b',
    releaseDate: '2021-12-17',
    featured: false,
    tagline: {
      en: 'A full 3D histogram, driven by two Blueprint functions.',
      fr: 'Un histogramme 3D complet, piloté par deux fonctions Blueprint.',
    },
    description: {
      en: [
        'This Blueprint gives you the mechanism for a complete 3D histogram chart. Write your data, set your parameters, then call two functions to show or hide the whole chart.',
        'Materials, font size, axis scales: more than fifty options and parameters let you shape every element exactly as you want it.',
      ],
      fr: [
        'Ce Blueprint fournit tout le mécanisme d\u2019un histogramme 3D complet. Tu écris tes données, tu règles tes paramètres, puis deux fonctions suffisent à afficher ou masquer le graphique entier.',
        'Matériaux, corps de texte, échelles des axes : plus de cinquante options et paramètres pour façonner chaque élément exactement comme tu le veux.',
      ],
    },
    releaseNotes: [
      {
        version: '1.0',
        date: '2021-12-17',
        changes: { en: 'Initial release.', fr: 'Première version.' },
      },
    ],
  },
  {
    name: 'Pie Chart',
    slug: 'pie-chart',
    assetDir: 'pie-chart',
    category: 'gameplay-features',
    tags: ['blueprint', 'chart'],
    fabUrl: 'https://www.fab.com/listings/23875c1c-d3cc-4dbd-9aec-70444017b9b0',
    releaseDate: '2021-12-16',
    featured: false,
    tagline: {
      en: 'A full 3D pie chart, driven by two Blueprint functions.',
      fr: 'Un camembert 3D complet, piloté par deux fonctions Blueprint.',
    },
    description: {
      en: [
        'This Blueprint gives you the mechanism for a complete 3D pie chart. Write your data, set your parameters, then call two functions to show or hide the whole chart.',
        'Materials, font size, labels: a long list of options and parameters lets you shape every element exactly as you want it.',
      ],
      fr: [
        'Ce Blueprint fournit tout le mécanisme d\u2019un camembert 3D complet. Tu écris tes données, tu règles tes paramètres, puis deux fonctions suffisent à afficher ou masquer le graphique entier.',
        'Matériaux, corps de texte, étiquettes : une longue liste d\u2019options et de paramètres pour façonner chaque élément exactement comme tu le veux.',
      ],
    },
    releaseNotes: [
      {
        version: '1.0',
        date: '2021-12-16',
        changes: { en: 'Initial release.', fr: 'Première version.' },
      },
    ],
  },
  {
    name: 'Curve Chart Blueprint',
    slug: 'curve-chart-blueprint',
    assetDir: 'curve-chart-blueprint',
    category: 'gameplay-features',
    tags: ['blueprint', 'chart'],
    fabUrl: 'https://www.fab.com/listings/a8ad035f-4737-475e-8ca9-0e6edc351243',
    releaseDate: '2021-12-15',
    featured: false,
    tagline: {
      en: 'A full 3D curve chart, driven by two Blueprint functions.',
      fr: 'Un graphique de courbes 3D complet, piloté par deux fonctions Blueprint.',
    },
    description: {
      en: [
        'This Blueprint gives you the mechanism for a complete 3D curve chart. Write your data, set your parameters, then call two functions to show or hide the whole chart.',
        'Materials, font size, axis scales: more than fifty options and parameters let you shape every element exactly as you want it.',
      ],
      fr: [
        'Ce Blueprint fournit tout le mécanisme d\u2019un graphique de courbes 3D complet. Tu écris tes données, tu règles tes paramètres, puis deux fonctions suffisent à afficher ou masquer le graphique entier.',
        'Matériaux, corps de texte, échelles des axes : plus de cinquante options et paramètres pour façonner chaque élément exactement comme tu le veux.',
      ],
    },
    releaseNotes: [
      {
        version: '1.0',
        date: '2021-12-15',
        changes: { en: 'Initial release.', fr: 'Première version.' },
      },
    ],
  },
]

const categorySeeds = [
  { slug: 'physics', en: 'Physics', fr: 'Physique' },
  { slug: 'gameplay-features', en: 'Gameplay features', fr: 'Fonctionnalités de jeu' },
]

const tagSeeds = [
  { slug: 'blueprint', en: 'Blueprint', fr: 'Blueprint' },
  { slug: 'code-plugin', en: 'C++ plugin', fr: 'Plugin C++' },
  { slug: 'editor', en: 'Editor tool', fr: "Outil d'éditeur" },
  { slug: 'chart', en: 'Data visualisation', fr: 'Visualisation de données' },
  { slug: 'tabletop', en: 'Tabletop', fr: 'Jeu de table' },
  { slug: 'automation', en: 'Automation', fr: 'Automatisation' },
]

const FAB_STORE = 'https://www.fab.com/sellers/Mecanode'

async function seed() {
  const payload = await getPayload({ config })

  for (const collection of ['tools', 'pages', 'tags', 'media'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }
  payload.logger.info('Collections de contenu vidées.')

  const categories: Record<string, number> = {}
  for (const category of categorySeeds) {
    const created = await payload.create({
      collection: 'tags',
      locale: 'en',
      data: { name: category.en, kind: 'category', slug: category.slug },
    })
    await payload.update({
      collection: 'tags',
      id: created.id,
      locale: 'fr',
      data: { name: category.fr },
    })
    categories[category.slug] = created.id
  }

  const tags: Record<string, number> = {}
  for (const tag of tagSeeds) {
    const created = await payload.create({
      collection: 'tags',
      locale: 'en',
      data: { name: tag.en, kind: 'tag', slug: tag.slug },
    })
    await payload.update({
      collection: 'tags',
      id: created.id,
      locale: 'fr',
      data: { name: tag.fr },
    })
    tags[tag.slug] = created.id
  }
  payload.logger.info('Étiquettes créées.')

  for (const tool of toolSeeds) {
    const dir = path.join(ASSETS, tool.assetDir)
    const files = fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
          .sort()
      : []

    if (files.length === 0) {
      payload.logger.warn(`Aucun visuel pour ${tool.name}, dossier ${dir}`)
      continue
    }

    const mediaIds: number[] = []
    for (const [index, file] of files.entries()) {
      const created = await payload.create({
        collection: 'media',
        locale: 'en',
        filePath: path.join(dir, file),
        data: {
          alt: `${tool.name} — screenshot ${index + 1}`,
          credit: 'Mecanode',
        },
      })
      await payload.update({
        collection: 'media',
        id: created.id,
        locale: 'fr',
        data: { alt: `${tool.name} — capture ${index + 1}` },
      })
      mediaIds.push(created.id)
    }

    const created = await payload.create({
      collection: 'tools',
      locale: 'en',
      data: {
        name: tool.name,
        slug: tool.slug,
        tagline: tool.tagline.en,
        description: richText(tool.description.en),
        mainImage: mediaIds[0],
        gallery: mediaIds.slice(1),
        engineVersions: ENGINE_VERSIONS[tool.slug],
        category: categories[tool.category],
        tags: tool.tags.map((slug) => tags[slug]),
        fabUrl: tool.fabUrl,
        releaseDate: tool.releaseDate,
        featured: tool.featured,
        releaseNotes: tool.releaseNotes.map((note) => ({
          version: note.version,
          date: note.date,
          changes: note.changes.en,
        })),
        _status: 'published',
      },
    })

    await payload.update({
      collection: 'tools',
      id: created.id,
      locale: 'fr',
      data: {
        tagline: tool.tagline.fr,
        description: richText(tool.description.fr),
        releaseNotes: tool.releaseNotes.map((note) => ({
          version: note.version,
          date: note.date,
          changes: note.changes.fr,
        })),
        _status: 'published',
      },
    })

    payload.logger.info(`${tool.name} : ${files.length} visuels importés.`)
  }

  const about = await payload.create({
    collection: 'pages',
    locale: 'en',
    data: {
      title: 'About and teaching',
      slug: 'about',
      lede: 'Ten years of Blueprint, two of C++, and a classroom to keep both honest.',
      content: richText([
        'I build Unreal Engine tools for production teams and teach the engine to the students who will use them.',
        'Everything on Fab started as a problem on a real project, then got sharpened by a room full of students asking why it works that way.',
      ]),
      _status: 'published',
    },
  })
  await payload.update({
    collection: 'pages',
    id: about.id,
    locale: 'fr',
    data: {
      title: 'Profil et enseignement',
      lede: 'Dix ans de Blueprint, deux ans de C++, et une salle de classe pour tenir les deux.',
      content: richText([
        "Je construis des outils Unreal Engine pour des équipes de production, et j'enseigne le moteur à ceux qui les utiliseront.",
        "Tout ce qui est sur Fab est né d'un problème sur un vrai projet, puis affûté par une salle d'étudiants qui demandent pourquoi ça marche comme ça.",
      ]),
      _status: 'published',
    },
  })
  payload.logger.info('Page profil créée.')

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      siteName: 'MECANODE',
      tagline: 'Unreal Engine tools, built in production and taught in class.',
      heroTitle: 'Tools that do\nthe *tedious part*\nof Unreal.',
      heroMeta: [
        { label: 'Blueprint and C++' },
        { label: 'Editor and runtime' },
        { label: 'Sold on Fab' },
      ],
      ctaTitle: 'Everything is on Fab.',
      ctaLede:
        'One purchase, lifetime updates, and answers written by the person who wrote the code.',
      lede: 'Editor plugins and Blueprint systems built over ten years of production and teaching. Drop them in, ship faster, keep your graph readable.',
      footerNote: 'Unreal Engine tools, built in production and tested in classrooms.',
      fabUrl: FAB_STORE,
      engineRange: '5.0 → 5.7',
      stats: [
        { value: '10', label: 'years of Blueprint', highlight: false },
        { value: '2', label: 'years of C++', highlight: true },
        { value: '5.0 → 5.7', label: 'engine versions', highlight: false },
        { value: '5', label: 'tools on Fab', highlight: false },
      ],
      elsewhere: [
        { label: 'Fab', url: FAB_STORE },
        { label: 'YouTube', url: 'https://www.youtube.com/' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
      ],
    },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'fr',
    data: {
      tagline: 'Des outils Unreal Engine, éprouvés en production et enseignés en cours.',
      heroTitle: 'Des outils qui font\nla *part ingrate*\nd’Unreal.',
      heroMeta: [
        { label: 'Blueprint et C++' },
        { label: 'Éditeur et runtime' },
        { label: 'Vendus sur Fab' },
      ],
      ctaTitle: 'Tout est sur Fab.',
      ctaLede:
        'Un achat, des mises à jour à vie, et des réponses écrites par celui qui a écrit le code.',
      lede: "Plugins d'éditeur et systèmes Blueprint, nés de dix ans de production et d'enseignement. À poser dans le projet, pour livrer plus vite et garder un graphe lisible.",
      footerNote: 'Des outils Unreal Engine, éprouvés en production et essayés en cours.',
      stats: [
        { value: '10', label: 'ans de Blueprint', highlight: false },
        { value: '2', label: 'ans de C++', highlight: true },
        { value: '5.0 → 5.7', label: "versions d'Unreal", highlight: false },
        { value: '5', label: 'outils sur Fab', highlight: false },
      ],
    },
  })
  payload.logger.info('Réglages du site écrits.')
  payload.logger.info('Jeu de données terminé.')

  process.exit(0)
}

await seed()
