/**
 * Jeu de données réel, exécuté par `pnpm seed`.
 * Source : les six fiches Fab listées dans `04-Assets/FabListing.md`.
 * Les textes anglais viennent des fiches Fab, les textes français sont leur traduction.
 * Les visuels sont ceux des fiches, téléchargés dans `04-Assets/fab/<slug>/`.
 * Le script est idempotent : il vide les collections de contenu avant d'écrire.
 *
 * `SEED_ONLY=<slug>` n'ajoute que cet outil, sans rien vider : c'est le mode à utiliser sur
 * une base de production, dont le contenu a pu être retouché dans le back-office.
 * Catégorie et étiquettes manquantes sont créées, un outil déjà présent est laissé tel quel.
 * `SEED_ASSETS` remplace le dossier des visuels, sur un serveur qui n'a pas `D:/`.
 */
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

const ASSETS = process.env.SEED_ASSETS || 'D:/Mecanode/04-Assets/fab'
const ONLY = process.env.SEED_ONLY

type EngineVersion =
  | '4.25'
  | '4.26'
  | '4.27'
  | '5.0'
  | '5.1'
  | '5.2'
  | '5.3'
  | '5.4'
  | '5.5'
  | '5.6'
  | '5.7'
  | '5.8'

/** Versions d'Unreal compatibles, reprises de `04-Assets/FabListing.md`. */
const ENGINE_VERSIONS: Record<string, EngineVersion[]> = {
  minimap: ['5.6', '5.7', '5.8'],
  'chaos-batch-fracture': ['5.6', '5.7'],
  'dice-system': ['5.2', '5.3', '5.4', '5.5', '5.6'],
  'histogram-chart': ['4.25', '4.26', '4.27', '5.3', '5.4', '5.5', '5.6'],
  'pie-chart': ['4.25', '4.26', '4.27', '5.3', '5.4', '5.5', '5.6'],
  'curve-chart-blueprint': ['4.25', '4.26', '4.27', '5.3', '5.4', '5.5', '5.6'],
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
    name: 'MiniMap',
    slug: 'minimap',
    assetDir: 'minimap',
    category: 'editor-tools',
    tags: ['editor', 'code-plugin'],
    fabUrl: 'https://www.fab.com/listings/029a652c-4ad3-415b-a9af-162e94f11ac3',
    videoUrl: 'https://www.youtube.com/watch?v=Gdijh80Qzok',
    releaseDate: '2026-10-23',
    featured: true,
    tagline: {
      en: 'A top-down map of your level, right in the editor: see every Actor, click, and you are there.',
      fr: "Une carte de ton level vue de dessus, dans l'éditeur : tu vois chaque Actor, tu cliques, tu y es.",
    },
    description: {
      en: [
        'MiniMap adds a dockable tab to the Unreal Editor with a top-down map of the current level. No more flying around the viewport for minutes looking for that spawn point, that light or that trigger lost behind a hill.',
        'Click an Actor to select it, Ctrl + click to add or remove it, double-click to focus the editor camera on it. Click empty space and the camera jumps right above that point, keeping its orientation and its height above the ground. The editor camera is drawn with its field of view, so you always know where you are and what you are looking at.',
        'The map fits the level bounds, never stretches, and updates itself when Actors are added, moved, renamed or deleted. A filter on class name or label keeps only the Actors you are after, and a 2048 × 2048 aerial capture of the level can serve as background.',
        'Editor only: nothing ends up in the packaged game. No assets, no setup, full C++ source included, World Partition supported for the cells loaded in the editor.',
      ],
      fr: [
        "MiniMap ajoute à l'éditeur Unreal un onglet, à placer où tu veux, avec une carte vue de dessus du level ouvert. Fini les minutes passées à voler dans le viewport à la recherche de ce point de spawn, de cette lumière ou de ce trigger perdu derrière une colline.",
        "Un clic sur un Actor le sélectionne, Ctrl + clic l'ajoute ou le retire, un double-clic y amène la caméra de l'éditeur. Un clic dans le vide téléporte la caméra juste au-dessus du point, en gardant son orientation et sa hauteur au-dessus du sol. La caméra est dessinée avec son champ de vision : tu sais toujours où tu es et ce que tu regardes.",
        "La carte s'ajuste aux dimensions du level, ne se déforme jamais et se met à jour seule quand un Actor est ajouté, déplacé, renommé ou supprimé. Un filtre sur le nom de classe ou le label ne garde que les Actors que tu cherches, et une capture aérienne du level en 2048 × 2048 peut servir de fond de carte.",
        "Réservé à l'éditeur : rien n'arrive dans le jeu packagé. Aucun asset, aucune configuration, le code source C++ complet est inclus, et World Partition est pris en charge pour les cellules chargées dans l'éditeur.",
      ],
    },
    releaseNotes: [
      {
        version: '1.1',
        date: '2026-10-23',
        changes: { en: 'Initial release on Fab.', fr: 'Première version sur Fab.' },
      },
    ],
  },
  {
    name: 'ChaosBatchFracture',
    slug: 'chaos-batch-fracture',
    assetDir: 'chaosbatchfracture',
    category: 'physics',
    tags: ['editor', 'code-plugin', 'automation'],
    fabUrl: 'https://www.fab.com/listings/85075872-2ac1-474f-89d3-cce82837ec83',
    videoUrl: 'https://youtu.be/l2fxp2Ulp7U',
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
  { slug: 'editor-tools', en: 'Editor tools', fr: "Outils d'éditeur" },
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

  const selected = ONLY ? toolSeeds.filter((tool) => tool.slug === ONLY) : toolSeeds
  if (ONLY && selected.length === 0) {
    payload.logger.error(`Aucun outil « ${ONLY} » dans le jeu de données.`)
    process.exit(1)
  }

  if (!ONLY) {
    for (const collection of ['tools', 'pages', 'tags', 'media'] as const) {
      await payload.delete({ collection, where: { id: { exists: true } } })
    }
    payload.logger.info('Collections de contenu vidées.')
  }

  // Reprend l'étiquette existante de même identifiant, sinon la crée dans les deux langues.
  const ensureTag = async (kind: 'category' | 'tag', seed: (typeof tagSeeds)[number]) => {
    const existing = await payload.find({
      collection: 'tags',
      where: { slug: { equals: seed.slug }, kind: { equals: kind } },
      limit: 1,
    })
    if (existing.docs[0]) return existing.docs[0].id

    const created = await payload.create({
      collection: 'tags',
      locale: 'en',
      data: { name: seed.en, kind, slug: seed.slug },
    })
    await payload.update({
      collection: 'tags',
      id: created.id,
      locale: 'fr',
      data: { name: seed.fr },
    })
    return created.id
  }

  const categories: Record<string, number> = {}
  for (const category of categorySeeds) {
    categories[category.slug] = await ensureTag('category', category)
  }

  const tags: Record<string, number> = {}
  for (const tag of tagSeeds) {
    tags[tag.slug] = await ensureTag('tag', tag)
  }
  payload.logger.info('Étiquettes prêtes.')

  for (const tool of selected) {
    if (ONLY) {
      const existing = await payload.find({
        collection: 'tools',
        where: { slug: { equals: tool.slug } },
        draft: true,
        limit: 1,
      })
      if (existing.docs[0]) {
        payload.logger.warn(`${tool.name} existe déjà, rien n'est modifié.`)
        continue
      }
    }

    const dir = path.join(ASSETS, tool.assetDir)
    const tous = fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
          .sort()
      : []

    // L'affiche de la vidéo, tirée de la miniature YouTube, n'entre pas dans la galerie.
    const posterFile = tous.find((file) => /-video\.(jpg|jpeg|png|webp)$/i.test(file))
    const files = tous.filter((file) => file !== posterFile)

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

    let posterId: number | undefined
    if (posterFile) {
      const poster = await payload.create({
        collection: 'media',
        locale: 'en',
        filePath: path.join(dir, posterFile),
        data: { alt: tool.name + ' — video poster', credit: 'Mecanode' },
      })
      await payload.update({
        collection: 'media',
        id: poster.id,
        locale: 'fr',
        data: { alt: 'Affiche de la vidéo de ' + tool.name },
      })
      posterId = poster.id
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
        videoUrl: 'videoUrl' in tool ? tool.videoUrl : undefined,
        videoPoster: posterId,
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
        // Lignes partagées entre langues : reprendre leurs identifiants, voir site-settings.
        releaseNotes: tool.releaseNotes.map((note, i) => ({
          id: created.releaseNotes?.[i]?.id,
          version: note.version,
          date: note.date,
          changes: note.changes.fr,
        })),
        _status: 'published',
      },
    })

    payload.logger.info(`${tool.name} : ${files.length} visuels importés.`)
  }

  if (ONLY) {
    payload.logger.info('Ajout terminé. Chiffres clés et plage de versions restent à régler dans le back-office.')
    process.exit(0)
  }

  const about = await payload.create({
    collection: 'pages',
    locale: 'en',
    data: {
      title: 'Arnaud Szobad',
      slug: 'about',
      role: 'Real-time solutions developer',
      lede: 'I build Unreal Engine systems that run live in front of an audience: TV broadcast, e-sport, live events.',
      content: richText([
        'Eight years in television post-production, eight years in fullstack development, real time since 2016. I read a data stream the way an editor reads rushes, and I structure a project the way a developer does.',
        "My systems have gone live on Eurosport, La chaîne L'Équipe, Amazon Prime Video, Twitch and the UTMB YouTube channel, up to the giant screen on the main square in Chamonix.",
        'Mecanode is where the tools born from that work live.',
      ]),
      timeline: [
        {
          period: '2018 →',
          title: 'Real-time solutions developer, freelance',
          text: 'Procedural generation, augmented reality and broadcast real time: Ai-Verse, the Ultra-Trail du Mont-Blanc with LTV Prod, Riot Games and Amazon with Tessellation, Luxigon.',
        },
        {
          period: '2021 →',
          title: 'Unreal Engine instructor',
          text: 'New3dge and IIM this year; previously ESILV, HELHa, Rubika, INA and Gobelins-Méliès. Engine discovery, algorithms, Blueprint, an introduction to C++, project supervision and defence.',
        },
        {
          period: '2016 — 2018',
          title: 'Real-time studio manager',
          text: 'Alternative Développement, Saint-Denis. Commissioning of the Zero Density Reality virtual studio, Unreal sets, live interaction Blueprints.',
        },
        {
          period: '2008 — 2016',
          title: 'Fullstack developer, project manager',
          text: 'Kiwixi, Paris. Websites and web applications in PHP, JavaScript, HTML and CSS, interfaces and APIs. Total, Prisma Presse, ACTA, French Ministry of Agriculture, mylittleroom.',
        },
        {
          period: '2000 — 2008',
          title: 'Editor and compositor, trainer, freelance',
          text: 'Commercials and show titles for M6, Nickelodeon and France Télévisions. Adobe trainer for professionals and beginners.',
        },
      ],
      _status: 'published',
    },
  })
  await payload.update({
    collection: 'pages',
    id: about.id,
    locale: 'fr',
    data: {
      title: 'Arnaud Szobad',
      role: 'Développeur de solutions temps réel',
      lede: 'Je conçois des systèmes Unreal Engine qui tournent en direct devant du public : diffusion TV, e-sport, événementiel.',
      content: richText([
        "Huit ans de post-production télé, huit ans de développement fullstack, le temps réel depuis 2016. Je lis un flux de données comme un monteur lit un rush, et je structure un projet comme un développeur.",
        "Mes systèmes sont passés en direct sur Eurosport, La chaîne L'Équipe, Amazon Prime Video, Twitch et le YouTube de l'UTMB, jusqu'à l'écran géant de la place de Chamonix.",
        "Mecanode est l'endroit où vivent les outils qui en sont sortis.",
      ]),
      timeline: [
        {
          period: '2018 →',
          title: 'Développeur de solutions temps réel, freelance',
          text: "Génération procédurale, réalité augmentée et temps réel de diffusion : Ai-Verse, l'Ultra-Trail du Mont-Blanc avec LTV Prod, Riot Games et Amazon avec Tessellation, Luxigon.",
        },
        {
          period: '2021 →',
          title: 'Intervenant Unreal Engine',
          text: "New3dge et l'IIM cette année ; auparavant l'ESILV, la HELHa, Rubika, l'INA et les Gobelins-Méliès. Découverte du moteur, algorithmie, Blueprint, initiation au C++, suivi et soutenance de projets.",
        },
        {
          period: '2016 — 2018',
          title: 'Responsable studio temps réel',
          text: "Alternative Développement, Saint-Denis. Mise en service du studio virtuel Zero Density Reality, décors Unreal, Blueprints d'interaction en direct.",
        },
        {
          period: '2008 — 2016',
          title: 'Développeur fullstack, chef de projet',
          text: "Kiwixi, Paris. Sites et applications web en PHP, JavaScript, HTML et CSS, interfaces et API. Total, Prisma Presse, ACTA, Ministère de l'Agriculture, mylittleroom.",
        },
        {
          period: '2000 — 2008',
          title: 'Monteur-truquiste, formateur, freelance',
          text: 'Publicités et génériques pour M6, Nickelodeon et France Télévisions. Formateur Adobe pour professionnels et débutants.',
        },
      ],
      _status: 'published',
    },
  })
  payload.logger.info('Page profil créée.')

  // Les tableaux heroMeta et stats sont partagés entre langues, seuls leurs libellés sont
  // traduits : la version française doit reprendre les identifiants des lignes anglaises,
  // sinon Payload recrée les lignes et les libellés anglais disparaissent.
  const settingsEn = await payload.updateGlobal({
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
      engineRange: '4.25 → 5.8',
      stats: [
        { value: '16', label: 'years in the trade', highlight: true },
        { value: '2016', label: 'on Unreal since', highlight: false },
        { value: '6', label: 'tools published on Fab', highlight: false },
        { value: '7', label: 'schools taught in', highlight: false },
      ],
      elsewhere: [
        { label: 'Fab', url: FAB_STORE },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/arnaud-szobad' },
        { label: 'YouTube', url: 'https://www.youtube.com/channel/UCGmHtN2KGStNThOsoqpGg-Q' },
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
      ].map((row, i) => ({ ...row, id: settingsEn.heroMeta?.[i]?.id })),
      ctaTitle: 'Tout est sur Fab.',
      ctaLede:
        'Un achat, des mises à jour à vie, et des réponses écrites par celui qui a écrit le code.',
      lede: "Plugins d'éditeur et systèmes Blueprint, nés de dix ans de production et d'enseignement. À poser dans le projet, pour livrer plus vite et garder un graphe lisible.",
      footerNote: 'Des outils Unreal Engine, éprouvés en production et essayés en cours.',
      stats: [
        { value: '16', label: 'ans de métier', highlight: true },
        { value: '2016', label: 'sur Unreal depuis', highlight: false },
        { value: '6', label: 'outils publiés sur Fab', highlight: false },
        { value: '7', label: 'écoles où je suis intervenu', highlight: false },
      ].map((row, i) => ({ ...row, id: settingsEn.stats?.[i]?.id })),
    },
  })
  payload.logger.info('Réglages du site écrits.')
  payload.logger.info('Jeu de données terminé.')

  process.exit(0)
}

await seed()
