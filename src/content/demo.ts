/**
 * Contenu de démonstration, repris des maquettes `02-Maquettes/node-graph/`.
 * Fictif : il sert à juger la charpente. Le lot 1 le remplace par les collections Payload,
 * la forme des objets ci-dessous anticipe celle de `Tool`, `Tag` et `SiteSettings`.
 */

export type Locale = 'en' | 'fr'

/** Un texte par langue. Le français absent retombe sur l'anglais, comme dans Payload. */
export type Localized = Record<Locale, string>

export type DemoTool = {
  slug: string
  name: string
  tagline: Localized
  summary: Localized
  category: Localized
  engineVersions: string[]
  fabUrl: string
  featured: boolean
  accent: 'cyan' | 'violet' | 'orange'
}

export type DemoStat = {
  value: string
  label: Localized
  highlight?: boolean
}

export const demoTools: DemoTool[] = [
  {
    slug: 'grid-weaver',
    name: 'Grid Weaver',
    tagline: {
      en: 'Procedural grids that stay art-directable.',
      fr: 'Des grilles procédurales qui restent dirigeables.',
    },
    summary: {
      en: 'Spawn, snap and reshape grids of actors from a single Blueprint node, without losing hand placement.',
      fr: "Génère, aligne et remodèle des grilles d'Actors depuis un seul nœud Blueprint, sans perdre le placement manuel.",
    },
    category: { en: 'Level design', fr: 'Level design' },
    engineVersions: ['5.3', '5.4', '5.5', '5.6', '5.7'],
    fabUrl: 'https://www.fab.com/',
    featured: true,
    accent: 'cyan',
  },
  {
    slug: 'graph-tidy',
    name: 'Graph Tidy',
    tagline: {
      en: 'One shortcut, a readable Event Graph.',
      fr: 'Un raccourci, un Event Graph lisible.',
    },
    summary: {
      en: 'Aligns nodes, straightens wires and groups reroutes across a whole Blueprint, in one pass.',
      fr: "Aligne les nœuds, redresse les fils et regroupe les reroutes d'un Blueprint entier, en une passe.",
    },
    category: { en: 'Editor utility', fr: "Utilitaire d'éditeur" },
    engineVersions: ['5.4', '5.5', '5.6', '5.7'],
    fabUrl: 'https://www.fab.com/',
    featured: true,
    accent: 'violet',
  },
  {
    slug: 'signal-bus',
    name: 'Signal Bus',
    tagline: {
      en: 'Events without the spaghetti.',
      fr: 'Des événements sans les spaghettis.',
    },
    summary: {
      en: 'A typed message bus for Blueprint and C++, with a live inspector to watch traffic while you play.',
      fr: 'Un bus de messages typé pour Blueprint et C++, avec un inspecteur pour suivre le trafic en jeu.',
    },
    category: { en: 'Gameplay framework', fr: 'Cadre de gameplay' },
    engineVersions: ['5.3', '5.4', '5.5', '5.6', '5.7'],
    fabUrl: 'https://www.fab.com/',
    featured: false,
    accent: 'orange',
  },
]

export const demoStats: DemoStat[] = [
  { value: '10', label: { en: 'years of Blueprint', fr: 'ans de Blueprint' } },
  { value: '2', label: { en: 'years of C++', fr: 'ans de C++' }, highlight: true },
  { value: '5.3 → 5.7', label: { en: 'engine versions', fr: "versions d'Unreal" } },
  { value: '3', label: { en: 'tools on Fab', fr: 'outils sur Fab' } },
]

export const demoSite = {
  fabUrl: 'https://www.fab.com/',
  engineRange: '5.3 → 5.7',
  author: 'Arnaud Szobad',
  note: {
    en: 'Unreal Engine tools, built in production and tested in classrooms.',
    fr: "Des outils Unreal Engine, éprouvés en production et essayés en cours.",
  },
  elsewhere: [
    { label: 'YouTube', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Contact', href: '#' },
  ],
}

/** Renvoie la valeur de la langue demandée, repli sur l'anglais si elle manque. */
export function pick(value: Localized, locale: Locale): string {
  return value[locale] || value.en
}
