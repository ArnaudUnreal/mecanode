/**
 * Jeu de données d'exemple, exécuté par `pnpm seed`.
 * Reprend le contenu de démonstration des maquettes, en anglais et en français.
 * Le script est idempotent : il vide les collections de contenu avant d'écrire.
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

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

/** Visuel de remplacement : deux nœuds Blueprint reliés par un fil, aux couleurs du thème. */
async function nodeArt(wire: string, head: string, label: string): Promise<Buffer> {
  const dots = Array.from({ length: 15 }, (_, row) =>
    Array.from(
      { length: 27 },
      (_, col) => '<circle cx="' + (40 + col * 58) + '" cy="' + (40 + row * 58) + '" r="2"/>',
    ).join(''),
  ).join('')

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">',
    '<rect width="1600" height="900" fill="#0B0716"/>',
    '<g fill="#1E1830">' + dots + '</g>',
    '<path d="M520 330 C 700 330, 660 560, 840 560" stroke="' +
      wire +
      '" stroke-width="9" fill="none" opacity="0.9"/>',
    '<rect x="180" y="250" width="340" height="180" rx="16" fill="#171227" stroke="#2A2340" stroke-width="3"/>',
    '<rect x="180" y="250" width="340" height="52" rx="16" fill="' + head + '"/>',
    '<rect x="180" y="288" width="340" height="14" fill="#171227"/>',
    '<circle cx="520" cy="330" r="14" fill="' + wire + '"/>',
    '<rect x="840" y="470" width="420" height="220" rx="16" fill="#171227" stroke="#33294A" stroke-width="3"/>',
    '<rect x="840" y="470" width="420" height="52" rx="16" fill="' + head + '" opacity="0.75"/>',
    '<rect x="840" y="508" width="420" height="14" fill="#171227"/>',
    '<circle cx="840" cy="560" r="14" fill="' + wire + '"/>',
    '<text x="180" y="800" fill="#6C6090" font-family="monospace" font-size="34" letter-spacing="6">' +
      label +
      '</text>',
    '</svg>',
  ].join('')

  return sharp(Buffer.from(svg)).png().toBuffer()
}

type EngineVersion = '5.0' | '5.1' | '5.2' | '5.3' | '5.4' | '5.5' | '5.6' | '5.7'

const toolSeeds = [
  {
    name: 'Grid Weaver',
    slug: 'grid-weaver',
    accent: { wire: '#2BE5FF', head: '#1F6E8C' },
    category: 'level-design',
    tagline: {
      en: 'Procedural grids that stay art-directable.',
      fr: 'Des grilles procédurales qui restent dirigeables.',
    },
    description: {
      en: [
        'Grid Weaver spawns, snaps and reshapes grids of actors from a single Blueprint node, without throwing away hand placement.',
        'Every instance keeps its own overrides, so a level artist can nudge one tile and regenerate the rest.',
      ],
      fr: [
        "Grid Weaver génère, aligne et remodèle des grilles d'Actors depuis un seul nœud Blueprint, sans jeter le placement manuel.",
        'Chaque instance garde ses propres surcharges : le level artist déplace une tuile et régénère le reste.',
      ],
    },
    engineVersions: ['5.3', '5.4', '5.5', '5.6', '5.7'] as EngineVersion[],
    releaseDate: '2025-02-11',
    featured: true,
    releaseNotes: [
      {
        version: '1.3.0',
        date: '2026-06-02',
        changes: {
          en: 'Radial layouts, per-instance seeds, Unreal 5.7 support.',
          fr: "Dispositions radiales, graines par instance, prise en charge d'Unreal 5.7.",
        },
      },
      {
        version: '1.2.0',
        date: '2026-01-19',
        changes: {
          en: 'Collision presets exposed on the node, faster rebuild on large grids.',
          fr: 'Préréglages de collision exposés sur le nœud, reconstruction plus rapide sur les grandes grilles.',
        },
      },
    ],
  },
  {
    name: 'Graph Tidy',
    slug: 'graph-tidy',
    accent: { wire: '#7C5CFF', head: '#3B2A7A' },
    category: 'editor-utility',
    tagline: {
      en: 'One shortcut, a readable Event Graph.',
      fr: 'Un raccourci, un Event Graph lisible.',
    },
    description: {
      en: [
        'Graph Tidy aligns nodes, straightens wires and groups reroutes across a whole Blueprint, in one pass.',
        'It never moves a comment box, so the structure you drew by hand survives the cleanup.',
      ],
      fr: [
        "Graph Tidy aligne les nœuds, redresse les fils et regroupe les reroutes d'un Blueprint entier, en une passe.",
        'Il ne déplace jamais une boîte de commentaire : la structure dessinée à la main survit au rangement.',
      ],
    },
    engineVersions: ['5.4', '5.5', '5.6', '5.7'] as EngineVersion[],
    releaseDate: '2025-09-30',
    featured: true,
    releaseNotes: [
      {
        version: '2.0.1',
        date: '2026-05-14',
        changes: {
          en: 'Undo now restores the exact previous layout.',
          fr: "L'annulation restitue la disposition précédente au pixel près.",
        },
      },
    ],
  },
  {
    name: 'Signal Bus',
    slug: 'signal-bus',
    accent: { wire: '#FF7A2F', head: '#8C4A1C' },
    category: 'gameplay-framework',
    tagline: {
      en: 'Events without the spaghetti.',
      fr: 'Des événements sans les spaghettis.',
    },
    description: {
      en: [
        'A typed message bus for Blueprint and C++, with a live inspector to watch traffic while you play.',
        'Channels are assets, so designers subscribe without touching a header file.',
      ],
      fr: [
        'Un bus de messages typé pour Blueprint et C++, avec un inspecteur pour suivre le trafic en jeu.',
        "Les canaux sont des assets : un designer s'abonne sans ouvrir un fichier d'en-tête.",
      ],
    },
    engineVersions: ['5.3', '5.4', '5.5', '5.6', '5.7'] as EngineVersion[],
    releaseDate: '2024-11-05',
    featured: false,
    releaseNotes: [
      {
        version: '1.1.0',
        date: '2026-03-08',
        changes: {
          en: 'Replicated channels, inspector filters.',
          fr: "Canaux répliqués, filtres dans l'inspecteur.",
        },
      },
    ],
  },
]

const categorySeeds = [
  { slug: 'level-design', en: 'Level design', fr: 'Level design' },
  { slug: 'editor-utility', en: 'Editor utility', fr: "Utilitaire d'éditeur" },
  { slug: 'gameplay-framework', en: 'Gameplay framework', fr: 'Cadre de gameplay' },
]

const tagSeeds = [
  { slug: 'blueprint', en: 'Blueprint', fr: 'Blueprint' },
  { slug: 'cpp', en: 'C++', fr: 'C++' },
  { slug: 'teaching', en: 'Teaching', fr: 'Enseignement' },
]

const FAB_URL = 'https://www.fab.com/sellers/Mecanode'

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
    const cover = await nodeArt(tool.accent.wire, tool.accent.head, tool.name.toUpperCase())

    const media = await payload.create({
      collection: 'media',
      locale: 'en',
      data: { alt: tool.name + ' node graph preview' },
      file: {
        data: cover,
        mimetype: 'image/png',
        name: tool.slug + '-cover.png',
        size: cover.length,
      },
    })
    await payload.update({
      collection: 'media',
      id: media.id,
      locale: 'fr',
      data: { alt: 'Aperçu du graphe de nœuds de ' + tool.name },
    })

    const created = await payload.create({
      collection: 'tools',
      locale: 'en',
      data: {
        name: tool.name,
        slug: tool.slug,
        tagline: tool.tagline.en,
        description: richText(tool.description.en),
        mainImage: media.id,
        engineVersions: tool.engineVersions,
        category: categories[tool.category],
        tags: [tags.blueprint, tags.cpp],
        fabUrl: FAB_URL,
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
  }
  payload.logger.info('Outils créés.')

  const about = await payload.create({
    collection: 'pages',
    locale: 'en',
    data: {
      title: 'About and teaching',
      slug: 'about',
      lede: 'Ten years of Blueprint, two of C++, and a classroom to keep both honest.',
      content: richText([
        'I build Unreal Engine tools for production teams and teach the engine to students who will use them.',
        'Everything sold on Fab started as a problem on a real project, then got sharpened by twenty students asking why it works that way.',
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
        "Tout ce qui est vendu sur Fab est né d'un problème sur un vrai projet, puis affûté par vingt étudiants qui demandent pourquoi ça marche comme ça.",
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
      lede: 'Editor utilities and runtime systems built over ten years of production and teaching. Drop them in, ship faster, keep your Blueprint graph readable.',
      footerNote: 'Unreal Engine tools, built in production and tested in classrooms.',
      fabUrl: FAB_URL,
      engineRange: '5.3 → 5.7',
      stats: [
        { value: '10', label: 'years of Blueprint', highlight: false },
        { value: '2', label: 'years of C++', highlight: true },
        { value: '5.3 → 5.7', label: 'engine versions', highlight: false },
        { value: '3', label: 'tools on Fab', highlight: false },
      ],
      elsewhere: [
        { label: 'YouTube', url: 'https://www.youtube.com/' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
        { label: 'Contact', url: 'mailto:contact@mecanode.dev' },
      ],
    },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'fr',
    data: {
      tagline: 'Des outils Unreal Engine, éprouvés en production et enseignés en cours.',
      lede: "Utilitaires d'éditeur et systèmes de jeu, nés de dix ans de production et d'enseignement. À poser dans le projet, pour livrer plus vite et garder un graphe Blueprint lisible.",
      footerNote: 'Des outils Unreal Engine, éprouvés en production et essayés en cours.',
      stats: [
        { value: '10', label: 'ans de Blueprint', highlight: false },
        { value: '2', label: 'ans de C++', highlight: true },
        { value: '5.3 → 5.7', label: "versions d'Unreal", highlight: false },
        { value: '3', label: 'outils sur Fab', highlight: false },
      ],
    },
  })
  payload.logger.info('Réglages du site écrits.')
  payload.logger.info('Jeu de données terminé.')

  process.exit(0)
}

await seed()
